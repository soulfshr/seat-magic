'use client';
import useSWR from 'swr';
import { Reservation } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useReservations(date?: string) {
  const url = date ? `/api/reservations?date=${date}` : '/api/reservations';
  const { data, error, isLoading, mutate } = useSWR<Reservation[]>(url, fetcher, {
    refreshInterval: 5000,
  });

  async function createReservation(res: Partial<Reservation>) {
    const resp = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(res),
    });
    const created = await resp.json();
    mutate();
    return created;
  }

  async function updateReservation(id: string, updates: Partial<Reservation>) {
    await fetch(`/api/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    mutate();
  }

  async function deleteReservation(id: string) {
    await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
    mutate();
  }

  async function assignTable(reservationId: string, tableIds: string[]) {
    await updateReservation(reservationId, { assignedTableIds: tableIds });
  }

  return {
    reservations: data ?? [],
    isLoading,
    error,
    mutate,
    createReservation,
    updateReservation,
    deleteReservation,
    assignTable,
  };
}
