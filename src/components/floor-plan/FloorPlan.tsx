'use client';
import { useCallback, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { Table, Reservation, SeatingSuggestion } from '@/lib/types';
import { FLOOR_PLAN_WIDTH, FLOOR_PLAN_HEIGHT, BAR_ZONE_WIDTH } from '@/lib/constants';
import { TableDroppable } from './TableDroppable';
import { TableNode } from './TableNode';

interface FloorPlanProps {
  tables: Table[];
  reservations: Reservation[];
  suggestions?: SeatingSuggestion[];
  onAssignTable: (reservationId: string, tableIds: string[]) => void;
  onMoveTable: (tableId: string, position: { x: number; y: number }) => void;
  onTableClick?: (table: Table) => void;
  selectedReservationId?: string | null;
}

export function FloorPlan({
  tables,
  reservations,
  suggestions,
  onAssignTable,
  onMoveTable,
  onTableClick,
  selectedReservationId,
}: FloorPlanProps) {
  const [overTableId, setOverTableId] = useState<string | null>(null);
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const getReservationForTable = useCallback(
    (tableId: string) =>
      reservations.find(
        (r) =>
          r.assignedTableIds.includes(tableId) &&
          r.status !== 'cancelled' &&
          r.status !== 'no-show' &&
          r.status !== 'completed'
      ),
    [reservations]
  );

  const getSuggestionForTable = useCallback(
    (tableId: string) =>
      suggestions?.find((s) => s.suggestedTableIds.includes(tableId)),
    [suggestions]
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const id = String(active.id);
    // If dragging a table (for repositioning)
    if (tables.some((t) => t.id === id && t.mobility === 'movable')) {
      setDraggingTableId(id);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    setOverTableId(over ? String(over.id) : null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;
    const activeId = String(active.id);

    // If we were dragging a table for repositioning
    if (draggingTableId) {
      const table = tables.find((t) => t.id === draggingTableId);
      if (table) {
        // Convert pixel delta to SVG coordinate space
        const svgEl = document.querySelector('#floor-plan-svg');
        if (svgEl) {
          const rect = svgEl.getBoundingClientRect();
          const scaleX = FLOOR_PLAN_WIDTH / rect.width;
          const scaleY = FLOOR_PLAN_HEIGHT / rect.height;
          onMoveTable(draggingTableId, {
            x: table.position.x + delta.x * scaleX,
            y: table.position.y + delta.y * scaleY,
          });
        }
      }
      setDraggingTableId(null);
      setOverTableId(null);
      return;
    }

    // If we're dragging a reservation onto a table
    if (over && !tables.some((t) => t.id === activeId)) {
      onAssignTable(activeId, [String(over.id)]);
    }

    setOverTableId(null);
    setDraggingTableId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full border rounded-xl bg-white shadow-sm overflow-hidden">
        <svg
          id="floor-plan-svg"
          viewBox={`0 0 ${FLOOR_PLAN_WIDTH} ${FLOOR_PLAN_HEIGHT}`}
          className="w-full h-auto"
          style={{ minHeight: 300 }}
        >
          {/* Bar zone background */}
          <rect x={0} y={0} width={BAR_ZONE_WIDTH} height={FLOOR_PLAN_HEIGHT} className="fill-amber-50" />
          <line x1={BAR_ZONE_WIDTH} y1={0} x2={BAR_ZONE_WIDTH} y2={FLOOR_PLAN_HEIGHT} className="stroke-gray-300 stroke-1" strokeDasharray="8 4" />

          {/* Zone labels */}
          <text x={BAR_ZONE_WIDTH / 2} y={30} textAnchor="middle" className="text-sm font-semibold fill-gray-400 select-none">
            Bar & Hightops
          </text>
          <text x={(BAR_ZONE_WIDTH + FLOOR_PLAN_WIDTH) / 2} y={30} textAnchor="middle" className="text-sm font-semibold fill-gray-400 select-none">
            Dining Room
          </text>

          {/* L-shaped bar counter */}
          <path
            d="M 295 70 L 295 480 L 130 480"
            fill="none"
            className="stroke-gray-700"
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Wall dividers at top */}
          <line x1={10} y1={40} x2={160} y2={40} className="stroke-gray-400 stroke-2" />
          <line x1={200} y1={40} x2={340} y2={40} className="stroke-gray-400 stroke-2" />

          {/* Tables */}
          {tables.map((table) => {
            const reservation = getReservationForTable(table.id);
            const suggestion = getSuggestionForTable(table.id);
            const isSelected = selectedReservationId && suggestion?.reservationId === selectedReservationId;

            return (
              <TableDroppable key={table.id} id={table.id} table={table}>
                <TableNode
                  table={table}
                  reservation={reservation}
                  isOver={overTableId === table.id}
                  isDragging={draggingTableId === table.id}
                  suggestion={isSelected ? { score: suggestion!.score, reason: suggestion!.reason } : undefined}
                  onClick={() => onTableClick?.(table)}
                />
              </TableDroppable>
            );
          })}
        </svg>
      </div>
      <DragOverlay dropAnimation={null}>
        {draggingTableId && (() => {
          const t = tables.find((tbl) => tbl.id === draggingTableId);
          if (!t) return null;
          return (
            <svg width={60} height={60} viewBox="-30 -30 60 60">
              <TableNode table={t} isDragging />
            </svg>
          );
        })()}
      </DragOverlay>
    </DndContext>
  );
}
