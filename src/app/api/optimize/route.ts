import { NextResponse } from 'next/server';
import { tableRepo, reservationRepo, configRepo } from '@/lib/repository';
import { optimize } from '@/lib/optimizer';

export async function POST(req: Request) {
  const { date } = await req.json();
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 });

  const [tables, reservations, config] = await Promise.all([
    tableRepo.getAll(),
    reservationRepo.getAll(date),
    configRepo.get(),
  ]);

  const result = optimize(tables, reservations, config);
  return NextResponse.json(result);
}
