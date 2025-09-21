// auth.js (Express router)
const express = require('express');
const crypto = require('crypto');
const User = require('./models/User'); // Your User model
const sendEmail = require('./utils/sendEmail'); // A utility to send emails
const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Find user
  try {
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Create token
  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = Date.now() + 3600000; // 1 hour validity

  // Save token and expiry
  user.resetPasswordToken = token;
  user.resetPasswordExpires = tokenExpiry;
  await user.save();

  // Create reset URL
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

  // Send email
  await sendEmail({
    to: email,
    subject: 'Password Reset',
    text: `Click here to reset your password: ${resetURL}`,
  });

  res.json({ message: 'Reset link sent to your email' });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
}
  });

module.exports = router;
