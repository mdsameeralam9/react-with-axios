import { useEffect, useState } from "react";
import { authApi } from "../util/authApi";

type Profile = { id: string; firstName: string; email: string };

const payload = {
  username: "emilys",
  password: "emilyspass",
  expiresInMins: 30, // optional, defaults to 60
};

export default function ProfileAutoRefresh() {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    authApi
      .post("/auth/login", { ...payload }, { signal: controller.signal })
      .then((response) => {
        localStorage.setItem('accessToken', response.data.accessToken)
         localStorage.setItem('refreshToken', response.data.refreshToken)
        return response;
      })
      .then((r) => setData(r.data))
      .catch((e) => {
        if (e.name === "CanceledError") return;
        setError(e);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {(error as any)?.message ?? "Unknown"}</p>;
  return (
    <div>
      <h3>Welcome, {data?.firstName}</h3>
      <p>{data?.email}</p>
    </div>
  );
}
