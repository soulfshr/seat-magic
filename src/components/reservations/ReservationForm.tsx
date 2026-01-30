'use client';
import { useState, useEffect } from 'react';
import { Reservation } from '@/lib/types';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';

interface ReservationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Reservation>) => void;
  onDelete?: () => void;
  initialData?: Reservation | null;
}

export function ReservationForm({ open, onClose, onSubmit, onDelete, initialData }: ReservationFormProps) {
  const [form, setForm] = useState({
    guestName: '',
    phone: '',
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    specialRequests: '',
    isVip: false,
    isWalkIn: false,
    status: 'confirmed' as Reservation['status'],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        guestName: initialData.guestName,
        phone: initialData.phone,
        partySize: initialData.partySize,
        date: initialData.date,
        time: initialData.time,
        specialRequests: initialData.specialRequests,
        isVip: initialData.isVip,
        isWalkIn: initialData.isWalkIn,
        status: initialData.status,
      });
    } else {
      setForm({
        guestName: '',
        phone: '',
        partySize: 2,
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        specialRequests: '',
        isVip: false,
        isWalkIn: false,
        status: 'confirmed',
      });
    }
  }, [initialData, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Reservation' : 'New Reservation'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
          <input
            type="text"
            required
            value={form.guestName}
            onChange={(e) => setForm({ ...form, guestName: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Party Size</label>
          <input
            type="number"
            min={1}
            max={20}
            required
            value={form.partySize}
            onChange={(e) => setForm({ ...form, partySize: Number(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
          <textarea
            value={form.specialRequests}
            onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
            rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {initialData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Reservation['status'] })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="confirmed">Confirmed</option>
              <option value="seated">Seated</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isVip}
              onChange={(e) => setForm({ ...form, isVip: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            VIP
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isWalkIn}
              onChange={(e) => setForm({ ...form, isWalkIn: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Walk-in
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1">
            {initialData ? 'Update' : 'Create'} Reservation
          </Button>
          {initialData && onDelete && (
            <Button type="button" variant="danger" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
