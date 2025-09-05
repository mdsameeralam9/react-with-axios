import { useAxios } from './useAxios';

export default function PostsWithHook() {
  const { data, loading, error, refetch } = useAxios<any[]>({ url: '/posts', method: 'GET' }, []);
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <button onClick={() => refetch()}>Refetch</button>
      <ul>{data?.slice(0, 5).map((p) => <li key={p.id}>{p.title}</li>)}</ul>
    </>
  );
}
