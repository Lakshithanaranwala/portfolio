'use client';

import styled from 'styled-components';

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 9rem 7.5rem 5rem;
  transition: background 0.4s ease;

  @media (max-width: 900px) {
    padding: 7rem 1.25rem 3rem;
  }
`;

const Heading = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(3rem, 6.5vw, 8rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: ${({ theme }) => theme.colors.text};
  max-width: 14em;
  margin: 0;
  transition: color 0.4s ease;
`;

export default function PersonalHero() {
  return (
    <Section>
      <Heading>
        Personal projects, experiments, and self-initiated work.
      </Heading>
    </Section>
  );
}
