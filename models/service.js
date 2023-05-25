const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  about: {
    type: String,
  },
  picture: [
    {
      id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
  ],
  basicPrice: {
    type: Number,
  },
  basicPriceCurrency: {
    type: String,
  },
  basicDetails: Array,
  standardPrice: {
    type: Number,
  },
  standardPriceCurrency: {
    type: String,
  },
  standardDetails: Array,
  premiumPrice: {
    type: Number,
  },
  premiumPriceCurrency: {
    type: String,
  },
  premiumDetails: Array,
});

module.exports = mongoose.model("service", serviceSchema);
