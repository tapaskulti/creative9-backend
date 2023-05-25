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
  art: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  artistName: {
    type: String,
  },
  year: {
    type: String,
  },
});

module.exports = mongoose.model("art", artSchema);
