'use client';

import React from 'react';
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

const ColHeading = styled.h3`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.4s ease;
`;

const RowDivider = styled.div`
  grid-column: 1 / -1;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  opacity: 0.4;
`;

const ColText = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textBody};
  transition: color 0.4s ease;
  margin: 0;
`;

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function ColLines({ text }: { text: string }) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {lines.map((line, i) => <ColText key={i}>{line}</ColText>)}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CaseStudyThreeColumn({ study }: { study: CaseStudy }) {
  const rows = study.outcomeRows ?? [];

  return (
    <Section id="cs-outcomes">
      <Grid>
        <ColHeading>Problem</ColHeading>
        <ColHeading>Solution</ColHeading>
        <ColHeading>UX Impact</ColHeading>

        {rows.map((row, i) => (
          <React.Fragment key={i}>
            <RowDivider />
            <ColLines text={row.problem} />
            <ColLines text={row.solution} />
            <ColLines text={row.uxImpact} />
          </React.Fragment>
        ))}
      </Grid>
    </Section>
  );
}
