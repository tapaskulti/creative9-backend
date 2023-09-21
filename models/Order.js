const { model, Schema } = require("mongoose");

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  orderType: {
    type: String,
    enum: ["Painting", "Illustration"],
  },

  art: Object,
  illustration: Object,
  painting_shipping_details: {
    type: String,
  },
  painting_delivery_status: {
    type: String,
    enum: ["DELIVERD", "NOT_DELIVERED"],
    default: "NOT_DELIVERED",
  },
  singlePaymentPrice: {
    type: String,
  },
  milestone: Object,
  illustration_transaction_details: Object,
  illustration_status: {
    type: String,
    enum: ["ONHOLD", "ONGOING", "COMPLETED"],
    default: "ONHOLD",
  },
});

module.exports = model("order", OrderSchema);
