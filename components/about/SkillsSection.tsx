'use client';

import styled from 'styled-components';

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SKILL_COLUMNS = [
  {
    category: 'UX',
    skills: [
      'User Research',
      'Personas',
      'Journey Mapping',
      'Information Architecture',
      'User Flows',
      'Wireframing',
      'Usability Testing',
      'Competitive Analysis',
    ],
  },
  {
    category: 'UI',
    skills: [
      'Design Systems',
      'Component Libraries',
      'Responsive Design',
      'Visual Design',
      'Typography',
      'Interaction Design',
      'Prototyping',
      'Accessibility (WCAG)',
    ],
  },
  {
    category: 'Product',
    skills: [
      'Product Thinking',
      'Design Strategy',
      'Agile Methodologies',
      'Cross-functional Collaboration',
      'Stakeholder Management',
      'Design Workshops',
      'Product Discovery',
      'Requirement Gathering',
    ],
  },
  {
    category: 'Technical',
    skills: [
      'Figma',
      'FigJam',
      'Framer',
      'Webflow',
      'HTML5 | CSS',
      'JavaScript',
      'React',
      'Adobe CC',
    ],
  },
];

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 5rem 7.5rem 8rem;
  transition: background 0.4s ease;

  @media (max-width: 900px) {
    padding: 4rem 1.25rem 6rem;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CategoryLabel = styled.p`
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
  transition: color 0.4s ease;
`;

const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 100px;
  padding: 0.3rem 0.85rem;
  white-space: nowrap;
  transition: color 0.4s ease, border-color 0.4s ease;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function SkillsSection() {
  return (
    <Section>
      <SectionLabel>Skills</SectionLabel>
      <SectionHeading>What I bring to the table</SectionHeading>

      <Grid>
        {SKILL_COLUMNS.map((col) => (
          <Column key={col.category}>
            <CategoryLabel>{col.category}</CategoryLabel>
            <TagsWrap>
              {col.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </TagsWrap>
          </Column>
        ))}
      </Grid>
    </Section>
  );
}
