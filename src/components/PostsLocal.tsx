import { useEffect, useState } from 'react';
import axios from 'axios';

type Post = { id: number; title: string; body: string };

export default function PostsLocal() {
  const [data, setData] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
        signal: controller.signal,
        timeout: 10000,
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {(error as any)?.message ?? 'Unknown'}</p>;
  return <ul>{data?.slice(0, 5).map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}
