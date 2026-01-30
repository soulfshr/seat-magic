import { NextResponse } from 'next/server';
import { tableRepo } from '@/lib/repository';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const table = await tableRepo.getById(id);
  if (!table) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(table);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const table = await tableRepo.update(id, body);
    return NextResponse.json(table);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await tableRepo.delete(id);
  return NextResponse.json({ ok: true });
}
