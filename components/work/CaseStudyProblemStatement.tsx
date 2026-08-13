'use client';

import styled from 'styled-components';
import type { CaseStudy } from '@/lib/caseStudies';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 6rem 7.5rem 0;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 4rem 1.25rem 0;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const SectionHeading = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.1;
  transition: color 0.4s ease;
`;

const Statement = styled.p`
  font-family: var(--font-body);
  font-size: clamp(1.25rem, 2.5vw, 2rem);
  font-weight: 600;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.01em;
  transition: color 0.4s ease;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CaseStudyProblemStatement({ study }: { study: CaseStudy }) {
  return (
    <Section id="cs-problem-statement">
      <TwoCol>
        <SectionHeading>Problem{'\n'}Statement</SectionHeading>
        <Statement>{study.problemStatement}</Statement>
      </TwoCol>
    </Section>
  );
}
