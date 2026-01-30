import { NextResponse } from 'next/server';
import { tableRepo } from '@/lib/repository';

export async function GET() {
  const tables = await tableRepo.getAll();
  return NextResponse.json(tables);
}

export async function POST(request: Request) {
  const body = await request.json();
  const table = await tableRepo.create(body);
  return NextResponse.json(table, { status: 201 });
}
