import { supabase, createAdminClient } from '@/lib/supabase';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type PainPointGroup = {
  subheading: string;
  bullets: string[];
};

export type CaseStudyImage = {
  from: string;
  to: string;
  src?: string;
};

export type OutcomeCard = {
  metric: string;
  label: string;
  description: string;
};

export type OutcomeRow = {
  problem: string;
  solution: string;
  uxImpact: string;
};

export type SelectedWorkCard = {
  slug: string;
  cardTitle: string;
  cardCategory: string;
  cardImages: string[];
  cardSlideshow: boolean;
  heroBgFrom: string;
  heroBgTo: string;
};

export type CaseStudy = {
  slug: string;
  label: string;
  title: string;
  scope: string;
  role: string;
  client: string;
  year: string;
  heroBg: { from: string; to: string };
  heroImage?: string;
  finalOutcome: OutcomeCard[];
  // Section bodies stored as HTML strings
  overviewBody: string;
  overviewImages: CaseStudyImage[];
  challengeBody: string;
  problemStatement: string;
  goalBody: string;
  approachBody: string;
  contentImages1: CaseStudyImage[];
  painPoints: PainPointGroup[];
  insightsBody: string;
  designBody: string;
  contentImages2: CaseStudyImage[];
  contentImages3: CaseStudyImage[];
  outcomeRows: OutcomeRow[];
  deliveryBody: string;
  finalImages: CaseStudyImage[];
  archived: boolean;
  selectedWork: boolean;
  selectedWorkOrder: number | null;
  cardTitle: string;
  cardCategory: string;
  cardImages: string[];
  cardSlideshow: boolean;
};

/* ─── Shared placeholder content ─────────────────────────────────────────── */

const p = (text: string) => `<p>${text}</p>`;

const placeholderOverviewBody = [
  p('This project focused on designing a cohesive digital product experience from the ground up. The client had a clear vision for the product and a defined set of features, but needed a designer to translate that vision into a structured, usable interface that would work across different user types.'),
  p('I worked on the project as a UX/UI designer. My role included leading the end-to-end design process — from early discovery and user flows through to high-fidelity screens and developer handoff. Collaboration with the development team was central throughout the project.'),
].join('');

const placeholderChallengeBody = [
  p('The main challenge was balancing a wide range of features without overwhelming the user. The product needed to serve both technical and non-technical users, which meant every decision around information architecture and interface complexity had a direct impact on usability.'),
  p('The goal was not to simplify the product to the point of losing functionality, but to find the right structure — one that guided users through complex workflows in a clear, predictable way. This required several rounds of iteration and close collaboration with stakeholders.'),
  p('Another important challenge was maintaining visual consistency across a large number of screens and states. Establishing a solid component foundation early in the process was essential to keeping the design scalable and coherent as the scope grew.'),
].join('');

const placeholderSingleBody = p('To gain a deep understanding of the operational challenges and user needs, a discovery phase was conducted with key stakeholders and end users. These sessions focused on uncovering daily workflows, identifying pain points within the existing system, and understanding unmet requirements related to task management and data handling. Insights gathered from these sessions directly informed the product requirements and helped prioritise features that would deliver the greatest impact.');

const placeholderDeliveryBody = p('To gain a deep understanding of the operational challenges and user needs, a 5 day interview based research phase was conducted with key stakeholders and end users. These sessions focused on uncovering daily workflows, identifying pain points within the existing system, and understanding unmet requirements related to task management, data security and deadline handling. Insights gathered from these interviews directly informed the product requirements and helped prioritised features that would deliver the greatest impact in the system.');

const placeholderPainPoints: PainPointGroup[] = [
  {
    subheading: 'Client Onboarding',
    bullets: [
      'Manual data entry',
      'No structured onboarding flow',
      'Difficult to manage multiple account types',
      'Risk of incomplete or inconsistent information',
    ],
  },
  {
    subheading: 'Task Management',
    bullets: [
      'No clear task ownership or status tracking',
      'Missed deadlines due to lack of visibility',
      'Fragmented communication across channels',
    ],
  },
];

const placeholderOutcome: OutcomeCard[] = [
  {
    metric: '66%',
    label: 'Client Onboarding Efficiency',
    description: 'REDUCES CLIENT ONBOARDING TIME FROM 30 MINS TO 10 MINS BY REDESIGNING ONBOARDING WORKFLOWS AND INTRODUCING STRUCTURED ONBOARDING PROCESS',
  },
  {
    metric: '3×',
    label: 'Faster Task Resolution',
    description: 'REDUCED AVERAGE TASK RESOLUTION TIME BY CONSOLIDATING WORKFLOWS AND REMOVING UNNECESSARY STEPS FROM THE CORE USER JOURNEY',
  },
  {
    metric: '40%',
    label: 'Drop in Support Requests',
    description: 'CLEARER NAVIGATION AND CONTEXTUAL GUIDANCE REDUCED INBOUND SUPPORT TICKETS WITHIN THE FIRST MONTH OF LAUNCH',
  },
];

const placeholderOutcomeRows: OutcomeRow[] = [
  {
    problem: "Users don't know what's pending, what's ongoing, or what's completed.",
    solution: 'Introduced a unified task dashboard with clear status indicators and ownership labels.',
    uxImpact: 'Task visibility increased significantly, reducing missed deadlines and confusion.',
  },
  {
    problem: 'Updates and conversations are spread across emails, chats, and calls.',
    solution: 'Centralised communication into a single contextual thread per task.',
    uxImpact: 'Teams reported fewer miscommunications and faster resolution times.',
  },
];

/* ─── Static fallback data ───────────────────────────────────────────────── */

export const staticCaseStudies: CaseStudy[] = [
  {
    slug: 'veevoy-web',
    label: 'Veevoy',
    title: "Designing Veevoy's Digital Presence",
    scope: 'Website · Branding',
    role: 'UX/UI Designer',
    client: 'Veevoy',
    year: '2024–2025',
    heroBg: { from: '#0f0e17', to: '#1a1a2e' },
    finalOutcome: placeholderOutcome,
    overviewBody: placeholderOverviewBody,
    overviewImages: [{ from: '#0f0e17', to: '#1a1a2e' }, { from: '#1a1a2e', to: '#16213e' }],
    challengeBody: placeholderChallengeBody,
    problemStatement: 'Outdated tooling causes major inefficiency, inconsistent brand presence, and missed growth opportunities.',
    goalBody: placeholderSingleBody,
    approachBody: placeholderSingleBody,
    contentImages1: [{ from: '#0f0e17', to: '#1a1a2e' }, { from: '#1a1a2e', to: '#16213e' }],
    painPoints: placeholderPainPoints,
    insightsBody: placeholderSingleBody,
    designBody: placeholderSingleBody,
    contentImages2: [{ from: '#16213e', to: '#0f3460' }, { from: '#0f3460', to: '#1a1a2e' }],
    contentImages3: [{ from: '#16213e', to: '#0f3460' }, { from: '#0f3460', to: '#1a1a2e' }, { from: '#0f0e17', to: '#1a1a2e' }, { from: '#1a1a2e', to: '#16213e' }],
    outcomeRows: placeholderOutcomeRows,
    deliveryBody: placeholderDeliveryBody,
    finalImages: [{ from: '#0f0e17', to: '#1a1a2e' }, { from: '#1a1a2e', to: '#16213e' }],
    archived: false,
    selectedWork: true,
    selectedWorkOrder: 0,
    cardTitle: 'Veevoy Web',
    cardCategory: 'Website · Branding',
    cardImages: [],
    cardSlideshow: true,
  },
  {
    slug: 'eqvista-app',
    label: 'Eqvista',
    title: 'Redesigning the Eqvista Mobile Experience',
    scope: 'Mobile App · UX Design',
    role: 'UX/UI Designer',
    client: 'Eqvista Inc.',
    year: '2024',
    heroBg: { from: '#0d1b2a', to: '#1b263b' },
    finalOutcome: placeholderOutcome,
    overviewBody: placeholderOverviewBody,
    overviewImages: [{ from: '#0d1b2a', to: '#1b263b' }, { from: '#2d1b69', to: '#553c9a' }],
    challengeBody: placeholderChallengeBody,
    problemStatement: 'Outdated CRM causes major inefficiency, security risks, and missed deadlines.',
    goalBody: placeholderSingleBody,
    approachBody: placeholderSingleBody,
    contentImages1: [{ from: '#0d1b2a', to: '#1b263b' }, { from: '#2d1b69', to: '#553c9a' }],
    painPoints: placeholderPainPoints,
    insightsBody: placeholderSingleBody,
    designBody: placeholderSingleBody,
    contentImages2: [{ from: '#2d1b69', to: '#553c9a' }, { from: '#1a1a2e', to: '#2d1b69' }],
    contentImages3: [{ from: '#2d1b69', to: '#553c9a' }, { from: '#1a1a2e', to: '#2d1b69' }, { from: '#0d1b2a', to: '#1b263b' }, { from: '#2d1b69', to: '#553c9a' }],
    outcomeRows: placeholderOutcomeRows,
    deliveryBody: placeholderDeliveryBody,
    finalImages: [{ from: '#0d1b2a', to: '#1b263b' }, { from: '#2d1b69', to: '#553c9a' }],
    archived: false,
    selectedWork: true,
    selectedWorkOrder: 1,
    cardTitle: 'Eqvista App',
    cardCategory: 'Mobile App · UX Design',
    cardImages: [],
    cardSlideshow: false,
  },
  {
    slug: 'ascend-design-system',
    label: 'Ascend',
    title: 'Building the Ascend Design System',
    scope: 'Component Library · Strategy',
    role: 'Design Systems Lead',
    client: 'Internal',
    year: '2024–2025',
    heroBg: { from: '#1a3a2e', to: '#2d6a4f' },
    finalOutcome: placeholderOutcome,
    overviewBody: placeholderOverviewBody,
    overviewImages: [{ from: '#1a3a2e', to: '#2d6a4f' }, { from: '#0d2b1f', to: '#1a4a35' }],
    challengeBody: placeholderChallengeBody,
    problemStatement: 'Inconsistent components and undocumented patterns slow down every team that ships product.',
    goalBody: placeholderSingleBody,
    approachBody: placeholderSingleBody,
    contentImages1: [{ from: '#1a3a2e', to: '#2d6a4f' }, { from: '#0d2b1f', to: '#1a4a35' }],
    painPoints: placeholderPainPoints,
    insightsBody: placeholderSingleBody,
    designBody: placeholderSingleBody,
    contentImages2: [{ from: '#0d2b1f', to: '#1a4a35' }, { from: '#1a3a2e', to: '#0d2b1f' }],
    contentImages3: [{ from: '#0d2b1f', to: '#1a4a35' }, { from: '#1a3a2e', to: '#0d2b1f' }, { from: '#1a3a2e', to: '#2d6a4f' }, { from: '#0d2b1f', to: '#1a4a35' }],
    outcomeRows: placeholderOutcomeRows,
    deliveryBody: placeholderDeliveryBody,
    finalImages: [{ from: '#1a3a2e', to: '#2d6a4f' }, { from: '#0d2b1f', to: '#1a4a35' }],
    archived: false,
    selectedWork: true,
    selectedWorkOrder: 2,
    cardTitle: 'Ascend Design System',
    cardCategory: 'Component Library · Strategy',
    cardImages: [],
    cardSlideshow: false,
  },
  {
    slug: 'solaris-brand',
    label: 'Solaris',
    title: 'Crafting the Solaris Brand Identity',
    scope: 'Visual Identity · Strategy',
    role: 'Brand Designer',
    client: 'Solaris Studio',
    year: '2024',
    heroBg: { from: '#3a1a1a', to: '#6b2d2d' },
    finalOutcome: placeholderOutcome,
    overviewBody: placeholderOverviewBody,
    overviewImages: [{ from: '#3a1a1a', to: '#6b2d2d' }, { from: '#5c1a1a', to: '#8b3a3a' }],
    challengeBody: placeholderChallengeBody,
    problemStatement: 'No cohesive visual language means every touchpoint feels disconnected and forgettable.',
    goalBody: placeholderSingleBody,
    approachBody: placeholderSingleBody,
    contentImages1: [{ from: '#3a1a1a', to: '#6b2d2d' }, { from: '#5c1a1a', to: '#8b3a3a' }],
    painPoints: placeholderPainPoints,
    insightsBody: placeholderSingleBody,
    designBody: placeholderSingleBody,
    contentImages2: [{ from: '#5c1a1a', to: '#8b3a3a' }, { from: '#3a1a1a', to: '#5c1a1a' }],
    contentImages3: [{ from: '#5c1a1a', to: '#8b3a3a' }, { from: '#3a1a1a', to: '#5c1a1a' }, { from: '#3a1a1a', to: '#6b2d2d' }, { from: '#5c1a1a', to: '#8b3a3a' }],
    outcomeRows: placeholderOutcomeRows,
    deliveryBody: placeholderDeliveryBody,
    finalImages: [{ from: '#3a1a1a', to: '#6b2d2d' }, { from: '#5c1a1a', to: '#8b3a3a' }],
    archived: false,
    selectedWork: true,
    selectedWorkOrder: 3,
    cardTitle: 'Solaris Brand Identity',
    cardCategory: 'Visual Identity · Strategy',
    cardImages: [],
    cardSlideshow: false,
  },
];

/* ─── Data fetching (Supabase → fallback to static) ─────────────────────── */

function dbToCase(row: Record<string, unknown>): CaseStudy {
  return {
    slug: row.slug as string,
    label: row.label as string,
    title: row.title as string,
    scope: row.scope as string,
    role: row.role as string,
    client: row.client as string,
    year: row.year as string,
    heroBg: { from: row.hero_bg_from as string, to: row.hero_bg_to as string },
    heroImage: row.hero_image as string | undefined,
    finalOutcome: (row.final_outcome as OutcomeCard[]) ?? [],
    overviewBody: (row.overview_body as string) ?? '',
    overviewImages: (row.overview_images as CaseStudyImage[]) ?? [],
    challengeBody: (row.challenge_body as string) ?? '',
    problemStatement: (row.problem_statement as string) ?? '',
    goalBody: (row.goal_body as string) ?? '',
    approachBody: (row.approach_body as string) ?? '',
    contentImages1: (row.content_images_1 as CaseStudyImage[]) ?? [],
    painPoints: (row.pain_points as PainPointGroup[]) ?? [],
    insightsBody: (row.insights_body as string) ?? '',
    designBody: (row.design_body as string) ?? '',
    contentImages2: (row.content_images_2 as CaseStudyImage[]) ?? [],
    contentImages3: ((row.content_images_3 as CaseStudyImage[] | null)?.length
      ? row.content_images_3 as CaseStudyImage[]
      : [{ from: '#0f0e17', to: '#1a1a2e' }, { from: '#1a1a2e', to: '#16213e' }, { from: '#0f0e17', to: '#1a1a2e' }, { from: '#1a1a2e', to: '#16213e' }]),
    outcomeRows: (row.outcome_rows as OutcomeRow[]) ?? [],
    deliveryBody: (row.delivery_body as string) ?? '',
    finalImages: ((row.final_images as CaseStudyImage[] | null)?.length
      ? row.final_images as CaseStudyImage[]
      : [{ from: '#0f0e17', to: '#1a1a2e' }, { from: '#1a1a2e', to: '#16213e' }]),
    archived: (row.archived as boolean) ?? false,
    selectedWork: (row.selected_work as boolean) ?? false,
    selectedWorkOrder: (row.selected_work_order as number | null) ?? null,
    cardTitle: (row.card_title as string) ?? '',
    cardCategory: (row.card_category as string) ?? '',
    cardImages: (row.card_images as string[]) ?? [],
    cardSlideshow: (row.card_slideshow as boolean) ?? false,
  };
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { data, error } = await adminClient
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        const study = dbToCase(data);
        if (study.archived) return undefined;
        return study;
      }
    } catch {
      // fall through to static
    }
  }
  return staticCaseStudies.find((s) => s.slug === slug && !s.archived);
}

export async function getSelectedWork(): Promise<SelectedWorkCard[]> {
  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { data, error } = await adminClient
        .from('case_studies')
        .select('slug, card_title, card_category, card_images, card_slideshow, hero_bg_from, hero_bg_to, selected_work_order')
        .eq('selected_work', true)
        .neq('archived', true)
        .order('selected_work_order', { ascending: true });

      if (!error && data) {
        return data.map((row) => ({
          slug: row.slug as string,
          cardTitle: (row.card_title as string) || '',
          cardCategory: (row.card_category as string) || '',
          cardImages: (row.card_images as string[]) || [],
          cardSlideshow: (row.card_slideshow as boolean) || false,
          heroBgFrom: (row.hero_bg_from as string) || '#0f0e17',
          heroBgTo: (row.hero_bg_to as string) || '#1a1a2e',
        }));
      }
    } catch {
      // fall through
    }
  }

  return staticCaseStudies
    .filter((s) => s.selectedWork && !s.archived)
    .sort((a, b) => (a.selectedWorkOrder ?? 999) - (b.selectedWorkOrder ?? 999))
    .map((s) => ({
      slug: s.slug,
      cardTitle: s.cardTitle || s.label,
      cardCategory: s.cardCategory || s.scope,
      cardImages: s.cardImages,
      cardSlideshow: s.cardSlideshow,
      heroBgFrom: s.heroBg.from,
      heroBgTo: s.heroBg.to,
    }));
}

export async function getWorkCards(): Promise<SelectedWorkCard[]> {
  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { data, error } = await adminClient
        .from('case_studies')
        .select('slug, label, card_title, card_category, card_images, card_slideshow, hero_bg_from, hero_bg_to')
        .neq('archived', true)
        .order('label', { ascending: true });

      if (!error && data) {
        return data.map((row) => ({
          slug: row.slug as string,
          cardTitle: (row.card_title as string) || (row.label as string) || '',
          cardCategory: (row.card_category as string) || '',
          cardImages: (row.card_images as string[]) || [],
          cardSlideshow: (row.card_slideshow as boolean) || false,
          heroBgFrom: (row.hero_bg_from as string) || '#0f0e17',
          heroBgTo: (row.hero_bg_to as string) || '#1a1a2e',
        }));
      }
    } catch {
      // fall through
    }
  }

  return staticCaseStudies
    .filter((s) => !s.archived)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((s) => ({
      slug: s.slug,
      cardTitle: s.cardTitle || s.label,
      cardCategory: s.cardCategory || s.scope,
      cardImages: s.cardImages,
      cardSlideshow: s.cardSlideshow,
      heroBgFrom: s.heroBg.from,
      heroBgTo: s.heroBg.to,
    }));
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { data, error } = await adminClient
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) return data.map(dbToCase);
    } catch {
      // fall through
    }
  }
  return staticCaseStudies;
}
