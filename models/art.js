const mongoose = require("mongoose");

const artSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  currency: {
    type: String,
  },
  art: Object,
  // art: {
  //   id: {
  //     type: String,
  //   },
  //   secure_url: {
  //     type: String,
  //   },
  // },
  description: {
    type: String,
  },
  artistName: {
    type: String,
  },
  categoryMedium: {
    type: String,
  },
  height: {
    type: Number,
  },
  width: {
    type: Number,
  },
  year: {
    type: String,
  },
  ratings: Object,
  reviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ArtReview",
  },
});

module.exports = mongoose.model("art", artSchema);
