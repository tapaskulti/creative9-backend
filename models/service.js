const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: String,
  about: String,
  picture: Object,

  basicPrice: String,
  basicPriceCurrency: String,
  basicDetails: Object,

  standardPrice: String,
  standardPriceCurrency: String,
  standardDetails: Object,

  premiumPrice: String,
  premiumPriceCurrency: String,
  premiumDetails: Object,

  categoryDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
});

module.exports = mongoose.model("service", serviceSchema);