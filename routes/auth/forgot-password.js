// routes/forgot-password.js
const express = require('express');
const crypto = require('crypto');
const User = require('./models/user'); // adjust path
const sendEmail = require('./utils/sendMail');
const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // For security you may want to return a generic message instead
      return res.status(400).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const html = `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password (valid 1 hour):</p>
      <a href="${resetURL}" target="_blank">${resetURL}</a>
    `;

    await sendEmail(email, "Password Reset Request", html);

    return res.json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error("Forgot-password error:", error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router;
