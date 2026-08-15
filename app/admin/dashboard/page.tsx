'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styled from 'styled-components';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

type ShowcaseImage = {
  id: string;
  url: string;
  alt: string;
  order: number;
};

type StudySummary = {
  slug: string;
  label: string;
  title: string;
  scope: string;
  year: string;
  archived: boolean;
  selected_work: boolean;
  selected_work_order: number | null;
};

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
`;

const Brand = styled.p`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #fff;
`;

const LogoutBtn = styled.button`
  padding: 0.4rem 1rem;
  background: none;
  border: 1px solid #333;
  border-radius: 6px;
  color: #666;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #e74c3c; color: #e74c3c; }
`;

const Content = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-body);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #444;
`;

const NewBtn = styled.button`
  padding: 0.5rem 1.25rem;
  background: #FF6B35;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover { background: #e05a26; }
`;

const Divider = styled.div`
  height: 1px;
  background: #1a1a1a;
  margin: 2.5rem 0;
`;

/* ── Selected work list ── */

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OrderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  background: #111;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
`;

const OrderNum = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: #333;
  width: 1.5rem;
  flex-shrink: 0;
  text-align: center;
`;

const OrderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OrderTitle = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OrderScope = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: #444;
  margin-top: 0.1rem;
`;

const OrderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const IconBtn = styled.button<{ $danger?: boolean }>`
  padding: 0.3rem 0.6rem;
  background: none;
  border: 1px solid #222;
  border-radius: 4px;
  color: #555;
  font-family: var(--font-body);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    border-color: ${({ $danger }) => ($danger ? '#e74c3c' : '#FF6B35')};
    color: ${({ $danger }) => ($danger ? '#e74c3c' : '#FF6B35')};
  }
  &:disabled { opacity: 0.2; cursor: default; }
`;

const EditLink = styled(Link)`
  padding: 0.3rem 0.75rem;
  background: none;
  border: 1px solid #222;
  border-radius: 4px;
  color: #555;
  font-family: var(--font-body);
  font-size: 0.75rem;
  text-decoration: none;
  transition: all 0.15s ease;
  &:hover { border-color: #555; color: #fff; }
`;

/* ── All studies grid ── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`;

const StudyCard = styled(Link)<{ $archived?: boolean }>`
  display: block;
  padding: 1.5rem;
  background: #111;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  text-decoration: none;
  opacity: ${({ $archived }) => ($archived ? 0.45 : 1)};
  transition: border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease;
  &:hover { border-color: #FF6B35; background: #141414; opacity: 1; }
`;

const CardBadge = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FF6B35;
  border: 1px solid rgba(255,107,53,0.3);
  border-radius: 100px;
  padding: 0.15rem 0.5rem;
  margin-bottom: 0.5rem;
`;

const ArchivedBadge = styled(CardBadge)`
  color: #555;
  border-color: #333;
`;

const CardScope = styled.p`
  font-family: var(--font-body);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.p`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 300;
  color: #fff;
  letter-spacing: -0.01em;
  margin-bottom: 0.25rem;
`;

const CardMeta = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: #444;
`;

const EditArrow = styled.span`
  display: block;
  margin-top: 1.25rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: #333;
  transition: color 0.2s ease;
  ${StudyCard}:hover & { color: #FF6B35; }
`;

const EmptyNote = styled.p`
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: #333;
  padding: 1.5rem 0;
`;

/* ── Create modal ── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 440px;
`;

const ModalTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 300;
  color: #fff;
  margin-bottom: 0.25rem;
`;

const ModalSub = styled.p`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #444;
  margin-bottom: 1.75rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
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
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
  &:focus { border-color: #FF6B35; }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 0.6rem;
  background: none;
  border: 1px solid #333;
  border-radius: 6px;
  color: #555;
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #555; color: #fff; }
`;

const CreateBtn = styled.button`
  flex: 1;
  padding: 0.6rem;
  background: #FF6B35;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover { background: #e05a26; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ErrorMsg = styled.p`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #e74c3c;
  margin-top: 0.75rem;
`;

/* ── Tab nav ── */

const TabNav = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid #1a1a1a;
  margin-bottom: 2.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#FF6B35' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : '#444')};
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
  margin-bottom: -1px;
  &:hover { color: #fff; }
`;

/* ── Messages list ── */

const MsgList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MsgCard = styled.div`
  background: #111;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
`;

const MsgHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const MsgMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const MsgName = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: #fff;
`;

const MsgEmail = styled.p`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #555;
  margin-top: 0.1rem;
`;

const MsgSubject = styled.p`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #888;
  margin-top: 0.1rem;
`;

const MsgDate = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: #333;
  flex-shrink: 0;
`;

const MsgBody = styled.p`
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.65;
  color: #666;
  border-top: 1px solid #1a1a1a;
  padding-top: 0.875rem;
  white-space: pre-wrap;
`;

const DeleteBtn = styled.button`
  padding: 0.3rem 0.75rem;
  background: none;
  border: 1px solid #222;
  border-radius: 4px;
  color: #555;
  font-family: var(--font-body);
  font-size: 0.75rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
  &:hover { border-color: #e74c3c; color: #e74c3c; }
`;

/* ── Showcase ── */

const ShowcaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ShowcaseCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #111;
  border: 1px solid #1a1a1a;
`;

const ShowcaseThumb = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
`;

const ShowcaseCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
`;

const ShowcaseAlt = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`;

const UploadZone = styled.label<{ $uploading: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  border: 2px dashed ${({ $uploading }) => ($uploading ? '#FF6B35' : '#222')};
  border-radius: 8px;
  cursor: ${({ $uploading }) => ($uploading ? 'not-allowed' : 'pointer')};
  transition: border-color 0.2s ease;
  &:hover { border-color: #FF6B35; }
`;

const UploadText = styled.p`
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: #555;
`;

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'studies' | 'messages' | 'showcase'>('studies');
  const [studies, setStudies] = useState<StudySummary[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showcaseImages, setShowcaseImages] = useState<ShowcaseImage[]>([]);
  const [showcaseUploading, setShowcaseUploading] = useState(false);
  const showcaseInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  function loadStudies() {
    fetch('/api/admin/case-studies')
      .then((r) => r.json())
      .then(setStudies);
  }

  function loadMessages() {
    fetch('/api/admin/messages')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setMessages(data); });
  }

  function loadShowcase() {
    fetch('/api/admin/showcase')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setShowcaseImages(data); });
  }

  useEffect(() => { loadStudies(); loadMessages(); loadShowcase(); }, []);

  async function handleShowcaseUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setShowcaseUploading(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: form });
        const { url } = await uploadRes.json();
        if (url) {
          await fetch('/api/admin/showcase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, alt: file.name.replace(/\.[^.]+$/, '') }),
          });
        }
      }
      loadShowcase();
    } finally {
      setShowcaseUploading(false);
      if (showcaseInputRef.current) showcaseInputRef.current.value = '';
    }
  }

  async function deleteShowcaseImage(id: string) {
    await fetch(`/api/admin/showcase/${id}`, { method: 'DELETE' });
    loadShowcase();
  }

  // Auto-generate slug from title
  useEffect(() => {
    setNewSlug(toSlug(newTitle));
  }, [newTitle]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  async function handleCreate() {
    if (!newTitle.trim() || !newLabel.trim() || !newSlug.trim()) return;
    setCreating(true);
    setCreateError('');
    try {
      const res = await fetch('/api/admin/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: newSlug, title: newTitle, label: newLabel }),
      });
      if (res.ok) {
        router.push(`/admin/case-studies/${newSlug}`);
      } else {
        const j = await res.json();
        setCreateError(j.error ?? 'Failed to create');
      }
    } catch {
      setCreateError('Network error');
    } finally {
      setCreating(false);
    }
  }

  async function patch(slug: string, data: Record<string, unknown>) {
    await fetch(`/api/admin/case-studies/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    loadStudies();
  }

  async function deleteMessage(id: string) {
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    loadMessages();
  }

  const selected = studies
    .filter((s) => s.selected_work && !s.archived)
    .sort((a, b) => (a.selected_work_order ?? 999) - (b.selected_work_order ?? 999));

  const active = studies.filter((s) => !s.archived);
  const archived = studies.filter((s) => s.archived);

  async function moveOrder(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= selected.length) return;
    const a = selected[index];
    const b = selected[next];
    await fetch(`/api/admin/case-studies/${a.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedWorkOrder: b.selected_work_order ?? next }),
    });
    await fetch(`/api/admin/case-studies/${b.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedWorkOrder: a.selected_work_order ?? index }),
    });
    loadStudies();
  }

  return (
    <Page>
      <TopBar>
        <Brand>Portfolio CMS</Brand>
        <LogoutBtn onClick={handleLogout}>Sign out</LogoutBtn>
      </TopBar>

      <Content>
        <TabNav>
          <Tab $active={activeTab === 'studies'} onClick={() => setActiveTab('studies')}>
            Case Studies
          </Tab>
          <Tab $active={activeTab === 'messages'} onClick={() => setActiveTab('messages')}>
            Messages {messages.length > 0 && `(${messages.length})`}
          </Tab>
          <Tab $active={activeTab === 'showcase'} onClick={() => setActiveTab('showcase')}>
            Work Showcase
          </Tab>
        </TabNav>

        {/* ── Messages Tab ── */}
        {activeTab === 'messages' && (
          <>
            <SectionHeader>
              <SectionTitle>Contact Messages</SectionTitle>
            </SectionHeader>
            {messages.length === 0 ? (
              <EmptyNote>No messages yet.</EmptyNote>
            ) : (
              <MsgList>
                {messages.map((msg) => (
                  <MsgCard key={msg.id}>
                    <MsgHeader>
                      <MsgMeta>
                        <MsgName>{msg.name}</MsgName>
                        <MsgEmail>{msg.email}</MsgEmail>
                        {msg.subject && <MsgSubject>Re: {msg.subject}</MsgSubject>}
                      </MsgMeta>
                      <MsgDate>
                        {new Date(msg.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </MsgDate>
                      <DeleteBtn onClick={() => deleteMessage(msg.id)}>Delete</DeleteBtn>
                    </MsgHeader>
                    <MsgBody>{msg.message}</MsgBody>
                  </MsgCard>
                ))}
              </MsgList>
            )}
          </>
        )}

        {/* ── Showcase Tab ── */}
        {activeTab === 'showcase' && (
          <>
            <SectionHeader>
              <SectionTitle>Work Showcase Images</SectionTitle>
            </SectionHeader>

            {showcaseImages.length > 0 && (
              <ShowcaseGrid>
                {showcaseImages.map((img) => (
                  <ShowcaseCard key={img.id}>
                    <ShowcaseThumb>
                      <Image src={img.url} alt={img.alt} fill style={{ objectFit: 'cover' }} />
                    </ShowcaseThumb>
                    <ShowcaseCardFooter>
                      <ShowcaseAlt>{img.alt || 'Untitled'}</ShowcaseAlt>
                      <DeleteBtn onClick={() => deleteShowcaseImage(img.id)}>Delete</DeleteBtn>
                    </ShowcaseCardFooter>
                  </ShowcaseCard>
                ))}
              </ShowcaseGrid>
            )}

            <UploadZone $uploading={showcaseUploading}>
              <input
                ref={showcaseInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleShowcaseUpload(e.target.files)}
                disabled={showcaseUploading}
              />
              <UploadText>
                {showcaseUploading ? 'Uploading...' : 'Click to upload images (select multiple at once)'}
              </UploadText>
            </UploadZone>
          </>
        )}

        {/* ── Case Studies Tab ── */}
        {activeTab === 'studies' && (
          <>
        {/* ── Selected Work ── */}
        <SectionHeader>
          <SectionTitle>Selected Work</SectionTitle>
          <NewBtn onClick={() => { setShowModal(true); setCreateError(''); }}>
            + New Case Study
          </NewBtn>
        </SectionHeader>

        {selected.length === 0 ? (
          <EmptyNote>No case studies marked as selected work yet.</EmptyNote>
        ) : (
          <OrderList>
            {selected.map((s, i) => (
              <OrderRow key={s.slug}>
                <OrderNum>{i + 1}</OrderNum>
                <OrderInfo>
                  <OrderTitle>{s.title}</OrderTitle>
                  <OrderScope>{s.scope}</OrderScope>
                </OrderInfo>
                <OrderActions>
                  <IconBtn onClick={() => moveOrder(i, -1)} disabled={i === 0} title="Move up">↑</IconBtn>
                  <IconBtn onClick={() => moveOrder(i, 1)} disabled={i === selected.length - 1} title="Move down">↓</IconBtn>
                  <IconBtn $danger onClick={() => patch(s.slug, { selectedWork: false, selectedWorkOrder: null })}>
                    Remove
                  </IconBtn>
                  <EditLink href={`/admin/case-studies/${s.slug}`}>Edit →</EditLink>
                </OrderActions>
              </OrderRow>
            ))}
          </OrderList>
        )}

        <Divider />

        {/* ── All Studies ── */}
        <SectionHeader>
          <SectionTitle>All Case Studies</SectionTitle>
        </SectionHeader>
        <Grid>
          {active.map((s) => (
            <StudyCard key={s.slug} href={`/admin/case-studies/${s.slug}`}>
              {s.selected_work && <CardBadge>Selected Work #{(s.selected_work_order ?? 0) + 1}</CardBadge>}
              <CardScope>{s.scope}</CardScope>
              <CardTitle>{s.title}</CardTitle>
              <CardMeta>{s.label} · {s.year}</CardMeta>
              <EditArrow>Edit content →</EditArrow>
            </StudyCard>
          ))}
        </Grid>

        {archived.length > 0 && (
          <>
            <Divider />
            <SectionHeader>
              <SectionTitle>Archived</SectionTitle>
            </SectionHeader>
            <Grid>
              {archived.map((s) => (
                <StudyCard key={s.slug} href={`/admin/case-studies/${s.slug}`} $archived>
                  <ArchivedBadge>Archived</ArchivedBadge>
                  <CardScope>{s.scope}</CardScope>
                  <CardTitle>{s.title}</CardTitle>
                  <CardMeta>{s.label} · {s.year}</CardMeta>
                  <EditArrow>Restore / Edit →</EditArrow>
                </StudyCard>
              ))}
            </Grid>
          </>
        )}
          </>
        )}
      </Content>

      {/* ── Create Modal ── */}
      {showModal && (
        <Overlay onClick={() => setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>New Case Study</ModalTitle>
            <ModalSub>Fill in the basics — you can edit everything else after creation.</ModalSub>

            <Field>
              <FieldLabel>Title</FieldLabel>
              <TextInput
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Redesigning the Veevoy Platform"
                autoFocus
              />
            </Field>

            <Field>
              <FieldLabel>Short Label</FieldLabel>
              <TextInput
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Veevoy"
              />
            </Field>

            <Field>
              <FieldLabel>Slug (URL)</FieldLabel>
              <TextInput
                value={newSlug}
                onChange={(e) => setNewSlug(toSlug(e.target.value))}
                placeholder="e.g. veevoy-web"
              />
            </Field>

            {createError && <ErrorMsg>{createError}</ErrorMsg>}

            <ModalActions>
              <CancelBtn onClick={() => setShowModal(false)}>Cancel</CancelBtn>
              <CreateBtn
                onClick={handleCreate}
                disabled={creating || !newTitle.trim() || !newLabel.trim() || !newSlug.trim()}
              >
                {creating ? 'Creating...' : 'Create & Edit'}
              </CreateBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
