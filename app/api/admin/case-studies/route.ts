import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { staticCaseStudies } from '@/lib/caseStudies';

export async function GET() {
  try {
    const supabase = createAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('case_studies')
        .select('slug, label, title, scope, year')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch {
    // fall through
  }

  // Return static data summary if Supabase not available
  return NextResponse.json(
    staticCaseStudies.map(({ slug, label, title, scope, year }) => ({
      slug, label, title, scope, year,
    }))
  );
}
