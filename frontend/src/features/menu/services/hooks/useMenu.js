import { useEffect, useState } from "react";
import { fetchMenu } from "../services/menu.api";

export default function useMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenu()
      .then(res => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load menu");
        setLoading(false);
      });
  }, []);

  return { menu, loading, error };
}
