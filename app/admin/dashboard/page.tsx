'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

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

  &:hover {
    border-color: #e74c3c;
    color: #e74c3c;
  }
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const PageTitle = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const PageSub = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: #555;
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`;

const StudyCard = styled(Link)`
  display: block;
  padding: 1.5rem;
  background: #111;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  text-decoration: none;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: #FF6B35;
    background: #141414;
  }
`;

const CardScope = styled.p`
  font-family: var(--font-body);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FF6B35;
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

  ${StudyCard}:hover & {
    color: #FF6B35;
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

type StudySummary = {
  slug: string;
  label: string;
  title: string;
  scope: string;
  year: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [studies, setStudies] = useState<StudySummary[]>([]);

  useEffect(() => {
    fetch('/api/admin/case-studies')
      .then((r) => r.json())
      .then(setStudies);
  }, []);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  return (
    <Page>
      <TopBar>
        <Brand>Portfolio CMS</Brand>
        <LogoutBtn onClick={handleLogout}>Sign out</LogoutBtn>
      </TopBar>
      <Content>
        <PageTitle>Case Studies</PageTitle>
        <PageSub>Select a case study to edit its content.</PageSub>
        <Grid>
          {studies.map((s) => (
            <StudyCard key={s.slug} href={`/admin/case-studies/${s.slug}`}>
              <CardScope>{s.scope}</CardScope>
              <CardTitle>{s.title}</CardTitle>
              <CardMeta>{s.label} · {s.year}</CardMeta>
              <EditArrow>Edit content →</EditArrow>
            </StudyCard>
          ))}
        </Grid>
      </Content>
    </Page>
  );
}
