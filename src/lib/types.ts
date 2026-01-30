export type Zone = 'bar' | 'dining';
export type TableShape = 'rectangular' | 'round' | 'bar-seat';
export type TableMobility = 'fixed' | 'movable';
export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';

export interface Position {
  x: number;
  y: number;
}

export interface Table {
  id: string;
  zone: Zone;
  label: string;
  shape: TableShape;
  mobility: TableMobility;
  minCovers: number;
  maxCovers: number;
  defaultCovers: number;
  position: Position;
  rotation: number;
  combinedWith: string | null;
  combinationGroupId: string | null;
  priorityRank: number;
  isBarSeat: boolean;
}

export interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  partySize: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  endTime: string; // HH:mm
  status: ReservationStatus;
  assignedTableIds: string[];
  specialRequests: string;
  isVip: boolean;
  isWalkIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppConfig {
  barDiningMinutes: number;
  tableDiningMinutes: number;
  bufferMinutes: number;
  peakTurnMinutes: number;
  offPeakTurnMinutes: number;
  peakHoursStart: string;
  peakHoursEnd: string;
  operatingDays: number[];
  openTime: string;
  closeTime: string;
  slotGranularity: 15 | 30;
  maxCoversPerSlot: number;
  specialEventMode: boolean;
  specialEventDiningMinutes: number;
}

export interface FloorPlanLayout {
  id: string;
  name: string;
  tablePositions: Record<string, { x: number; y: number; rotation: number }>;
}

export interface SeatingSuggestion {
  reservationId: string;
  suggestedTableIds: string[];
  score: number;
  reason: string;
}

export interface OptimizationResult {
  date: string;
  assignments: SeatingSuggestion[];
  totalCovers: number;
  utilizationPercent: number;
  conflicts: string[];
}
