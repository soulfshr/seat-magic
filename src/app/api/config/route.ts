import { NextResponse } from 'next/server';
import { configRepo } from '@/lib/repository';

export async function GET() {
  const config = await configRepo.get();
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const config = await configRepo.update(body);
  return NextResponse.json(config);
}
