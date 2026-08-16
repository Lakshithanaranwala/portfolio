import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  const client = createAdminClient();
  if (!client) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  const { data } = await client
    .from('marketing_images')
    .select('*')
    .order('order', { ascending: true });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const { url, alt } = await req.json();
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

  const client = createAdminClient();
  if (!client) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

  const { data: existing } = await client
    .from('marketing_images')
    .select('order')
    .order('order', { ascending: false })
    .limit(1);
  const nextOrder = existing?.[0]?.order != null ? existing[0].order + 1 : 0;

  const { data, error } = await client
    .from('marketing_images')
    .insert({ url, alt: alt ?? '', order: nextOrder })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
