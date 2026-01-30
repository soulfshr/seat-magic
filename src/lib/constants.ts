import { AppConfig, Table } from './types';

export const DEFAULT_CONFIG: AppConfig = {
  barDiningMinutes: 60,
  tableDiningMinutes: 90,
  bufferMinutes: 15,
  peakTurnMinutes: 75,
  offPeakTurnMinutes: 105,
  peakHoursStart: '18:00',
  peakHoursEnd: '20:30',
  operatingDays: [0, 1, 2, 3, 4, 5, 6], // all week
  openTime: '11:00',
  closeTime: '23:00',
  slotGranularity: 30,
  maxCoversPerSlot: 50,
  specialEventMode: false,
  specialEventDiningMinutes: 120,
};

// Floor plan dimensions (SVG viewBox units)
export const FLOOR_PLAN_WIDTH = 1000;
export const FLOOR_PLAN_HEIGHT = 600;
export const BAR_ZONE_WIDTH = 350;

// Generate default tables
function makeId(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(2, '0')}`;
}

export const DEFAULT_TABLES: Table[] = [
  // === BAR ZONE ===
  // L-shaped bar counter on right side of bar zone, seats on left of counter
  // Vertical segment seats (facing left toward hightops)
  ...Array.from({ length: 6 }, (_, i): Table => ({
    id: makeId('bar', i + 1),
    zone: 'bar',
    label: `Bar ${i + 1}`,
    shape: 'bar-seat',
    mobility: 'fixed',
    minCovers: 1,
    maxCovers: 1,
    defaultCovers: 1,
    position: { x: 225, y: 120 + i * 60 },
    rotation: 0,
    combinedWith: null,
    combinationGroupId: null,
    priorityRank: 10,
    isBarSeat: true,
  })),
  // Bottom horizontal segment seats (facing up)
  ...Array.from({ length: 6 }, (_, i): Table => ({
    id: makeId('bar', i + 7),
    zone: 'bar',
    label: `Bar ${i + 7}`,
    shape: 'bar-seat',
    mobility: 'fixed',
    minCovers: 1,
    maxCovers: 1,
    defaultCovers: 1,
    position: { x: 250 + i * 28, y: 520 },
    rotation: 0,
    combinedWith: null,
    combinationGroupId: null,
    priorityRank: 10,
    isBarSeat: true,
  })),

  // Round 4-top hightop (top-left area of bar zone)
  {
    id: 'ht-05',
    zone: 'bar',
    label: 'HT R',
    shape: 'round',
    mobility: 'movable',
    minCovers: 1,
    maxCovers: 4,
    defaultCovers: 4,
    position: { x: 90, y: 110 },
    rotation: 0,
    combinedWith: null,
    combinationGroupId: null,
    priorityRank: 4,
    isBarSeat: false,
  },

  // 4 rectangular 2-top hightops (left column, stacked vertically)
  // HT 1: below round table
  {
    id: 'ht-01',
    zone: 'bar',
    label: 'HT 1',
    shape: 'rectangular',
    mobility: 'movable',
    minCovers: 1,
    maxCovers: 2,
    defaultCovers: 2,
    position: { x: 90, y: 220 },
    rotation: 0,
    combinedWith: null,
    combinationGroupId: null,
    priorityRank: 5,
    isBarSeat: false,
  },
  // HT 2 & HT 3: two 2-tops pushed together (middle area)
  {
    id: 'ht-02',
    zone: 'bar',
    label: 'HT 2',
    shape: 'rectangular',
    mobility: 'movable',
    minCovers: 1,
    maxCovers: 2,
    defaultCovers: 2,
    position: { x: 90, y: 305 },
    rotation: 0,
    combinedWith: null,
    combinationGroupId: null,
    priorityRank: 5,
    isBarSeat: false,
  },
  {
    id: 'ht-03',
    zone: 'bar',
    label: 'HT 3',
    shape: 'rectangular',
    mobility: 'movable',
    minCovers: 1,
    maxCovers: 2,
    defaultCovers: 2,
    position: { x: 90, y: 360 },
    rotation: 0,
    combinedWith: null,
    combinationGroupId: null,
    priorityRank: 5,
    isBarSeat: false,
  },
  // HT 4: bottom-left
  {
    id: 'ht-04',
    zone: 'bar',
    label: 'HT 4',
    shape: 'rectangular',
    mobility: 'movable',
    minCovers: 1,
    maxCovers: 2,
    defaultCovers: 2,
    position: { x: 90, y: 460 },
    rotation: 0,
    combinedWith: null,
    combinationGroupId: null,
    priorityRank: 5,
    isBarSeat: false,
  },

  // === DINING ROOM ===
  // 3 six-seater booths (fixed)
  ...Array.from({ length: 3 }, (_, i): Table => ({
    id: makeId('booth', i + 1),
    zone: 'dining',
    label: `Booth ${i + 1}`,
    shape: 'rectangular',
    mobility: 'fixed',
    minCovers: 2,
    maxCovers: 6,
    defaultCovers: 6,
    position: { x: 420, y: 80 + i * 140 },
    rotation: 0,
    combinedWith: null,
    combinationGroupId: null,
    priorityRank: 2,
    isBarSeat: false,
  })),

  // 6 rectangular 2-tops (movable, combinable)
  ...Array.from({ length: 6 }, (_, i): Table => ({
    id: makeId('dt', i + 1),
    zone: 'dining',
    label: `T ${i + 1}`,
    shape: 'rectangular',
    mobility: 'movable',
    minCovers: 1,
    maxCovers: 2,
    defaultCovers: 2,
    position: { x: 560 + (i % 3) * 100, y: 100 + Math.floor(i / 3) * 160 },
    rotation: 0,
    combinedWith: null,
    combinationGroupId: null,
    priorityRank: 6,
    isBarSeat: false,
  })),

  // 2 eight-tops (movable)
  ...Array.from({ length: 2 }, (_, i): Table => ({
    id: makeId('lg', i + 1),
    zone: 'dining',
    label: `LG ${i + 1}`,
    shape: 'rectangular',
    mobility: 'movable',
    minCovers: 4,
    maxCovers: 8,
    defaultCovers: 8,
    position: { x: 880, y: 120 + i * 200 },
    rotation: 0,
    combinedWith: null,
    combinationGroupId: null,
    priorityRank: 3,
    isBarSeat: false,
  })),
];
