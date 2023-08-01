const { Schema, model } = require("mongoose");

const chatSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("chat", chatSchema);
