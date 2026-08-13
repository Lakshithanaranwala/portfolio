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

const Groups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Group = styled.div``;

const GroupHeading = styled.h3`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.75rem;
  transition: color 0.4s ease;
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Bullet = styled.li`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  transition: color 0.4s ease;

  &::before {
    content: '·';
    color: ${({ theme }) => theme.colors.textMuted};
    flex-shrink: 0;
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CaseStudyPainPoints({ study }: { study: CaseStudy }) {
  return (
    <Section id="cs-pain-points">
      <Divider />
      <TwoCol>
        <SectionHeading>Pain Points</SectionHeading>
        <Groups>
          {study.painPoints.map((group, i) => (
            <Group key={i}>
              <GroupHeading>{group.subheading}</GroupHeading>
              <BulletList>
                {group.bullets.map((bullet, j) => (
                  <Bullet key={j}>{bullet}</Bullet>
                ))}
              </BulletList>
            </Group>
          ))}
        </Groups>
      </TwoCol>
    </Section>
  );
}
