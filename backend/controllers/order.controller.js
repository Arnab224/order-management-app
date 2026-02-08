const orderService = require("../services/order.service");
const simulateOrderStatus = require("../utils/orderStatusSimulator");

const placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);

    /* 🔥 Get io instance from app */
    const io = req.app.get("io");

    /* 🔥 Pass io to simulator (skip when running without sockets, e.g. tests) */
    if (io && typeof io.emit === "function") {
      simulateOrderStatus(order._id, io);
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const getOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ status: order.status });
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body || {};
    const allowed = ["ORDER_RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await orderService.forceUpdateOrderStatus(req.params.id, status);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ status: order.status });
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ status: order.status });
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await orderService.deleteOrderById(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getOrderStatus,
  getAllOrders,
  updateStatus,
  cancel,
  deleteOrder,
};
