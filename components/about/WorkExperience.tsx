'use client';

import styled from 'styled-components';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Job = {
  period: string;
  title: string;
  company: string;
  bullets: string[];
};

/* ─── Data ───────────────────────────────────────────────────────────────── */

const JOBS: Job[] = [
  {
    period: 'OCT 2024 – PRESENT',
    title: 'Senior UX/UI Engineer',
    company: 'Random Software Ltd',
    bullets: [
      'Own end-to-end UX for web-based enterprise applications, from discovery through final UI delivery.',
      'Run discovery research, stakeholder and user interviews, surveys, and moderated usability testing to surface user needs, pain points, and design opportunities.',
      'Plan and facilitate UX workshops to capture business requirements and align product, engineering, and leadership on goals.',
      'Produce personas, empathy maps, customer journey maps, task flows, and information architecture as the basis for design decisions.',
      'Design wireframes, interactive prototypes, and high-fidelity interfaces in Figma across desktop, tablet, and mobile breakpoints.',
      'Build and maintain scalable design systems with reusable components, usage guidelines, and documented design tokens.',
      'Apply WCAG standards including contrast, hierarchy, keyboard navigation, and semantics so products ship accessible by default.',
      'Partner with Product Managers, Business Analysts, QA, and developers through Agile sprints; review builds and provide design QA to maintain consistency.',
      'Present concepts and research findings to stakeholders and incorporate feedback into iterative product improvements.',
    ],
  },
  {
    period: 'FEB 2021 – OCT 2024',
    title: 'UI/UX Engineer',
    company: 'Random Software Ltd',
    bullets: [
      'Designed responsive interfaces for enterprise web applications and internal operational systems.',
      'Created high-fidelity mockups and interactive prototypes in Figma for stakeholder review and developer handoff.',
      'Built reusable UI component libraries and contributed to the organisation\'s design system.',
      'Worked alongside frontend developers to ensure implementation matched design specifications pixel-for-pixel.',
      'Authored design documentation, style guides, spacing systems, typography systems, and component guidelines.',
      'Improved accessibility through colour contrast, type hierarchy, and keyboard navigation following WCAG best practices.',
      'Participated in design critiques and iterated designs based on stakeholder and user feedback.',
    ],
  },
  {
    period: 'SEP 2020 – FEB 2021',
    title: 'UI Engineer',
    company: 'Random Software Ltd',
    bullets: [
      'Supported senior designers throughout the product design lifecycle.',
      'Created wireframes, mockups, and interactive prototypes for web applications.',
      'Collaborated with developers to validate implementation and resolve UI defects.',
      'Helped maintain design consistency across multiple concurrent projects.',
    ],
  },
];

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 5rem 7.5rem 6rem;
  transition: background 0.4s ease;

  @media (max-width: 900px) {
    padding: 4rem 1.25rem 4rem;
  }
`;

const SectionLabel = styled.p`
  font-family: var(--font-body);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1rem;
  transition: color 0.4s ease;
`;

const SectionHeading = styled.h2`
  font-family: var(--font-body);
  font-size: clamp(1.75rem, 3.5vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4rem;
  transition: color 0.4s ease;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimelineRow = styled.div`
  display: grid;
  grid-template-columns: 140px 32px 1fr;
  gap: 0 0;
  position: relative;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const DateCol = styled.div`
  padding-top: 0.2rem;
  padding-right: 1.5rem;

  @media (max-width: 700px) {
    padding-right: 0;
    margin-bottom: 0.5rem;
  }
`;

const DateText = styled.p`
  font-family: var(--font-body);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  transition: color 0.4s ease;
`;

const LineCol = styled.div<{ $last: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 700px) {
    display: none;
  }
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  flex-shrink: 0;
  margin-top: 0.25rem;
  transition: border-color 0.4s ease;
`;

const Line = styled.div<{ $last: boolean }>`
  flex: 1;
  width: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin-top: 6px;
  margin-bottom: ${({ $last }) => ($last ? '0' : '0')};
  min-height: ${({ $last }) => ($last ? '0' : '2rem')};
  transition: background 0.4s ease;
`;

const ContentCol = styled.div`
  padding-left: 2rem;
  padding-bottom: 4rem;

  @media (max-width: 700px) {
    padding-left: 0;
    padding-bottom: 3rem;
  }
`;

const JobTitle = styled.h3`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.15rem;
  transition: color 0.4s ease;
`;

const JobCompany = styled.span`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BulletList = styled.ul`
  list-style: disc;
  padding-left: 1.25rem;
  margin: 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Bullet = styled.li`
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.4s ease;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function WorkExperience() {
  return (
    <Section>
      <SectionLabel>Experience</SectionLabel>
      <SectionHeading>Where I&apos;ve worked</SectionHeading>

      <Timeline>
        {JOBS.map((job, i) => {
          const isLast = i === JOBS.length - 1;
          return (
            <TimelineRow key={i}>
              <DateCol>
                <DateText>{job.period}</DateText>
              </DateCol>

              <LineCol $last={isLast}>
                <Dot />
                {!isLast && <Line $last={false} />}
              </LineCol>

              <ContentCol>
                <JobTitle>
                  {job.title}{' '}
                  <JobCompany>– {job.company}</JobCompany>
                </JobTitle>
                <BulletList>
                  {job.bullets.map((b, j) => (
                    <Bullet key={j}>{b}</Bullet>
                  ))}
                </BulletList>
              </ContentCol>
            </TimelineRow>
          );
        })}
      </Timeline>
    </Section>
  );
}
