const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: {
    type: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    required: true,
    validate: {
      validator: (items) => Array.isArray(items) && items.length > 0,
      message: "Order must have at least one item",
    },
  },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  status: {
    type: String,
    enum: ["ORDER_RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
    default: "ORDER_RECEIVED"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
