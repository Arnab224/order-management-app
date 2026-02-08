const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrderStatus,
  getAllOrders,
  updateStatus,
  cancel,
  deleteOrder,
} = require("../controllers/order.controller");

router.post("/", placeOrder);
router.get("/history/all", getAllOrders);
router.patch("/:id/status", updateStatus);
router.patch("/:id/cancel", cancel);
router.delete("/:id", deleteOrder);
router.get("/:id", getOrderStatus);

module.exports = router;
