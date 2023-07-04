const mongoose = require("mongoose");

const ArtReviewSchema = mongoose.Schema({
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
