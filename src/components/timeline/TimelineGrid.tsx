'use client';
import { Table, Reservation, AppConfig } from '@/lib/types';
import { generateTimeSlots, timeToMinutes, formatTime12h } from '@/lib/utils/time';
import clsx from 'clsx';

interface TimelineGridProps {
  tables: Table[];
  reservations: Reservation[];
  config: AppConfig;
  onReservationClick?: (reservation: Reservation) => void;
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-blue-200 border-blue-400 text-blue-800',
  seated: 'bg-green-200 border-green-400 text-green-800',
  completed: 'bg-gray-200 border-gray-400 text-gray-600',
  cancelled: 'bg-red-100 border-red-300 text-red-600',
  'no-show': 'bg-yellow-100 border-yellow-300 text-yellow-700',
};

export function TimelineGrid({ tables, reservations, config, onReservationClick }: TimelineGridProps) {
  const slots = generateTimeSlots(config);
  const startMin = timeToMinutes(config.openTime);
  const endMin = timeToMinutes(config.closeTime);
  const totalMinutes = endMin - startMin;

  // Filter out bar seats to reduce clutter
  const displayTables = tables.filter((t) => !t.isBarSeat);

  function getLeft(time: string): string {
    const min = timeToMinutes(time);
    return `${((min - startMin) / totalMinutes) * 100}%`;
  }

  function getWidth(start: string, end: string): string {
    const s = timeToMinutes(start);
    const e = timeToMinutes(end);
    return `${((e - s) / totalMinutes) * 100}%`;
  }

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 800 }}>
        {/* Time header */}
        <div className="flex border-b sticky top-0 bg-white z-10">
          <div className="w-24 shrink-0 p-2 text-xs font-medium text-gray-500 border-r">Table</div>
          <div className="flex-1 relative h-8">
            {slots.map((slot) => (
              <div
                key={slot}
                className="absolute top-0 h-full border-l border-gray-200 text-[10px] text-gray-400 pl-1 pt-1"
                style={{ left: getLeft(slot) }}
              >
                {formatTime12h(slot)}
              </div>
            ))}
          </div>
        </div>

        {/* Table rows */}
        {displayTables.map((table) => {
          const tableRes = reservations.filter(
            (r) =>
              r.assignedTableIds.includes(table.id) &&
              r.status !== 'cancelled' &&
              r.status !== 'no-show'
          );

          return (
            <div key={table.id} className="flex border-b hover:bg-gray-50">
              <div className="w-24 shrink-0 p-2 text-xs font-medium text-gray-700 border-r flex items-center">
                {table.label}
                <span className="ml-1 text-gray-400">({table.maxCovers})</span>
              </div>
              <div className="flex-1 relative h-10">
                {/* Slot grid lines */}
                {slots.map((slot) => (
                  <div
                    key={slot}
                    className="absolute top-0 h-full border-l border-gray-100"
                    style={{ left: getLeft(slot) }}
                  />
                ))}

                {/* Reservation blocks */}
                {tableRes.map((r) => (
                  <div
                    key={r.id}
                    className={clsx(
                      'absolute top-1 bottom-1 rounded border text-[10px] px-1 truncate cursor-pointer hover:opacity-80',
                      statusColors[r.status]
                    )}
                    style={{ left: getLeft(r.time), width: getWidth(r.time, r.endTime) }}
                    onClick={() => onReservationClick?.(r)}
                    title={`${r.guestName} (${r.partySize}) ${r.time}-${r.endTime}`}
                  >
                    {r.guestName} ({r.partySize})
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
