'use client';
import { Reservation } from '@/lib/types';
import { ReservationCard } from './ReservationCard';
import { Button } from '../shared/Button';

interface ReservationListProps {
  reservations: Reservation[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onAdd: () => void;
  onEdit: (reservation: Reservation) => void;
  selectedReservationId?: string | null;
  onSelect?: (id: string | null) => void;
}

export function ReservationList({
  reservations,
  selectedDate,
  onDateChange,
  onAdd,
  onEdit,
  selectedReservationId,
  onSelect,
}: ReservationListProps) {
  const unassigned = reservations.filter((r) => r.assignedTableIds.length === 0 && r.status !== 'cancelled' && r.status !== 'no-show');
  const assigned = reservations.filter((r) => r.assignedTableIds.length > 0 && r.status !== 'cancelled' && r.status !== 'no-show');
  const inactive = reservations.filter((r) => r.status === 'cancelled' || r.status === 'no-show');

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Reservations</h2>
          <Button size="sm" onClick={onAdd}>+ Add</Button>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full border rounded-lg px-3 py-1.5 text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {unassigned.length > 0 && (
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase mb-2">
              Unassigned ({unassigned.length})
            </div>
            <div className="space-y-2">
              {unassigned.map((r) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  onClick={() => onEdit(r)}
                  isSelected={r.id === selectedReservationId}
                />
              ))}
            </div>
          </div>
        )}

        {assigned.length > 0 && (
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase mb-2">
              Assigned ({assigned.length})
            </div>
            <div className="space-y-2">
              {assigned.map((r) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  onClick={() => onEdit(r)}
                  isSelected={r.id === selectedReservationId}
                />
              ))}
            </div>
          </div>
        )}

        {inactive.length > 0 && (
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase mb-2">
              Cancelled / No-show ({inactive.length})
            </div>
            <div className="space-y-2 opacity-60">
              {inactive.map((r) => (
                <ReservationCard key={r.id} reservation={r} onClick={() => onEdit(r)} />
              ))}
            </div>
          </div>
        )}

        {reservations.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            No reservations for this date
          </div>
        )}
      </div>
    </div>
  );
}
