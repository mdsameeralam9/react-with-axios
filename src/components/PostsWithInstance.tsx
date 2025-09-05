import { useEffect, useState } from 'react';
import { api } from '../util/api';

export default function PostsWithInstance() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    api
      .get('/posts', { signal: controller.signal })
      .then((r) => setData(r.data))
      .catch((e) => {
        if (e.name === 'CanceledError') return;
        setError(e);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {(error as any)?.message ?? 'Unknown'}</p>;
  return <ul>{data?.slice(0, 5).map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}
