const { model, Schema } = require("mongoose");

const categorySchema = new Schema({
  name: {
    type: String,
  },
  picture: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  portfolios: [
    {
      type: Schema.Types.ObjectId,
      ref:"portfolio"
    }
  ]
});

module.exports = model("category", categorySchema);
