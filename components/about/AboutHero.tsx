'use client';

import styled from 'styled-components';
import HeroParticleLine from './HeroParticleLine';

const Section = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.bg};
  padding: 10rem 7.5rem 6rem;
  transition: background 0.4s ease;

  @media (max-width: 900px) {
    padding: 8rem 1.25rem 4rem;
  }
`;

const Heading = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5.5vw, 6rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.08;
  color: ${({ theme }) => theme.colors.text};
  max-width: 14em;
  margin: 0 0 3rem;
  transition: color 0.4s ease;
`;

const Bio = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 100%;
  margin: 0;
  transition: color 0.4s ease;
`;

export default function AboutHero() {
  return (
    <Section>
      <Heading>
        I design digital products with a focus on clarity, character, and real-world usability.
      </Heading>
      <Bio>
        I am a passionate UI/UX Engineer with over 6 years of experience designing and building
        intuitive, user-centered digital experiences. I specialize in transforming complex ideas
        into clean, functional, and visually engaging interfaces that balance user needs with
        business goals. My work combines design thinking and usability principles to create
        seamless experiences across web and mobile platforms. I focus on delivering products that
        are not only aesthetically refined but also accessible, scalable, and performance-driven.
        Throughout my career, I have collaborated closely with product managers, developers, and
        stakeholders to research, prototype, and ship impactful solutions. I enjoy solving
        real-world problems through thoughtful interaction design, data-driven decisions, and
        continuous iteration.
      </Bio>
      <HeroParticleLine />
    </Section>
  );
}
