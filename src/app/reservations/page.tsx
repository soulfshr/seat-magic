'use client';
import { useState } from 'react';
import { ReservationForm } from '@/components/reservations/ReservationForm';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { useReservations } from '@/hooks/useReservations';
import { Reservation } from '@/lib/types';
import { formatTime12h } from '@/lib/utils/time';

const statusBadge: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  confirmed: 'info',
  seated: 'success',
  completed: 'default',
  cancelled: 'danger',
  'no-show': 'warning',
};

export default function ReservationsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);

  const { reservations, createReservation, updateReservation, deleteReservation } = useReservations(selectedDate);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-900">Reservations</h1>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          />
          <Button size="sm" onClick={() => { setEditingRes(null); setFormOpen(true); }}>
            + Add
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Guest</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Time</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Party</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Table</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Notes</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No reservations for this date
                </td>
              </tr>
            )}
            {reservations.map((r) => (
              <tr
                key={r.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => { setEditingRes(r); setFormOpen(true); }}
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {r.guestName}
                  {r.isVip && <Badge variant="vip">VIP</Badge>}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatTime12h(r.time)} - {formatTime12h(r.endTime)}
                </td>
                <td className="px-4 py-3 text-gray-600">{r.partySize}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadge[r.status]}>{r.status}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {r.assignedTableIds.length > 0 ? r.assignedTableIds.join(', ') : '-'}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[200px]">
                  {r.specialRequests || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReservationForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingRes(null); }}
        onSubmit={(data) => {
          if (editingRes) {
            updateReservation(editingRes.id, data);
          } else {
            createReservation({ ...data, date: selectedDate });
          }
          setEditingRes(null);
        }}
        onDelete={editingRes ? () => { deleteReservation(editingRes.id); setEditingRes(null); setFormOpen(false); } : undefined}
        initialData={editingRes}
      />
    </div>
  );
}
