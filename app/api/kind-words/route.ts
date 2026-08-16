import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  const client = createAdminClient();
  if (!client) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  const { data } = await client
    .from('kind_words')
    .select('*')
    .order('created_at', { ascending: true });
  return NextResponse.json(data ?? []);
}
