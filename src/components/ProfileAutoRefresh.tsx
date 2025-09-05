import { useEffect, useState } from 'react';
import { authApi } from '../util/authApi';

type Profile = { id: string; name: string; email: string };

export default function ProfileAutoRefresh() {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    authApi
      .get<Profile>('/me', { signal: controller.signal })
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
  return (
    <div>
      <h3>Welcome, {data?.name}</h3>
      <p>{data?.email}</p>
    </div>
  );
}
