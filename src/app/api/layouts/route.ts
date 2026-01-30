import { NextResponse } from 'next/server';
import { layoutRepo } from '@/lib/repository';

export async function GET() {
  const layouts = await layoutRepo.getAll();
  return NextResponse.json(layouts);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const layout = await layoutRepo.save(body);
  return NextResponse.json(layout);
}
