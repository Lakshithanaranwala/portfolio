import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { staticCaseStudies } from '@/lib/caseStudies';

export async function GET() {
  try {
    const supabase = createAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('case_studies')
        .select('slug, label, title, scope, year, archived, selected_work, selected_work_order')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch {
    // fall through
  }

  return NextResponse.json(
    staticCaseStudies.map(({ slug, label, title, scope, year, archived, selectedWork, selectedWorkOrder }) => ({
      slug, label, title, scope, year,
      archived,
      selected_work: selectedWork,
      selected_work_order: selectedWorkOrder,
    }))
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { slug, title, label } = body as { slug: string; title: string; label: string };

  if (!slug || !title || !label) {
    return NextResponse.json({ error: 'slug, title and label are required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { error } = await supabase.from('case_studies').insert({
    slug,
    title,
    label,
    scope: '',
    role: '',
    client: '',
    year: '',
    hero_bg_from: '#0f0e17',
    hero_bg_to: '#1a1a2e',
    final_outcome: [],
    overview_body: '',
    overview_images: [],
    challenge_body: '',
    problem_statement: '',
    goal_body: '',
    approach_body: '',
    content_images_1: [],
    pain_points: [],
    insights_body: '',
    design_body: '',
    content_images_2: [],
    outcome_rows: [],
    delivery_body: '',
    final_images: [],
    archived: false,
    selected_work: false,
    selected_work_order: null,
    card_title: label,
    card_category: '',
    card_images: [],
    card_slideshow: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, slug });
}
