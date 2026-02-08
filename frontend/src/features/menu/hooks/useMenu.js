import { useEffect, useState } from "react";
import { fetchMenu } from "../services/menu.api";

export default function useMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMenu()
      .then(res => {
        setMenu(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load menu");
      })
      .finally(() => setLoading(false));
  }, []);

  return { menu, loading, error };
}
