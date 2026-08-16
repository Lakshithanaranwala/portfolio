'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import ImageUpload from '@/components/admin/ImageUpload';
import type { OutcomeCard, OutcomeRow, PainPointGroup, CaseStudyImage } from '@/lib/caseStudies';
import { staticCaseStudies } from '@/lib/caseStudies';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Page = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid #1a1a1a;
  position: sticky;
  top: 0;
  z-index: 10;
  background: #0a0a0a;
`;

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackLink = styled(Link)`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #555;
  text-decoration: none;
  transition: color 0.2s ease;
  &:hover { color: #fff; }
`;

const TopTitle = styled.p`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 300;
  color: #fff;
  letter-spacing: -0.01em;
`;

const TopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SaveBtn = styled.button<{ $saving?: boolean; $saved?: boolean }>`
  padding: 0.5rem 1.25rem;
  background: ${({ $saved }) => ($saved ? '#27ae60' : '#FF6B35')};
  border: none;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: ${({ $saving }) => ($saving ? 'not-allowed' : 'pointer')};
  opacity: ${({ $saving }) => ($saving ? 0.7 : 1)};
  transition: background 0.3s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ $saved }) => ($saved ? '#219a52' : '#e05a26')};
  }
`;

const PreviewLink = styled(Link)`
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #333;
  border-radius: 6px;
  color: #666;
  font-family: var(--font-body);
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: #555;
    color: #fff;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: calc(100vh - 61px);
`;

const Sidebar = styled.nav`
  border-right: 1px solid #1a1a1a;
  padding: 1.5rem 0;
  position: sticky;
  top: 61px;
  height: calc(100vh - 61px);
  overflow-y: auto;
`;

const SideItem = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.6rem 1.5rem;
  background: ${({ $active }) => ($active ? 'rgba(255,107,53,0.12)' : 'none')};
  border: none;
  border-left: 2px solid ${({ $active }) => ($active ? '#FF6B35' : 'transparent')};
  color: ${({ $active }) => ($active ? '#FF6B35' : '#555')};
  font-family: var(--font-body);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ $active }) => ($active ? '#FF6B35' : '#fff')};
    background: rgba(255,255,255,0.03);
  }
`;

const EditorArea = styled.div`
  padding: 2.5rem;
  max-width: 820px;
`;

const TabTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #fff;
  margin-bottom: 0.375rem;
`;

const TabSub = styled.p`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #444;
  margin-bottom: 2rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #1a1a1a;
  margin: 2rem 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FieldLabel = styled.label`
  font-family: var(--font-body);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #555;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: #111;
  border: 1px solid #222;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus { border-color: #FF6B35; }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: #111;
  border: 1px solid #222;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  outline: none;
  resize: vertical;
  min-height: 6rem;
  line-height: 1.6;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus { border-color: #FF6B35; }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const CardGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OutcomeCardBox = styled.div`
  padding: 1.25rem;
  background: #111;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardNum = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: #444;
`;

const RemoveBtn = styled.button`
  padding: 0.25rem 0.6rem;
  background: none;
  border: 1px solid #222;
  border-radius: 4px;
  color: #555;
  font-family: var(--font-body);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e74c3c;
    color: #e74c3c;
  }
`;

const AddBtn = styled.button`
  padding: 0.5rem 1rem;
  background: none;
  border: 1px dashed #333;
  border-radius: 6px;
  color: #444;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    border-color: #FF6B35;
    color: #FF6B35;
  }
`;

const PainGroup = styled.div`
  padding: 1.25rem;
  background: #111;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BulletsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const BulletRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ErrorMsg = styled.p`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #e74c3c;
  padding: 1rem;
  border: 1px solid #2a1111;
  border-radius: 6px;
  background: #1a0808;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background: #111;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  margin-bottom: 0.75rem;
`;

const ToggleLabel = styled.div``;

const ToggleName = styled.p`
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: #fff;
`;

const ToggleDesc = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: #444;
  margin-top: 0.15rem;
`;

const Toggle = styled.button<{ $on: boolean }>`
  width: 40px;
  height: 22px;
  border-radius: 100px;
  border: none;
  background: ${({ $on }) => ($on ? '#FF6B35' : '#222')};
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? '21px' : '3px')};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.2s ease;
  }
`;

const SmallInput = styled.input`
  width: 80px;
  padding: 0.4rem 0.6rem;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.875rem;
  outline: none;
  text-align: center;
  &:focus { border-color: #FF6B35; }
`;

/* ─── Tabs ───────────────────────────────────────────────────────────────── */

const TABS = [
  { key: 'hero', label: 'Hero' },
  { key: 'overview', label: 'Overview' },
  { key: 'challenge', label: 'Challenge' },
  { key: 'problem', label: 'Problem & Goal' },
  { key: 'research', label: 'Research' },
  { key: 'design', label: 'Design' },
  { key: 'outcomes', label: 'Outcomes' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'card', label: 'Homepage Card' },
];

/* ─── Form state type ────────────────────────────────────────────────────── */

type FormState = {
  label: string;
  title: string;
  scope: string;
  role: string;
  client: string;
  year: string;
  heroBgFrom: string;
  heroBgTo: string;
  heroImage: string;
  finalOutcome: OutcomeCard[];
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

function emptyForm(): FormState {
  return {
    label: '',
    title: '',
    scope: '',
    role: '',
    client: '',
    year: '',
    heroBgFrom: '#0f0e17',
    heroBgTo: '#1a1a2e',
    heroImage: '',
    finalOutcome: [
      { metric: '', label: '', description: '' },
      { metric: '', label: '', description: '' },
      { metric: '', label: '', description: '' },
    ],
    overviewBody: '',
    overviewImages: [
      { from: '#0f0e17', to: '#1a1a2e' },
      { from: '#1a1a2e', to: '#16213e' },
    ],
    challengeBody: '',
    problemStatement: '',
    goalBody: '',
    approachBody: '',
    contentImages1: [
      { from: '#0f0e17', to: '#1a1a2e' },
      { from: '#1a1a2e', to: '#16213e' },
    ],
    painPoints: [{ subheading: '', bullets: [''] }],
    insightsBody: '',
    designBody: '',
    contentImages2: [
      { from: '#0f0e17', to: '#1a1a2e' },
      { from: '#1a1a2e', to: '#16213e' },
    ],
    contentImages3: [
      { from: '#0f0e17', to: '#1a1a2e' },
      { from: '#1a1a2e', to: '#16213e' },
      { from: '#0f0e17', to: '#1a1a2e' },
      { from: '#1a1a2e', to: '#16213e' },
    ],
    outcomeRows: [{ problem: '', solution: '', uxImpact: '' }],
    deliveryBody: '',
    finalImages: [
      { from: '#0f0e17', to: '#1a1a2e' },
      { from: '#1a1a2e', to: '#16213e' },
    ],
    archived: false,
    selectedWork: false,
    selectedWorkOrder: null,
    cardTitle: '',
    cardCategory: '',
    cardImages: [],
    cardSlideshow: false,
  };
}

function dbRowToForm(row: Record<string, unknown>): FormState {
  return {
    label: (row.label as string) ?? '',
    title: (row.title as string) ?? '',
    scope: (row.scope as string) ?? '',
    role: (row.role as string) ?? '',
    client: (row.client as string) ?? '',
    year: (row.year as string) ?? '',
    heroBgFrom: (row.hero_bg_from as string) ?? '#0f0e17',
    heroBgTo: (row.hero_bg_to as string) ?? '#1a1a2e',
    heroImage: (row.hero_image as string) ?? '',
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
    outcomeRows: (row.outcome_rows as OutcomeRow[]) ?? [{ problem: '', solution: '', uxImpact: '' }],
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

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CaseStudyEditor() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('hero');
  const [form, setForm] = useState<FormState>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load from DB, fall back to static
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/case-studies/${slug}`);
        if (res.ok) {
          const row = await res.json();
          setForm(dbRowToForm(row));
          setLoading(false);
          return;
        }
      } catch { /* fall through */ }

      // Use static fallback
      const s = staticCaseStudies.find((c) => c.slug === slug);
      if (s) {
        setForm({
          label: s.label,
          title: s.title,
          scope: s.scope,
          role: s.role,
          client: s.client,
          year: s.year,
          heroBgFrom: s.heroBg.from,
          heroBgTo: s.heroBg.to,
          heroImage: s.heroImage ?? '',
          finalOutcome: s.finalOutcome,
          overviewBody: s.overviewBody,
          overviewImages: s.overviewImages,
          challengeBody: s.challengeBody,
          problemStatement: s.problemStatement,
          goalBody: s.goalBody,
          approachBody: s.approachBody,
          contentImages1: s.contentImages1,
          painPoints: s.painPoints,
          insightsBody: s.insightsBody,
          designBody: s.designBody,
          contentImages2: s.contentImages2,
          contentImages3: s.contentImages3,
          outcomeRows: s.outcomeRows,
          deliveryBody: s.deliveryBody,
          finalImages: s.finalImages,
          archived: s.archived,
          selectedWork: s.selectedWork,
          selectedWorkOrder: s.selectedWorkOrder,
          cardTitle: s.cardTitle,
          cardCategory: s.cardCategory,
          cardImages: s.cardImages,
          cardSlideshow: s.cardSlideshow,
        });
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/case-studies/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error ?? 'Save failed');
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError('Network error — could not save.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Page style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: '#444', fontSize: '0.9rem' }}>
          Loading...
        </p>
      </Page>
    );
  }

  return (
    <Page>
      <TopBar>
        <TopLeft>
          <BackLink href="/admin/dashboard">← Dashboard</BackLink>
          <TopTitle>{form.title || slug}</TopTitle>
        </TopLeft>
        <TopRight>
          <PreviewLink href={`/work/${slug}`} target="_blank">Preview ↗</PreviewLink>
          <SaveBtn onClick={handleSave} $saving={saving} $saved={saved} disabled={saving}>
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes'}
          </SaveBtn>
        </TopRight>
      </TopBar>

      <Layout>
        <Sidebar>
          {TABS.map((tab) => (
            <SideItem
              key={tab.key}
              $active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </SideItem>
          ))}
        </Sidebar>

        <EditorArea>
          {error && <ErrorMsg style={{ marginBottom: '1.5rem' }}>{error}</ErrorMsg>}

          {/* ── Hero Tab ─────────────────────────────────────────────── */}
          {activeTab === 'hero' && (
            <>
              <TabTitle>Hero</TabTitle>
              <TabSub>Title, metadata, hero image and final outcome cards.</TabSub>

              <ToggleRow>
                <ToggleLabel>
                  <ToggleName>Archived</ToggleName>
                  <ToggleDesc>Hides this case study from the site entirely.</ToggleDesc>
                </ToggleLabel>
                <Toggle $on={form.archived} onClick={() => set('archived', !form.archived)} />
              </ToggleRow>

              <ToggleRow>
                <ToggleLabel>
                  <ToggleName>Selected Work</ToggleName>
                  <ToggleDesc>Show this on the homepage selected work grid.</ToggleDesc>
                </ToggleLabel>
                <Toggle $on={form.selectedWork} onClick={() => set('selectedWork', !form.selectedWork)} />
              </ToggleRow>

              {form.selectedWork && (
                <Field>
                  <FieldLabel>Display Order (0 = first)</FieldLabel>
                  <SmallInput
                    type="number"
                    min={0}
                    value={form.selectedWorkOrder ?? ''}
                    onChange={(e) =>
                      set('selectedWorkOrder', e.target.value === '' ? null : Number(e.target.value))
                    }
                  />
                </Field>
              )}

              <Divider />

              <TwoCol>
                <Field>
                  <FieldLabel>Label / Short name</FieldLabel>
                  <TextInput value={form.label} onChange={(e) => set('label', e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Year</FieldLabel>
                  <TextInput value={form.year} onChange={(e) => set('year', e.target.value)} />
                </Field>
              </TwoCol>

              <Field>
                <FieldLabel>Title</FieldLabel>
                <TextInput value={form.title} onChange={(e) => set('title', e.target.value)} />
              </Field>

              <TwoCol>
                <Field>
                  <FieldLabel>Scope</FieldLabel>
                  <TextInput value={form.scope} onChange={(e) => set('scope', e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <TextInput value={form.role} onChange={(e) => set('role', e.target.value)} />
                </Field>
              </TwoCol>

              <Field>
                <FieldLabel>Client</FieldLabel>
                <TextInput value={form.client} onChange={(e) => set('client', e.target.value)} />
              </Field>

              <Divider />

              <Field>
                <FieldLabel>Hero Image</FieldLabel>
                <ImageUpload
                  value={form.heroImage}
                  onChange={(url) => set('heroImage', url)}
                />
              </Field>

              <TwoCol>
                <Field>
                  <FieldLabel>Hero BG from (fallback color)</FieldLabel>
                  <TextInput
                    type="color"
                    value={form.heroBgFrom}
                    onChange={(e) => set('heroBgFrom', e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Hero BG to (fallback color)</FieldLabel>
                  <TextInput
                    type="color"
                    value={form.heroBgTo}
                    onChange={(e) => set('heroBgTo', e.target.value)}
                  />
                </Field>
              </TwoCol>

              <Divider />

              <FieldLabel style={{ display: 'block', marginBottom: '1rem' }}>
                Final Outcome Cards
              </FieldLabel>
              <CardGroup>
                {form.finalOutcome.map((card, i) => (
                  <OutcomeCardBox key={i}>
                    <CardHeader>
                      <CardNum>Card {i + 1}</CardNum>
                      {form.finalOutcome.length > 1 && (
                        <RemoveBtn
                          type="button"
                          onClick={() => {
                            const next = form.finalOutcome.filter((_, idx) => idx !== i);
                            set('finalOutcome', next);
                          }}
                        >
                          Remove
                        </RemoveBtn>
                      )}
                    </CardHeader>
                    <TwoCol>
                      <Field>
                        <FieldLabel>Metric</FieldLabel>
                        <TextInput
                          value={card.metric}
                          placeholder="e.g. 66%"
                          onChange={(e) => {
                            const next = [...form.finalOutcome];
                            next[i] = { ...next[i], metric: e.target.value };
                            set('finalOutcome', next);
                          }}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Label</FieldLabel>
                        <TextInput
                          value={card.label}
                          placeholder="e.g. Onboarding Efficiency"
                          onChange={(e) => {
                            const next = [...form.finalOutcome];
                            next[i] = { ...next[i], label: e.target.value };
                            set('finalOutcome', next);
                          }}
                        />
                      </Field>
                    </TwoCol>
                    <Field>
                      <FieldLabel>Description</FieldLabel>
                      <TextArea
                        value={card.description}
                        onChange={(e) => {
                          const next = [...form.finalOutcome];
                          next[i] = { ...next[i], description: e.target.value };
                          set('finalOutcome', next);
                        }}
                      />
                    </Field>
                  </OutcomeCardBox>
                ))}
                <AddBtn
                  type="button"
                  onClick={() =>
                    set('finalOutcome', [
                      ...form.finalOutcome,
                      { metric: '', label: '', description: '' },
                    ])
                  }
                >
                  + Add outcome card
                </AddBtn>
              </CardGroup>
            </>
          )}

          {/* ── Overview Tab ─────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <>
              <TabTitle>Overview</TabTitle>
              <TabSub>Project overview body text.</TabSub>

              <Field>
                <FieldLabel>Overview Body</FieldLabel>
                <RichTextEditor
                  value={form.overviewBody}
                  onChange={(html) => set('overviewBody', html)}
                  placeholder="Describe the project overview..."
                />
              </Field>
            </>
          )}

          {/* ── Challenge Tab ────────────────────────────────────────── */}
          {activeTab === 'challenge' && (
            <>
              <TabTitle>Challenge</TabTitle>
              <TabSub>Describe the design challenge and constraints.</TabSub>

              <Field>
                <FieldLabel>Challenge Body</FieldLabel>
                <RichTextEditor
                  value={form.challengeBody}
                  onChange={(html) => set('challengeBody', html)}
                  placeholder="Describe the challenge..."
                />
              </Field>
            </>
          )}

          {/* ── Problem & Goal Tab ───────────────────────────────────── */}
          {activeTab === 'problem' && (
            <>
              <TabTitle>Problem & Goal</TabTitle>
              <TabSub>Problem statement and goal body text.</TabSub>

              <Field>
                <FieldLabel>Problem Statement</FieldLabel>
                <TextArea
                  value={form.problemStatement}
                  onChange={(e) => set('problemStatement', e.target.value)}
                  placeholder="One bold problem statement sentence..."
                  style={{ minHeight: '4rem' }}
                />
              </Field>

              <Divider />

              <Field>
                <FieldLabel>Goal Body</FieldLabel>
                <RichTextEditor
                  value={form.goalBody}
                  onChange={(html) => set('goalBody', html)}
                  placeholder="Describe the project goal..."
                />
              </Field>
            </>
          )}

          {/* ── Research Tab ─────────────────────────────────────────── */}
          {activeTab === 'research' && (
            <>
              <TabTitle>Research</TabTitle>
              <TabSub>Approach, process images, pain points and insights.</TabSub>

              <Field>
                <FieldLabel>Approach Body</FieldLabel>
                <RichTextEditor
                  value={form.approachBody}
                  onChange={(html) => set('approachBody', html)}
                  placeholder="Describe the research approach..."
                />
              </Field>

              <Divider />

              <FieldLabel style={{ display: 'block', marginBottom: '1rem' }}>
                Process Images (Section 1)
              </FieldLabel>
              {form.contentImages1.map((img, i) => (
                <Field key={i}>
                  <ImageUpload
                    label={`Image ${i + 1}`}
                    value={img.src}
                    onChange={(url) => {
                      const next = [...form.contentImages1];
                      next[i] = { ...next[i], src: url };
                      set('contentImages1', next);
                    }}
                  />
                </Field>
              ))}

              <Divider />

              <FieldLabel style={{ display: 'block', marginBottom: '1rem' }}>
                Pain Points
              </FieldLabel>
              <CardGroup>
                {form.painPoints.map((group, gi) => (
                  <PainGroup key={gi}>
                    <CardHeader>
                      <CardNum>Group {gi + 1}</CardNum>
                      {form.painPoints.length > 1 && (
                        <RemoveBtn
                          type="button"
                          onClick={() => {
                            const next = form.painPoints.filter((_, idx) => idx !== gi);
                            set('painPoints', next);
                          }}
                        >
                          Remove
                        </RemoveBtn>
                      )}
                    </CardHeader>
                    <Field>
                      <FieldLabel>Group Heading</FieldLabel>
                      <TextInput
                        value={group.subheading}
                        onChange={(e) => {
                          const next = [...form.painPoints];
                          next[gi] = { ...next[gi], subheading: e.target.value };
                          set('painPoints', next);
                        }}
                      />
                    </Field>
                    <BulletsArea>
                      <FieldLabel>Bullets</FieldLabel>
                      {group.bullets.map((bullet, bi) => (
                        <BulletRow key={bi}>
                          <TextInput
                            value={bullet}
                            onChange={(e) => {
                              const next = [...form.painPoints];
                              const bullets = [...next[gi].bullets];
                              bullets[bi] = e.target.value;
                              next[gi] = { ...next[gi], bullets };
                              set('painPoints', next);
                            }}
                          />
                          {group.bullets.length > 1 && (
                            <RemoveBtn
                              type="button"
                              onClick={() => {
                                const next = [...form.painPoints];
                                next[gi] = {
                                  ...next[gi],
                                  bullets: next[gi].bullets.filter((_, idx) => idx !== bi),
                                };
                                set('painPoints', next);
                              }}
                            >
                              ×
                            </RemoveBtn>
                          )}
                        </BulletRow>
                      ))}
                      <AddBtn
                        type="button"
                        onClick={() => {
                          const next = [...form.painPoints];
                          next[gi] = { ...next[gi], bullets: [...next[gi].bullets, ''] };
                          set('painPoints', next);
                        }}
                      >
                        + Add bullet
                      </AddBtn>
                    </BulletsArea>
                  </PainGroup>
                ))}
                <AddBtn
                  type="button"
                  onClick={() =>
                    set('painPoints', [
                      ...form.painPoints,
                      { subheading: '', bullets: [''] },
                    ])
                  }
                >
                  + Add pain point group
                </AddBtn>
              </CardGroup>

              <Divider />

              <Field>
                <FieldLabel>Insights Body</FieldLabel>
                <RichTextEditor
                  value={form.insightsBody}
                  onChange={(html) => set('insightsBody', html)}
                  placeholder="Summarise key research insights..."
                />
              </Field>
            </>
          )}

          {/* ── Design Tab ───────────────────────────────────────────── */}
          {activeTab === 'design' && (
            <>
              <TabTitle>Design</TabTitle>
              <TabSub>Design process body text and visual design images.</TabSub>

              <Field>
                <FieldLabel>Design Body</FieldLabel>
                <RichTextEditor
                  value={form.designBody}
                  onChange={(html) => set('designBody', html)}
                  placeholder="Describe the design process..."
                />
              </Field>

              <Divider />

              <FieldLabel style={{ display: 'block', marginBottom: '1rem' }}>
                Visual Design Images (Section 2)
              </FieldLabel>
              {form.contentImages2.map((img, i) => (
                <Field key={i}>
                  <ImageUpload
                    label={`Image ${i + 1}`}
                    value={img.src}
                    onChange={(url) => {
                      const next = [...form.contentImages2];
                      next[i] = { ...next[i], src: url };
                      set('contentImages2', next);
                    }}
                  />
                </Field>
              ))}

              <Divider />

              <FieldLabel style={{ display: 'block', marginBottom: '1rem' }}>
                Visual Design Images (Section 3 — 2×2 grid)
              </FieldLabel>
              {form.contentImages3.map((img, i) => (
                <Field key={i}>
                  <ImageUpload
                    label={`Image ${i + 1}`}
                    value={img.src}
                    onChange={(url) => {
                      const next = [...form.contentImages3];
                      next[i] = { ...next[i], src: url };
                      set('contentImages3', next);
                    }}
                  />
                </Field>
              ))}
            </>
          )}

          {/* ── Outcomes Tab ─────────────────────────────────────────── */}
          {activeTab === 'outcomes' && (
            <>
              <TabTitle>Outcomes</TabTitle>
              <TabSub>Problem / Solution / UX Impact rows. Each row maps to one entry in the three-column table.</TabSub>

              <CardGroup>
                {form.outcomeRows.map((row, i) => (
                  <OutcomeCardBox key={i}>
                    <CardHeader>
                      <CardNum>Row {i + 1}</CardNum>
                      {form.outcomeRows.length > 1 && (
                        <RemoveBtn
                          type="button"
                          onClick={() => {
                            const next = form.outcomeRows.filter((_, idx) => idx !== i);
                            set('outcomeRows', next);
                          }}
                        >
                          Remove
                        </RemoveBtn>
                      )}
                    </CardHeader>
                    <Field>
                      <FieldLabel>Problem</FieldLabel>
                      <TextArea
                        value={row.problem}
                        onChange={(e) => {
                          const next = [...form.outcomeRows];
                          next[i] = { ...next[i], problem: e.target.value };
                          set('outcomeRows', next);
                        }}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Solution</FieldLabel>
                      <TextArea
                        value={row.solution}
                        onChange={(e) => {
                          const next = [...form.outcomeRows];
                          next[i] = { ...next[i], solution: e.target.value };
                          set('outcomeRows', next);
                        }}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>UX Impact</FieldLabel>
                      <TextArea
                        value={row.uxImpact}
                        onChange={(e) => {
                          const next = [...form.outcomeRows];
                          next[i] = { ...next[i], uxImpact: e.target.value };
                          set('outcomeRows', next);
                        }}
                      />
                    </Field>
                  </OutcomeCardBox>
                ))}
                <AddBtn
                  type="button"
                  onClick={() =>
                    set('outcomeRows', [
                      ...form.outcomeRows,
                      { problem: '', solution: '', uxImpact: '' },
                    ])
                  }
                >
                  + Add row
                </AddBtn>
              </CardGroup>
            </>
          )}

          {/* ── Delivery Tab ─────────────────────────────────────────── */}
          {activeTab === 'delivery' && (
            <>
              <TabTitle>Delivery</TabTitle>
              <TabSub>Final delivery and handoff section.</TabSub>

              <Field>
                <FieldLabel>Delivery Body</FieldLabel>
                <RichTextEditor
                  value={form.deliveryBody}
                  onChange={(html) => set('deliveryBody', html)}
                  placeholder="Describe the delivery and handoff..."
                />
              </Field>

              <Divider />

              <FieldLabel style={{ display: 'block', marginBottom: '1rem' }}>
                Final Images (after Delivery)
              </FieldLabel>
              {form.finalImages.map((img, i) => (
                <Field key={i}>
                  <ImageUpload
                    label={`Image ${i + 1}`}
                    value={img.src}
                    onChange={(url) => {
                      const next = [...form.finalImages];
                      next[i] = { ...next[i], src: url };
                      set('finalImages', next);
                    }}
                  />
                </Field>
              ))}
            </>
          )}

          {/* ── Homepage Card Tab ─────────────────────────────────────── */}
          {activeTab === 'card' && (
            <>
              <TabTitle>Homepage Card</TabTitle>
              <TabSub>Controls how this case study appears in the Selected Work grid on the homepage.</TabSub>

              <Field>
                <FieldLabel>Card Title</FieldLabel>
                <TextInput
                  value={form.cardTitle}
                  onChange={(e) => set('cardTitle', e.target.value)}
                  placeholder="e.g. Veevoy Web"
                />
              </Field>

              <Field>
                <FieldLabel>Card Category</FieldLabel>
                <TextInput
                  value={form.cardCategory}
                  onChange={(e) => set('cardCategory', e.target.value)}
                  placeholder="e.g. Website · Branding"
                />
              </Field>

              <Divider />

              <ToggleRow>
                <ToggleLabel>
                  <ToggleName>Image Slideshow</ToggleName>
                  <ToggleDesc>Cycles through multiple images automatically. Only applies when 2+ images are uploaded.</ToggleDesc>
                </ToggleLabel>
                <Toggle
                  $on={form.cardSlideshow}
                  onClick={() => set('cardSlideshow', !form.cardSlideshow)}
                />
              </ToggleRow>

              <Divider />

              <FieldLabel style={{ display: 'block', marginBottom: '1rem' }}>
                Card Images
              </FieldLabel>
              <CardGroup>
                {form.cardImages.map((src, i) => (
                  <OutcomeCardBox key={i}>
                    <CardHeader>
                      <CardNum>Image {i + 1}</CardNum>
                      <RemoveBtn
                        type="button"
                        onClick={() => {
                          const next = form.cardImages.filter((_, idx) => idx !== i);
                          set('cardImages', next);
                        }}
                      >
                        Remove
                      </RemoveBtn>
                    </CardHeader>
                    <ImageUpload
                      value={src}
                      onChange={(url) => {
                        const next = [...form.cardImages];
                        next[i] = url;
                        set('cardImages', next);
                      }}
                    />
                  </OutcomeCardBox>
                ))}
                <AddBtn
                  type="button"
                  onClick={() => set('cardImages', [...form.cardImages, ''])}
                >
                  + Add image
                </AddBtn>
              </CardGroup>
            </>
          )}
        </EditorArea>
      </Layout>
    </Page>
  );
}
