const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  about: {
    type: String,
  },
  picture: Object,
  basicPrice: {
    type: String,
  },
  basicPriceCurrency: {
    type: String,
  },
  basicDetails: Object,
  standardPrice: {
    type: String,
  },
  standardPriceCurrency: {
    type: String,
  },
  standardDetails: Object,
  premiumPrice: {
    type: String,
  },
  premiumPriceCurrency: {
    type: String,
  },
  premiumDetails: Object,
  categoryDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

module.exports = mongoose.model("service", serviceSchema);
module.exports = mongoose.model('User', userSchema);
