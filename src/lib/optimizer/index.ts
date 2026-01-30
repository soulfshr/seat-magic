import { Table, Reservation, AppConfig, OptimizationResult, SeatingSuggestion } from '../types';
import { findCombinations } from './combiner';
import { totalScore } from './scoring';
import { doTimesOverlap, addMinutesToTime } from '../utils/time';

function isTableAvailable(
  tableIds: string[],
  startTime: string,
  endTime: string,
  bufferMinutes: number,
  reservations: Reservation[]
): boolean {
  const bufferedEnd = addMinutesToTime(endTime, bufferMinutes);
  return !reservations.some(
    (r) =>
      r.status !== 'cancelled' &&
      r.status !== 'no-show' &&
      r.assignedTableIds.some((id) => tableIds.includes(id)) &&
      doTimesOverlap(startTime, bufferedEnd, r.time, addMinutesToTime(r.endTime, bufferMinutes))
  );
}

export function optimize(
  tables: Table[],
  reservations: Reservation[],
  config: AppConfig
): OptimizationResult {
  const unassigned = reservations.filter(
    (r) =>
      r.assignedTableIds.length === 0 &&
      r.status !== 'cancelled' &&
      r.status !== 'no-show'
  );

  const assigned = reservations.filter(
    (r) => r.assignedTableIds.length > 0 && r.status !== 'cancelled' && r.status !== 'no-show'
  );

  // Sort by time, then by VIP (VIPs first), then by party size descending
  const sorted = [...unassigned].sort((a, b) => {
    if (a.isVip !== b.isVip) return a.isVip ? -1 : 1;
    if (a.time !== b.time) return a.time.localeCompare(b.time);
    return b.partySize - a.partySize;
  });

  const assignments: SeatingSuggestion[] = [];
  const simulatedAssigned = [...assigned];
  const conflicts: string[] = [];

  for (const reservation of sorted) {
    // Find all possible table/combination options
    const availableTables = tables.filter((t) =>
      !t.combinedWith || t.combinationGroupId === null
    );

    const combinations = findCombinations(availableTables, reservation.partySize);

    // Score each combination
    const scored = combinations
      .filter((combo) => {
        const ids = combo.tables.map((t) => t.id);
        return isTableAvailable(ids, reservation.time, reservation.endTime, config.bufferMinutes, simulatedAssigned);
      })
      .map((combo) => {
        const { score, reasons } = totalScore(reservation, combo.tables, simulatedAssigned, config);
        return {
          combo,
          score,
          reason: reasons.join('. '),
        };
      })
      .sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      const best = scored[0];
      const tableIds = best.combo.tables.map((t) => t.id);
      assignments.push({
        reservationId: reservation.id,
        suggestedTableIds: tableIds,
        score: best.score,
        reason: best.reason,
      });

      // Simulate this assignment for subsequent scoring
      simulatedAssigned.push({ ...reservation, assignedTableIds: tableIds });
    } else {
      conflicts.push(
        `No available table for ${reservation.guestName} (party of ${reservation.partySize}) at ${reservation.time}`
      );
    }
  }

  const totalCovers = simulatedAssigned.reduce((sum, r) => sum + r.partySize, 0);
  const totalCapacity =
    tables.reduce((sum, t) => sum + t.maxCovers, 0) *
    Math.ceil(
      (timeToMin(config.closeTime) - timeToMin(config.openTime)) /
        (config.tableDiningMinutes + config.bufferMinutes)
    );

  return {
    date: reservations[0]?.date ?? '',
    assignments,
    totalCovers,
    utilizationPercent: totalCapacity > 0 ? Math.round((totalCovers / totalCapacity) * 100) : 0,
    conflicts,
  };
}

function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
