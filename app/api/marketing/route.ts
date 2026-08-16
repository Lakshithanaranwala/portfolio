import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  const client = createAdminClient();
  if (!client) return NextResponse.json([]);
  const { data } = await client
    .from('marketing_images')
    .select('id, url, alt')
    .order('order', { ascending: true });
  return NextResponse.json(data ?? []);
}
