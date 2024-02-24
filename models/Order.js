const { model, Schema } = require("mongoose");

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  orderType: {
    type: String,
    enum: ["Art", "Illustration"],
  },

  art: Object,
  illustration: Object,
  painting_shipping_details: {
    type: String,
  },
  artPaid: {
    type: Boolean,
    default: false,
  },
  illustrationPaid: {
    type: Boolean,
    default: false,
  },
  painting_delivery_status: {
    type: String,
    enum: ["DELIVERD", "NOT_DELIVERED"],
    default: "NOT_DELIVERED",
  },
  singlePaymentPrice: {
    type: String,
  },
  qty: {
    type: String,
  },
  milestone: Object,
  totalMileStonePrice:{
    type: String,
  },
  illustration_transaction_details: Object,
  illustration_status: {
    type: String,
    enum: ["ONHOLD", "ONGOING", "COMPLETED"],
    default: "ONHOLD",
  },
});

module.exports = model("order", OrderSchema);
