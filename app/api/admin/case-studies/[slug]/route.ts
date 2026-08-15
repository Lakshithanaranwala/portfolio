import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const updateData = {
    label: body.label,
    title: body.title,
    scope: body.scope,
    role: body.role,
    client: body.client,
    year: body.year,
    hero_bg_from: body.heroBgFrom,
    hero_bg_to: body.heroBgTo,
    hero_image: body.heroImage,
    final_outcome: body.finalOutcome,
    overview_body: body.overviewBody,
    overview_images: body.overviewImages,
    challenge_body: body.challengeBody,
    problem_statement: body.problemStatement,
    goal_body: body.goalBody,
    approach_body: body.approachBody,
    content_images_1: body.contentImages1,
    pain_points: body.painPoints,
    insights_body: body.insightsBody,
    design_body: body.designBody,
    content_images_2: body.contentImages2,
    outcome_rows: body.outcomeRows,
    delivery_body: body.deliveryBody,
    updated_at: new Date().toISOString(),
  };

  // Try update first; if no row exists, insert
  const { data: existing } = await supabase
    .from('case_studies')
    .select('slug')
    .eq('slug', slug)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('case_studies')
      .update(updateData)
      .eq('slug', slug);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from('case_studies')
      .insert({ slug, ...updateData });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
