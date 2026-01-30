import {
  JsonTableRepository,
  JsonReservationRepository,
  JsonConfigRepository,
  JsonLayoutRepository,
} from './json-repository';

// Swap these implementations when migrating to Postgres
export const tableRepo = new JsonTableRepository();
export const reservationRepo = new JsonReservationRepository();
export const configRepo = new JsonConfigRepository();
export const layoutRepo = new JsonLayoutRepository();
