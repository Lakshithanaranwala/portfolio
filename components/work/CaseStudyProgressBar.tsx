'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useThemeToggle } from '@/components/providers/ThemeProvider';

/* ─── Sections ───────────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'cs-overview', label: 'Overview' },
  { id: 'cs-challenge', label: 'Challenge' },
  { id: 'cs-problem-statement', label: 'Problem Statement' },
  { id: 'cs-goal', label: 'Goal' },
  { id: 'cs-approach', label: 'Approach' },
  { id: 'cs-images-1', label: 'Process' },
  { id: 'cs-pain-points', label: 'Pain Points' },
  { id: 'cs-insights', label: 'Insights' },
  { id: 'cs-design', label: 'Design' },
  { id: 'cs-images-2', label: 'Visual Design' },
  { id: 'cs-outcomes', label: 'Outcomes' },
  { id: 'cs-delivery', label: 'Delivery' },
];

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Wrapper = styled.div`
  position: fixed;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Row = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 2px 0;
  cursor: pointer;

  &:focus-visible {
    outline: none;
  }
`;

const Line = styled.div<{ $active: boolean; $color: string }>`
  height: 2px;
  border-radius: 1px;
  flex-shrink: 0;
  background: ${({ $active, $color, theme }) =>
    $active ? $color : theme.colors.textMuted};
  width: ${({ $active }) => ($active ? '32px' : '20px')};
  opacity: ${({ $active }) => ($active ? 1 : 0.35)};
  transition:
    width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.35s ease,
    opacity 0.35s ease;
`;

const LabelPill = styled.span<{ $visible: boolean }>`
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.28rem 0.65rem;
  border-radius: 100px;
  white-space: nowrap;
  pointer-events: none;
  backdrop-filter: blur(8px);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateX(${({ $visible }) => ($visible ? '0px' : '-8px')});
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CaseStudyProgressBar() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { isDark } = useThemeToggle();
  const accentColor = isDark ? '#FF6B35' : '#C94C0A';

  useEffect(() => {
    const handleScroll = () => {
      const middle = window.innerHeight / 2;
      let current = SECTIONS[0].id;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= middle) {
          current = section.id;
        }
      }

      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Wrapper>
      {SECTIONS.map((section) => (
        <Row
          key={section.id}
          onClick={() => scrollTo(section.id)}
          onMouseEnter={() => setHoveredId(section.id)}
          onMouseLeave={() => setHoveredId(null)}
          aria-label={`Go to ${section.label}`}
        >
          <Line $active={activeId === section.id} $color={accentColor} />
          <LabelPill $visible={hoveredId === section.id}>
            {section.label}
          </LabelPill>
        </Row>
      ))}
    </Wrapper>
  );
}
