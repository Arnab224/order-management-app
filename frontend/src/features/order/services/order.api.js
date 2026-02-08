import { apiClient } from "../../../shared/services/apiClient";

export const placeOrder = data => apiClient.post("/orders", data);
export const getOrderStatus = id => apiClient.get(`/orders/${id}`);
export const getAllOrders = () => apiClient.get("/orders/history/all");
