'use client';
import { useState, useEffect } from 'react';
import { AppConfig } from '@/lib/types';
import { Button } from '../shared/Button';

interface ConfigPanelProps {
  config: AppConfig;
  onSave: (config: Partial<AppConfig>) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ConfigPanel({ config, onSave }: ConfigPanelProps) {
  const [form, setForm] = useState<AppConfig>(config);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(config);
  }, [config]);

  function handleSave() {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateField<K extends keyof AppConfig>(key: K, value: AppConfig[K]) {
    setForm({ ...form, [key]: value });
  }

  function toggleDay(day: number) {
    const days = form.operatingDays.includes(day)
      ? form.operatingDays.filter((d) => d !== day)
      : [...form.operatingDays, day].sort();
    updateField('operatingDays', days);
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Dining Times */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Dining Duration (minutes)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bar seating</label>
            <input type="number" min={15} value={form.barDiningMinutes} onChange={(e) => updateField('barDiningMinutes', Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Table seating</label>
            <input type="number" min={15} value={form.tableDiningMinutes} onChange={(e) => updateField('tableDiningMinutes', Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Peak turn time</label>
            <input type="number" min={15} value={form.peakTurnMinutes} onChange={(e) => updateField('peakTurnMinutes', Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Off-peak turn time</label>
            <input type="number" min={15} value={form.offPeakTurnMinutes} onChange={(e) => updateField('offPeakTurnMinutes', Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
      </section>

      {/* Buffer & Capacity */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Buffer & Capacity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Buffer between covers (min)</label>
            <input type="number" min={0} value={form.bufferMinutes} onChange={(e) => updateField('bufferMinutes', Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max covers per time slot</label>
            <input type="number" min={1} value={form.maxCoversPerSlot} onChange={(e) => updateField('maxCoversPerSlot', Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Slot granularity</label>
            <select value={form.slotGranularity} onChange={(e) => updateField('slotGranularity', Number(e.target.value) as 15 | 30)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Operating Hours</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Open</label>
            <input type="time" value={form.openTime} onChange={(e) => updateField('openTime', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Close</label>
            <input type="time" value={form.closeTime} onChange={(e) => updateField('closeTime', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Peak hours start</label>
            <input type="time" value={form.peakHoursStart} onChange={(e) => updateField('peakHoursStart', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Peak hours end</label>
            <input type="time" value={form.peakHoursEnd} onChange={(e) => updateField('peakHoursEnd', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-2">Operating days</label>
          <div className="flex gap-2">
            {DAY_NAMES.map((name, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  form.operatingDays.includes(i)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Special Event */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Special Event Mode</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.specialEventMode}
              onChange={(e) => updateField('specialEventMode', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Enable special event mode
          </label>
          {form.specialEventMode && (
            <div>
              <input
                type="number"
                min={30}
                value={form.specialEventDiningMinutes}
                onChange={(e) => updateField('specialEventDiningMinutes', Number(e.target.value))}
                className="w-24 border rounded-lg px-3 py-1.5 text-sm"
              />
              <span className="text-xs text-gray-500 ml-1">min</span>
            </div>
          )}
        </div>
      </section>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button onClick={handleSave}>Save Settings</Button>
        {saved && <span className="text-sm text-green-600">Settings saved</span>}
      </div>
    </div>
  );
}
