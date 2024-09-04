const mongoose = require("mongoose");

const ArtReviewSchema = mongoose.Schema({
  artId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Art",
  },
  illustrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Illustration",
  },
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  reviewTitle: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ArtReview", ArtReviewSchema);
