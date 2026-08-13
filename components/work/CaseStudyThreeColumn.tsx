'use client';

import styled from 'styled-components';
import type { CaseStudy } from '@/lib/caseStudies';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 5rem 7.5rem 6rem;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 4rem 1.25rem 5rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const Col = styled.div``;

const ColHeading = styled.h3`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.75rem;
  transition: color 0.4s ease;
`;

const ColText = styled.p`
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.4s ease;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CaseStudyThreeColumn({ study }: { study: CaseStudy }) {
  return (
    <Section id="cs-outcomes">
      <Grid>
        <Col>
          <ColHeading>Problem</ColHeading>
          <ColText>{study.problemColumn}</ColText>
        </Col>
        <Col>
          <ColHeading>Solution</ColHeading>
          <ColText>{study.solutionColumn}</ColText>
        </Col>
        <Col>
          <ColHeading>UX Impact</ColHeading>
          <ColText>{study.uxImpactColumn}</ColText>
        </Col>
      </Grid>
    </Section>
  );
}
