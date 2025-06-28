import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}${endpoint}`);
        console.log(res)
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        console.log(json)
        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return { data, loading, error };
}
