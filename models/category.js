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
});

module.exports = model("category", categorySchema);
