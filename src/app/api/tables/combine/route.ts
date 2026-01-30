import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { tableRepo } from '@/lib/repository';

export async function POST(req: Request) {
  const { tableIds } = await req.json();
  if (!tableIds || tableIds.length < 2) {
    return NextResponse.json({ error: 'Need at least 2 table IDs' }, { status: 400 });
  }

  const tables = await tableRepo.getAll();
  const groupId = uuid();

  for (const id of tableIds) {
    const table = tables.find((t) => t.id === id);
    if (!table) return NextResponse.json({ error: `Table ${id} not found` }, { status: 404 });
    if (table.mobility === 'fixed') {
      return NextResponse.json({ error: `Table ${id} is fixed and cannot be combined` }, { status: 400 });
    }
  }

  const updated = tables.map((t) => {
    if (tableIds.includes(t.id)) {
      return { ...t, combinationGroupId: groupId, combinedWith: tableIds.find((id: string) => id !== t.id) ?? null };
    }
    return t;
  });

  await tableRepo.saveAll(updated);
  return NextResponse.json(updated.filter((t) => tableIds.includes(t.id)));
}

export async function DELETE(req: Request) {
  const { groupId } = await req.json();
  const tables = await tableRepo.getAll();

  const updated = tables.map((t) => {
    if (t.combinationGroupId === groupId) {
      return { ...t, combinationGroupId: null, combinedWith: null };
    }
    return t;
  });

  await tableRepo.saveAll(updated);
  return NextResponse.json({ ok: true });
}
