import { Table } from '../types';

export interface TableCombination {
  tables: Table[];
  totalCapacity: number;
}

/**
 * Find all possible table combinations that can seat a given party size.
 * Only movable tables in the same zone can be combined.
 */
export function findCombinations(
  tables: Table[],
  partySize: number,
  maxCombine: number = 3
): TableCombination[] {
  const results: TableCombination[] = [];

  // Single tables that fit
  for (const t of tables) {
    if (partySize <= t.maxCovers) {
      results.push({ tables: [t], totalCapacity: t.maxCovers });
    }
  }

  if (maxCombine < 2) return results;

  // Combinations of movable tables in the same zone
  const movable = tables.filter((t) => t.mobility === 'movable');

  for (let i = 0; i < movable.length; i++) {
    for (let j = i + 1; j < movable.length; j++) {
      if (movable[i].zone !== movable[j].zone) continue;
      const cap = movable[i].maxCovers + movable[j].maxCovers;
      if (partySize <= cap) {
        results.push({ tables: [movable[i], movable[j]], totalCapacity: cap });
      }

      if (maxCombine >= 3) {
        for (let k = j + 1; k < movable.length; k++) {
          if (movable[k].zone !== movable[i].zone) continue;
          const cap3 = cap + movable[k].maxCovers;
          if (partySize <= cap3) {
            results.push({
              tables: [movable[i], movable[j], movable[k]],
              totalCapacity: cap3,
            });
          }
        }
      }
    }
  }

  return results.sort((a, b) => a.tables.length - b.tables.length || a.totalCapacity - b.totalCapacity);
}
