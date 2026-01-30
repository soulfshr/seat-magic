'use client';
import { Table, Reservation } from '@/lib/types';
import clsx from 'clsx';

interface TableNodeProps {
  table: Table;
  reservation?: Reservation;
  isOver?: boolean;
  isDragging?: boolean;
  suggestion?: { score: number; reason: string };
  onClick?: () => void;
}

function getTableColor(table: Table, reservation?: Reservation, isOver?: boolean, suggestion?: { score: number }) {
  if (isOver) return 'fill-indigo-200 stroke-indigo-500';
  if (suggestion) {
    if (suggestion.score >= 80) return 'fill-green-200 stroke-green-500';
    if (suggestion.score >= 50) return 'fill-yellow-200 stroke-yellow-500';
    return 'fill-orange-200 stroke-orange-500';
  }
  if (reservation) {
    if (reservation.status === 'seated') return 'fill-blue-200 stroke-blue-500';
    if (reservation.isVip) return 'fill-purple-200 stroke-purple-500';
    return 'fill-emerald-200 stroke-emerald-500';
  }
  if (table.combinationGroupId) return 'fill-amber-100 stroke-amber-400';
  return 'fill-white stroke-gray-300';
}

export function TableNode({ table, reservation, isOver, isDragging, suggestion, onClick }: TableNodeProps) {
  const color = getTableColor(table, reservation, isOver, suggestion);
  const w = table.isBarSeat ? 20 : table.maxCovers <= 2 ? 50 : table.maxCovers <= 4 ? 60 : table.maxCovers <= 6 ? 80 : 100;
  const h = table.isBarSeat ? 20 : table.maxCovers <= 2 ? 40 : table.maxCovers <= 4 ? 50 : 50;

  return (
    <g
      transform={`translate(${table.position.x}, ${table.position.y}) rotate(${table.rotation})`}
      className={clsx('cursor-pointer transition-all', isDragging && 'opacity-50')}
      onClick={onClick}
    >
      {table.shape === 'round' ? (
        <circle cx={0} cy={0} r={w / 2} className={clsx(color, 'stroke-2')} />
      ) : (
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={table.isBarSeat ? 4 : 6} className={clsx(color, 'stroke-2')} />
      )}

      {/* Seats */}
      {!table.isBarSeat && Array.from({ length: table.defaultCovers }).map((_, i) => {
        let sx: number, sy: number;
        if (table.defaultCovers === 2) {
          // 2-top: seats on left and right (short sides)
          sx = i === 0 ? -(w / 2 + 10) : (w / 2 + 10);
          sy = 0;
        } else {
          const angle = (i / table.defaultCovers) * Math.PI * 2 - Math.PI / 2;
          const radius = Math.max(w, h) / 2 + 10;
          sx = Math.cos(angle) * radius;
          sy = Math.sin(angle) * radius;
        }
        return <circle key={i} cx={sx} cy={sy} r={5} className="fill-gray-200 stroke-gray-400 stroke-1" />;
      })}

      {/* Label */}
      <text
        x={0}
        y={reservation ? -6 : 0}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[9px] font-semibold fill-gray-700 pointer-events-none select-none"
      >
        {table.label}
      </text>

      {/* Guest name when assigned */}
      {reservation && (
        <text
          x={0}
          y={8}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[7px] fill-gray-600 pointer-events-none select-none"
        >
          {reservation.guestName.slice(0, 8)}
        </text>
      )}

      {/* Suggestion score */}
      {suggestion && (
        <text
          x={0}
          y={table.shape === 'round' ? w / 2 + 18 : h / 2 + 18}
          textAnchor="middle"
          className="text-[8px] font-bold fill-green-700 pointer-events-none"
        >
          {suggestion.score}pts
        </text>
      )}

      {/* VIP indicator */}
      {reservation?.isVip && (
        <text
          x={w / 2 - 2}
          y={-h / 2 + 2}
          textAnchor="end"
          className="text-[8px] font-bold fill-purple-600 pointer-events-none"
        >
          VIP
        </text>
      )}
    </g>
  );
}
