// useAxios.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { api } from './api';

type State<T> = { data: T | null; error: AxiosError | null; loading: boolean };

export function useAxios<T = unknown>(
  config: AxiosRequestConfig,
  deps: any[] = []
) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true });
  const lastConfig = useRef(config);

  const fetchNow = useCallback(async (override?: AxiosRequestConfig) => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const merged: AxiosRequestConfig = {
        ...lastConfig.current,
        ...(override ?? {}),
        signal: controller.signal,
      };
      const res: AxiosResponse<T> = await api.request<T>(merged);
      setState({ data: res.data, error: null, loading: false });
      return res;
    } catch (err) {
      if (axios.isCancel(err)) return;
      setState({ data: null, error: err as any, loading: false });
      throw err;
    }
  }, []);

  useEffect(() => {
    lastConfig.current = config;
  }, [config]);

  useEffect(() => {
    const controller = new AbortController();
    fetchNow({ signal: controller.signal }).catch(() => {});
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: fetchNow };
}
