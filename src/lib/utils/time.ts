import { AppConfig } from '../types';

export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function isTimeBetween(time: string, start: string, end: string): boolean {
  const t = timeToMinutes(time);
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  return t >= s && t <= e;
}

export function isPeakTime(time: string, config: AppConfig): boolean {
  return isTimeBetween(time, config.peakHoursStart, config.peakHoursEnd);
}

export function calculateDuration(
  time: string,
  isBarSeat: boolean,
  config: AppConfig
): number {
  if (config.specialEventMode) return config.specialEventDiningMinutes;
  if (isBarSeat) return config.barDiningMinutes;
  return isPeakTime(time, config)
    ? config.peakTurnMinutes
    : config.offPeakTurnMinutes;
}

export function generateTimeSlots(config: AppConfig): string[] {
  const slots: string[] = [];
  const start = timeToMinutes(config.openTime);
  const end = timeToMinutes(config.closeTime);
  for (let t = start; t < end; t += config.slotGranularity) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

export function doTimesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const a0 = timeToMinutes(startA);
  const a1 = timeToMinutes(endA);
  const b0 = timeToMinutes(startB);
  const b1 = timeToMinutes(endB);
  return a0 < b1 && b0 < a1;
}

export function formatTime12h(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}
