'use client';
import { useState } from 'react';
import { TimelineGrid } from '@/components/timeline/TimelineGrid';
import { ReservationForm } from '@/components/reservations/ReservationForm';
import { useTables } from '@/hooks/useTables';
import { useReservations } from '@/hooks/useReservations';
import { useConfig } from '@/hooks/useConfig';
import { Reservation } from '@/lib/types';
import { DEFAULT_CONFIG } from '@/lib/constants';

export default function TimelinePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);

  const { tables } = useTables();
  const { reservations, updateReservation, deleteReservation } = useReservations(selectedDate);
  const { config } = useConfig();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-900">Timeline</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm"
        />
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <TimelineGrid
          tables={tables}
          reservations={reservations}
          config={config ?? DEFAULT_CONFIG}
          onReservationClick={setEditingRes}
        />
      </div>

      {editingRes && (
        <ReservationForm
          open={!!editingRes}
          onClose={() => setEditingRes(null)}
          onSubmit={(data) => {
            updateReservation(editingRes.id, data);
            setEditingRes(null);
          }}
          onDelete={() => {
            deleteReservation(editingRes.id);
            setEditingRes(null);
          }}
          initialData={editingRes}
        />
      )}
    </div>
  );
}
