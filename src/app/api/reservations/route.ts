import { NextResponse } from 'next/server';
import { reservationRepo, configRepo, tableRepo } from '@/lib/repository';
import { addMinutesToTime, calculateDuration } from '@/lib/utils/time';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') ?? undefined;
  const reservations = await reservationRepo.getAll(date);
  return NextResponse.json(reservations);
}

export async function POST(req: Request) {
  const body = await req.json();
  const config = await configRepo.get();
  const tables = await tableRepo.getAll();

  // Determine if reservation is at bar
  const isBar = body.assignedTableIds?.some((id: string) => {
    const t = tables.find((tbl) => tbl.id === id);
    return t?.isBarSeat || t?.zone === 'bar';
  }) ?? false;

  const duration = body.durationMinutes ?? calculateDuration(body.time, isBar, config);
  const endTime = addMinutesToTime(body.time, duration);

  const reservation = await reservationRepo.create({
    ...body,
    durationMinutes: duration,
    endTime,
    status: body.status ?? 'confirmed',
    assignedTableIds: body.assignedTableIds ?? [],
    specialRequests: body.specialRequests ?? '',
    isVip: body.isVip ?? false,
    isWalkIn: body.isWalkIn ?? false,
  });

  return NextResponse.json(reservation, { status: 201 });
}
