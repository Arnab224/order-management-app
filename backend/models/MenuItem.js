const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  category: { type: String, default: "other" },
  isVegetarian: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  rating: { type: Number, default: 4.0 },
  deliveryTime: { type: Number, default: 30 } 
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
