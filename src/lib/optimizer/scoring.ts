import { Table, Reservation, AppConfig } from '../types';

export function fitScore(partySize: number, tables: Table[]): number {
  const capacity = tables.reduce((sum, t) => sum + t.maxCovers, 0);
  if (partySize > capacity) return 0;
  const wastedSeats = capacity - partySize;
  // Perfect fit = 100, each wasted seat = -15
  return Math.max(0, 100 - wastedSeats * 15);
}

export function zonePrefScore(partySize: number, isVip: boolean, isWalkIn: boolean, tables: Table[]): number {
  const zone = tables[0]?.zone;
  // Bar is better for small parties and walk-ins
  if (zone === 'bar' && (partySize <= 2 || isWalkIn) && !isVip) return 20;
  // Dining preferred for larger parties and VIPs
  if (zone === 'dining' && (partySize >= 3 || isVip)) return 20;
  return 5;
}

export function priorityScore(tables: Table[]): number {
  const avgPriority = tables.reduce((sum, t) => sum + t.priorityRank, 0) / tables.length;
  // Lower priority rank = higher score (max 10, best = 1)
  return Math.max(0, (11 - avgPriority) * 3);
}

export function combinationPenalty(tables: Table[]): number {
  // Each additional table beyond 1 incurs a penalty
  return tables.length > 1 ? (tables.length - 1) * -10 : 0;
}

export function gapScore(
  reservation: Reservation,
  tableIds: string[],
  existingReservations: Reservation[],
  config: AppConfig
): number {
  // Check how well this assignment utilizes the table's time
  const tableReservations = existingReservations.filter(
    (r) => r.assignedTableIds.some((id) => tableIds.includes(id)) &&
      r.status !== 'cancelled' && r.status !== 'no-show'
  );

  if (tableReservations.length === 0) return 10;

  // Prefer assignments that leave usable gaps (>= dining time) rather than unusable tiny gaps
  const [h, m] = reservation.endTime.split(':').map(Number);
  const endMinutes = h * 60 + m + config.bufferMinutes;

  let hasUsableGapAfter = false;
  const sortedNext = tableReservations
    .filter((r) => {
      const [rh, rm] = r.time.split(':').map(Number);
      return rh * 60 + rm >= endMinutes;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  if (sortedNext.length === 0) {
    // Gap until closing — check if it's usable
    const [ch, cm] = config.closeTime.split(':').map(Number);
    hasUsableGapAfter = (ch * 60 + cm - endMinutes) >= config.tableDiningMinutes;
  } else {
    const [nh, nm] = sortedNext[0].time.split(':').map(Number);
    hasUsableGapAfter = (nh * 60 + nm - endMinutes) >= config.tableDiningMinutes;
  }

  return hasUsableGapAfter ? 15 : 5;
}

export function totalScore(
  reservation: Reservation,
  tables: Table[],
  existingReservations: Reservation[],
  config: AppConfig
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  const fit = fitScore(reservation.partySize, tables);
  score += fit;
  if (fit >= 85) reasons.push('Great table size fit');
  else if (fit >= 50) reasons.push('Acceptable fit');
  else reasons.push('Table is oversized for party');

  const zone = zonePrefScore(reservation.partySize, reservation.isVip, reservation.isWalkIn, tables);
  score += zone;
  if (zone >= 15) reasons.push(`Good zone match (${tables[0]?.zone})`);

  const priority = priorityScore(tables);
  score += priority;

  const combo = combinationPenalty(tables);
  score += combo;
  if (combo < 0) reasons.push('Requires combining tables');

  const tableIds = tables.map((t) => t.id);
  const gap = gapScore(reservation, tableIds, existingReservations, config);
  score += gap;
  if (gap >= 10) reasons.push('Leaves usable time gaps');

  return { score: Math.max(0, Math.min(150, score)), reasons };
}
