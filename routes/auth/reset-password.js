router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  // Find user by token and check expiry
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  // Update password
  user.password = password; // Make sure you hash this in real implementation!
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: 'Password has been reset' });
});
