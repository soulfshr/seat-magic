import { AppConfig, Table, Reservation, FloorPlanLayout } from '../types';

export interface ITableRepository {
  getAll(): Promise<Table[]>;
  getById(id: string): Promise<Table | null>;
  create(table: Omit<Table, 'id'>): Promise<Table>;
  update(id: string, data: Partial<Table>): Promise<Table>;
  delete(id: string): Promise<void>;
  saveAll(tables: Table[]): Promise<void>;
}

export interface IReservationRepository {
  getAll(date?: string): Promise<Reservation[]>;
  getById(id: string): Promise<Reservation | null>;
  create(res: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation>;
  update(id: string, data: Partial<Reservation>): Promise<Reservation>;
  delete(id: string): Promise<void>;
}

export interface IConfigRepository {
  get(): Promise<AppConfig>;
  update(data: Partial<AppConfig>): Promise<AppConfig>;
}

export interface ILayoutRepository {
  getAll(): Promise<FloorPlanLayout[]>;
  save(layout: FloorPlanLayout): Promise<FloorPlanLayout>;
}
