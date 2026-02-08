import { useState } from "react";
import { placeOrder } from "../services/order.api";

export default function useOrder() {
  const [loading, setLoading] = useState(false);

  const submitOrder = async data => {
    setLoading(true);
    const res = await placeOrder(data);
    setLoading(false);
    return res.data;
  };

  return { submitOrder, loading };
}
