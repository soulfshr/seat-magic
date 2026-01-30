'use client';
import useSWR from 'swr';
import { Table } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTables() {
  const { data, error, isLoading, mutate } = useSWR<Table[]>('/api/tables', fetcher, {
    refreshInterval: 5000,
  });

  async function updateTable(id: string, updates: Partial<Table>) {
    await fetch(`/api/tables/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    mutate();
  }

  async function combineTables(tableIds: string[]) {
    await fetch('/api/tables/combine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableIds }),
    });
    mutate();
  }

  async function uncombineTables(groupId: string) {
    await fetch('/api/tables/combine', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId }),
    });
    mutate();
  }

  return {
    tables: data ?? [],
    isLoading,
    error,
    mutate,
    updateTable,
    combineTables,
    uncombineTables,
  };
}
