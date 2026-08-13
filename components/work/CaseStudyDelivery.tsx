'use client';

import styled from 'styled-components';
import type { CaseStudy } from '@/lib/caseStudies';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 6rem 7.5rem 7rem;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 4rem 1.25rem 5rem;
  }
`;

const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 5rem;
  transition: border-color 0.4s ease;

  @media (max-width: 768px) {
    margin-bottom: 3rem;
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

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  p {
    font-family: var(--font-body);
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    line-height: 1.75;
    color: ${({ theme }) => theme.colors.textSecondary};
    transition: color 0.4s ease;

    & + p {
      margin-top: 0.5rem;
    }
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CaseStudyDelivery({ study }: { study: CaseStudy }) {
  return (
    <Section id="cs-delivery">
      <Divider />
      <TwoCol>
        <SectionHeading>Delivery</SectionHeading>
        <TextBlock dangerouslySetInnerHTML={{ __html: study.deliveryBody }} />
      </TwoCol>
    </Section>
  );
}
