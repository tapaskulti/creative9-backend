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
  images: [
    {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
  ],
  offer: Object,
  
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  }, {
  timestamps: true
});

module.exports = model("chat", chatSchema);

