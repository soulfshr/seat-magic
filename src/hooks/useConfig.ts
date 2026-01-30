'use client';
import useSWR from 'swr';
import { AppConfig } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useConfig() {
  const { data, error, isLoading, mutate } = useSWR<AppConfig>('/api/config', fetcher);

  async function updateConfig(updates: Partial<AppConfig>) {
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    mutate();
  }

  return { config: data, isLoading, error, updateConfig, mutate };
}
