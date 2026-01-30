'use client';
import { useDraggable } from '@dnd-kit/core';
import { Reservation } from '@/lib/types';
import { Badge } from '../shared/Badge';
import { formatTime12h } from '@/lib/utils/time';
import clsx from 'clsx';

interface ReservationCardProps {
  reservation: Reservation;
  onClick?: () => void;
  isSelected?: boolean;
}

const statusBadge: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  confirmed: 'info',
  seated: 'success',
  completed: 'default',
  cancelled: 'danger',
  'no-show': 'warning',
};

export function ReservationCard({ reservation, onClick, isSelected }: ReservationCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: reservation.id,
    data: { type: 'reservation', reservation },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={clsx(
        'p-3 bg-white border rounded-lg cursor-grab active:cursor-grabbing transition-all touch-none',
        isDragging && 'opacity-50 shadow-lg',
        isSelected && 'ring-2 ring-indigo-500',
        reservation.assignedTableIds.length > 0 ? 'border-green-200' : 'border-gray-200'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm text-gray-900">{reservation.guestName}</span>
        <Badge variant={statusBadge[reservation.status]}>{reservation.status}</Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{formatTime12h(reservation.time)}</span>
        <span>Party of {reservation.partySize}</span>
        {reservation.isVip && <Badge variant="vip">VIP</Badge>}
        {reservation.isWalkIn && <Badge>Walk-in</Badge>}
      </div>
      {reservation.assignedTableIds.length > 0 && (
        <div className="mt-1 text-xs text-green-600">
          Assigned: {reservation.assignedTableIds.join(', ')}
        </div>
      )}
    </div>
  );
}
