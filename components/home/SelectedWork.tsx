'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useArrowCursor, ArrowCursorEl, ArrowIcon } from '@/components/ui/ArrowCursor';

/* ─── Data ───────────────────────────────────────────────────────────────── */

const projects = [
  {
    slug: 'veevoy-web',
    title: 'Veevoy Web',
    category: 'Website · Branding',
    slideshow: true,
    slides: [
      { from: '#0f0e17', to: '#1a1a2e' },
      { from: '#1a1a2e', to: '#16213e' },
      { from: '#16213e', to: '#0f3460' },
    ],
  },
  {
    slug: 'eqvista-app',
    title: 'Eqvista App',
    category: 'Mobile App · UX Design',
    slideshow: false,
    slides: [{ from: '#0d1b2a', to: '#1b263b' }],
  },
  {
    slug: 'ascend-design-system',
    title: 'Ascend Design System',
    category: 'Component Library · Strategy',
    slideshow: false,
    slides: [{ from: '#1a3a2e', to: '#2d6a4f' }],
  },
  {
    slug: 'solaris-brand',
    title: 'Solaris Brand Identity',
    category: 'Visual Identity · Strategy',
    slideshow: false,
    slides: [{ from: '#3a1a1a', to: '#6b2d2d' }],
  },
] as const;

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 2rem 7.5rem 7rem;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 2rem 1.25rem 5rem;
  }
`;

const Heading = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 5.5rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2.5rem;
  line-height: 1.05;
  transition: color 0.4s ease;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  & > *:nth-child(even) {
    margin-top: 200px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;

    & > *:nth-child(even) {
      margin-top: 0;
    }
  }
`;

const CardRoot = styled(Link)`
  display: block;
  text-decoration: none;
  cursor: none;

  @media (max-width: 768px) {
    cursor: pointer;
  }
`;

const ImageArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
`;

const SlideFrame = styled.div<{ $active: boolean; $from: string; $to: string }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.9s ease;
`;

const CardMeta = styled.div`
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const CardTitle = styled.span`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.4s ease;
`;

const CardCategory = styled.span`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.4s ease;
`;

const ViewAllWrapper = styled.div`
  margin-top: 4rem;
  display: flex;
  justify-content: center;
`;

const ViewAllLink = styled(Link)`
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.buttonOutlineBorder};
  border-radius: 100px;
  padding: 0.65rem 2rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

/* ─── WorkCard sub-component ─────────────────────────────────────────────── */

type Project = (typeof projects)[number];

function WorkCard({ project }: { project: Project }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!project.slideshow) return;
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % project.slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [project.slideshow, project.slides.length]);

  return (
    <CardRoot href={`/work/${project.slug}`}>
      <ImageArea>
        {project.slides.map((s, i) => (
          <SlideFrame
            key={i}
            $active={project.slideshow ? i === slide : true}
            $from={s.from}
            $to={s.to}
          />
        ))}
      </ImageArea>
      <CardMeta>
        <CardTitle>{project.title}</CardTitle>
        <CardCategory>{project.category}</CardCategory>
      </CardMeta>
    </CardRoot>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function SelectedWork() {
  const { containerRef, cursorRef, cursorVisible } = useArrowCursor();

  return (
    <Section>
      <Heading>Selected Work</Heading>

      <Grid ref={containerRef}>
        {projects.map((p) => (
          <WorkCard key={p.slug} project={p} />
        ))}
      </Grid>

      <ViewAllWrapper>
        <ViewAllLink href="/work">
          View All Work
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ViewAllLink>
      </ViewAllWrapper>

      <ArrowCursorEl ref={cursorRef} $visible={cursorVisible}>
        <ArrowIcon />
      </ArrowCursorEl>
    </Section>
  );
}
