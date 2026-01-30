import { NextResponse } from 'next/server';
import { reservationRepo } from '@/lib/repository';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await reservationRepo.getById(id);
  if (!res) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(res);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const res = await reservationRepo.update(id, body);
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await reservationRepo.delete(id);
  return NextResponse.json({ ok: true });
}
