'use client';
import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { FloorPlan } from '@/components/floor-plan/FloorPlan';
import { ReservationList } from '@/components/reservations/ReservationList';
import { ReservationForm } from '@/components/reservations/ReservationForm';
import { Button } from '@/components/shared/Button';
import { useTables } from '@/hooks/useTables';
import { useReservations } from '@/hooks/useReservations';
import { useOptimizer } from '@/hooks/useOptimizer';
import { Reservation } from '@/lib/types';

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [selectedResId, setSelectedResId] = useState<string | null>(null);

  const { tables, updateTable } = useTables();
  const { reservations, createReservation, updateReservation, deleteReservation, assignTable } = useReservations(selectedDate);
  const { result: optimizationResult, isOptimizing, runOptimization, clearResult } = useOptimizer();

  function handleAssignTable(reservationId: string, tableIds: string[]) {
    assignTable(reservationId, tableIds);
    clearResult();
  }

  function handleMoveTable(tableId: string, position: { x: number; y: number }) {
    updateTable(tableId, { position });
  }

  function handleFormSubmit(data: Partial<Reservation>) {
    if (editingReservation) {
      updateReservation(editingReservation.id, data);
    } else {
      createReservation({ ...data, date: selectedDate } as Partial<Reservation>);
    }
    setEditingReservation(null);
  }

  function handleDelete() {
    if (editingReservation) {
      deleteReservation(editingReservation.id);
      setEditingReservation(null);
      setFormOpen(false);
    }
  }

  async function handleOptimize() {
    const result = await runOptimization(selectedDate);
    if (result?.assignments.length) {
      setSelectedResId(result.assignments[0].reservationId);
    }
  }

  async function handleApplySuggestions() {
    if (!optimizationResult) return;
    for (const assignment of optimizationResult.assignments) {
      await assignTable(assignment.reservationId, assignment.suggestedTableIds);
    }
    clearResult();
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Floor Plan */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-900">Floor Plan</h1>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleOptimize}
              disabled={isOptimizing}
            >
              {isOptimizing ? 'Optimizing...' : 'Suggest Seating'}
            </Button>
            {optimizationResult && optimizationResult.assignments.length > 0 && (
              <Button size="sm" onClick={handleApplySuggestions}>
                Apply All ({optimizationResult.assignments.length})
              </Button>
            )}
          </div>
        </div>

        {optimizationResult && (
          <div className="mb-3 p-3 bg-indigo-50 rounded-lg text-sm">
            <div className="flex items-center gap-4">
              <span><strong>{optimizationResult.assignments.length}</strong> suggestions</span>
              <span><strong>{optimizationResult.totalCovers}</strong> covers</span>
              <span><strong>{optimizationResult.utilizationPercent}%</strong> utilization</span>
              <button onClick={clearResult} className="text-indigo-600 hover:underline ml-auto text-xs">Dismiss</button>
            </div>
            {optimizationResult.conflicts.length > 0 && (
              <div className="mt-2 text-xs text-red-600">
                {optimizationResult.conflicts.map((c, i) => <div key={i}>{c}</div>)}
              </div>
            )}
          </div>
        )}

        <FloorPlan
          tables={tables}
          reservations={reservations}
          suggestions={optimizationResult?.assignments}
          onAssignTable={handleAssignTable}
          onMoveTable={handleMoveTable}
          selectedReservationId={selectedResId}
        />
      </div>

      {/* Reservation Sidebar */}
      <div className="w-full md:w-80 border-l bg-white">
        <DndContext>
          <ReservationList
            reservations={reservations}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAdd={() => { setEditingReservation(null); setFormOpen(true); }}
            onEdit={(r) => { setEditingReservation(r); setFormOpen(true); }}
            selectedReservationId={selectedResId}
            onSelect={setSelectedResId}
          />
        </DndContext>
      </div>

      <ReservationForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingReservation(null); }}
        onSubmit={handleFormSubmit}
        onDelete={editingReservation ? handleDelete : undefined}
        initialData={editingReservation}
      />
    </div>
  );
}
