import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = createAdminClient();
  if (!client) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  const { error } = await client.from('illustrations_images').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
