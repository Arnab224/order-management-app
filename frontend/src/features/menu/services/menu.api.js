import { apiClient } from "../../../shared/services/apiClient";

export const fetchMenu = () => apiClient.get("/menu");
