import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { AppConfig, Table, Reservation, FloorPlanLayout } from '../types';
import { DEFAULT_CONFIG, DEFAULT_TABLES } from '../constants';
import {
  ITableRepository,
  IReservationRepository,
  IConfigRepository,
  ILayoutRepository,
} from './interface';

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'seat-magic-data')
  : path.join(process.cwd(), 'data');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  await ensureDir();
  const filepath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  await ensureDir();
  const filepath = path.join(DATA_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

// === Tables ===
export class JsonTableRepository implements ITableRepository {
  private file = 'tables.json';

  async getAll(): Promise<Table[]> {
    return readJson<Table[]>(this.file, DEFAULT_TABLES);
  }

  async getById(id: string): Promise<Table | null> {
    const tables = await this.getAll();
    return tables.find((t) => t.id === id) ?? null;
  }

  async create(table: Omit<Table, 'id'>): Promise<Table> {
    const tables = await this.getAll();
    const newTable: Table = { ...table, id: uuid() };
    tables.push(newTable);
    await writeJson(this.file, tables);
    return newTable;
  }

  async update(id: string, data: Partial<Table>): Promise<Table> {
    const tables = await this.getAll();
    const idx = tables.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Table ${id} not found`);
    tables[idx] = { ...tables[idx], ...data };
    await writeJson(this.file, tables);
    return tables[idx];
  }

  async delete(id: string): Promise<void> {
    const tables = await this.getAll();
    await writeJson(
      this.file,
      tables.filter((t) => t.id !== id)
    );
  }

  async saveAll(tables: Table[]): Promise<void> {
    await writeJson(this.file, tables);
  }
}

// === Reservations ===
export class JsonReservationRepository implements IReservationRepository {
  private file = 'reservations.json';

  async getAll(date?: string): Promise<Reservation[]> {
    const all = await readJson<Reservation[]>(this.file, []);
    if (date) return all.filter((r) => r.date === date);
    return all;
  }

  async getById(id: string): Promise<Reservation | null> {
    const all = await readJson<Reservation[]>(this.file, []);
    return all.find((r) => r.id === id) ?? null;
  }

  async create(
    res: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Reservation> {
    const all = await readJson<Reservation[]>(this.file, []);
    const now = new Date().toISOString();
    const newRes: Reservation = { ...res, id: uuid(), createdAt: now, updatedAt: now };
    all.push(newRes);
    await writeJson(this.file, all);
    return newRes;
  }

  async update(id: string, data: Partial<Reservation>): Promise<Reservation> {
    const all = await readJson<Reservation[]>(this.file, []);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Reservation ${id} not found`);
    all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
    await writeJson(this.file, all);
    return all[idx];
  }

  async delete(id: string): Promise<void> {
    const all = await readJson<Reservation[]>(this.file, []);
    await writeJson(
      this.file,
      all.filter((r) => r.id !== id)
    );
  }
}

// === Config ===
export class JsonConfigRepository implements IConfigRepository {
  private file = 'config.json';

  async get(): Promise<AppConfig> {
    return readJson<AppConfig>(this.file, DEFAULT_CONFIG);
  }

  async update(data: Partial<AppConfig>): Promise<AppConfig> {
    const current = await this.get();
    const updated = { ...current, ...data };
    await writeJson(this.file, updated);
    return updated;
  }
}

// === Layouts ===
export class JsonLayoutRepository implements ILayoutRepository {
  private file = 'layouts.json';

  async getAll(): Promise<FloorPlanLayout[]> {
    return readJson<FloorPlanLayout[]>(this.file, []);
  }

  async save(layout: FloorPlanLayout): Promise<FloorPlanLayout> {
    const all = await this.getAll();
    const idx = all.findIndex((l) => l.id === layout.id);
    if (idx >= 0) {
      all[idx] = layout;
    } else {
      all.push({ ...layout, id: layout.id || uuid() });
    }
    await writeJson(this.file, all);
    return layout;
  }
}
