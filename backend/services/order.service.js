const Order = require("../models/Order");

const createOrder = async (data) => {
  return await Order.create(data);
};

const getOrderById = async (id) => {
  return await Order.findById(id);
};

const getAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 });
};

const updateOrderStatus = async (id, status) => {
  // Don't overwrite terminal states
  const order = await Order.findById(id);
  if (!order) return null;
  if (["DELIVERED", "CANCELLED"].includes(order.status)) return order;
  order.status = status;
  return await order.save();
};

const forceUpdateOrderStatus = async (id, status) => {
  return await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
};

const cancelOrder = async (id) => {
  const order = await Order.findById(id);
  if (!order) return null;
  if (order.status === "DELIVERED") {
    const err = new Error("Cannot cancel a delivered order");
    err.statusCode = 409;
    throw err;
  }
  if (order.status === "CANCELLED") return order;
  order.status = "CANCELLED";
  return await order.save();
};

const deleteOrderById = async (id) => {
  return await Order.findByIdAndDelete(id);
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  forceUpdateOrderStatus,
  cancelOrder,
  deleteOrderById,
};
