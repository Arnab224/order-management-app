const orderService = require("../services/order.service");

const simulateOrderStatus = (orderId, io) => {
  const statuses = ["PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

  statuses.forEach((status, index) => {
    setTimeout(async () => {
      const updated = await orderService.updateOrderStatus(orderId, status);

      if (!updated) return;
      if (updated.status !== status) return;

      io.emit("order-status-update", {
        orderId: orderId.toString(),
        status,
      });
    }, (index + 1) * 5000);
  });
};

module.exports = simulateOrderStatus;
