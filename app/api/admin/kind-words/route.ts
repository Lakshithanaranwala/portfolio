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

export async function POST(req: Request) {
  const { quote, name, position, company } = await req.json();
  if (!quote || !name) return NextResponse.json({ error: 'quote and name required' }, { status: 400 });

  const client = createAdminClient();
  if (!client) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

  const { data, error } = await client
    .from('kind_words')
    .insert({ quote, name, position: position ?? '', company: company ?? '' })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
