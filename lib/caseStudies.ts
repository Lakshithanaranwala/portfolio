import { supabase } from '@/lib/supabase';

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
  problemColumn: string;
  solutionColumn: string;
  uxImpactColumn: string;
  deliveryBody: string;
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

const placeholderColumn = "Users don't know what's pending, what's ongoing, or what's completed. Users struggle to identify what needs urgent attention. Updates and conversations are spread across emails, chats, and calls. Users don't know who is responsible for what.";

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
    problemColumn: placeholderColumn,
    solutionColumn: placeholderColumn,
    uxImpactColumn: placeholderColumn,
    deliveryBody: placeholderDeliveryBody,
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
    problemColumn: placeholderColumn,
    solutionColumn: placeholderColumn,
    uxImpactColumn: placeholderColumn,
    deliveryBody: placeholderDeliveryBody,
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
    problemColumn: placeholderColumn,
    solutionColumn: placeholderColumn,
    uxImpactColumn: placeholderColumn,
    deliveryBody: placeholderDeliveryBody,
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
    problemColumn: placeholderColumn,
    solutionColumn: placeholderColumn,
    uxImpactColumn: placeholderColumn,
    deliveryBody: placeholderDeliveryBody,
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
    problemColumn: (row.problem_column as string) ?? '',
    solutionColumn: (row.solution_column as string) ?? '',
    uxImpactColumn: (row.ux_impact_column as string) ?? '',
    deliveryBody: (row.delivery_body as string) ?? '',
  };
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) return dbToCase(data);
    } catch {
      // fall through to static
    }
  }
  return staticCaseStudies.find((s) => s.slug === slug);
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
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
