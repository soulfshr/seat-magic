import { Reservation, Table } from '../types';
import { doTimesOverlap } from './time';

export function canSeatParty(tables: Table[], partySize: number): boolean {
  const totalCapacity = tables.reduce((sum, t) => sum + t.maxCovers, 0);
  return partySize <= totalCapacity;
}

export function hasConflict(
  reservation: Reservation,
  existingReservations: Reservation[],
  bufferMinutes: number
): Reservation | null {
  for (const existing of existingReservations) {
    if (existing.id === reservation.id) continue;
    if (existing.status === 'cancelled' || existing.status === 'no-show') continue;

    // Check if they share any assigned tables
    const sharedTables = reservation.assignedTableIds.filter((id) =>
      existing.assignedTableIds.includes(id)
    );
    if (sharedTables.length === 0) continue;

    // Check time overlap (with buffer)
    const existingEnd = addBufferToTime(existing.endTime, bufferMinutes);
    if (doTimesOverlap(reservation.time, reservation.endTime, existing.time, existingEnd)) {
      return existing;
    }
  }
  return null;
}

function addBufferToTime(time: string, buffer: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + buffer;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}
