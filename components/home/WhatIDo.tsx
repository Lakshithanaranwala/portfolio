'use client';

import Link from 'next/link';
import styled from 'styled-components';

/* ─── Data ───────────────────────────────────────────────────────────────── */

const services = [
  {
    number: '01',
    title: 'Product design',
    description:
      'End to end UX and UI for digital products from early concepts and user flows to polished interfaces ready to ship. I focus on clarity, structure and details that make products easier to use.',
  },
  {
    number: '02',
    title: 'Design systems',
    description:
      'Scalable design systems with clear foundations, reusable components and practical documentation. Built to support both designers and developers, so the system stays useful beyond handoff.',
  },
  {
    number: '03',
    title: 'Prototyping & Usability Testing',
    description:
      'Build interactive prototypes to validate concepts before development. Run usability tests, analyze user behavior, and iterate designs based on real feedback and product requirements.',
  },
  {
    number: '04',
    title: 'Design to Code & Frontend Collaboration',
    description:
      'Translate Figma designs into production ready interfaces using technologies such as HTML, CSS, React, and Next.js. Work closely with developers to ensure accurate implementation, responsive behavior, accessibility, and design consistency.',
  },
  {
    number: '05',
    title: 'Brand identity',
    description:
      'Visual identities and brand systems for digital products and modern businesses. Usually developed alongside the product, so brand and interface feel like one coherent experience.',
  },
  {
    number: '06',
    title: 'Product Optimization',
    description:
      'Analyze analytics, user feedback, support issues, and product performance to identify opportunities for improvement. Collaborate with Product, Engineering, and Business teams to prioritize UX enhancements that improve usability, engagement, and business outcomes.',
  },
];

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 6rem 7.5rem 0;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 4rem 1.25rem 0;
  }
`;

const Heading = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 7rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 4rem;
  line-height: 1.05;
  transition: color 0.4s ease;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.4s ease;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Cell = styled.div`
  padding: 2rem 2rem 3rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.4s ease;

  /* Vertical dividers — all cells except first in each row */
  &:nth-child(3n+2),
  &:nth-child(3n+3) {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 900px) {
    &:nth-child(3n+2),
    &:nth-child(3n+3) {
      border-left: none;
    }
    &:nth-child(even) {
      border-left: 1px solid ${({ theme }) => theme.colors.border};
    }
  }

  @media (max-width: 560px) {
    &:nth-child(even) {
      border-left: none;
    }
  }
`;

const Number = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.04em;
  display: block;
  margin-bottom: 1.75rem;
  transition: color 0.4s ease;
`;

const ServiceTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 2.5vw, 2.25rem);
  font-weight: 300;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.25rem;
  line-height: 1.1;
  transition: color 0.4s ease;
`;

const Description = styled.p`
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.4s ease;
`;

const Cta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.5rem 0;
  gap: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const CtaText = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 3rem);
  font-weight: 300;
  font-style: italic;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
  transition: color 0.4s ease;
`;

const CtaAccent = styled.span`
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CtaButton = styled(Link)`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.buttonFillText};
  background: ${({ theme }) => theme.colors.buttonFillBg};
  border-radius: 100px;
  padding: 0.75rem 2rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function WhatIDo() {
  return (
    <Section>
      <Heading>What I do</Heading>

      <Grid>
        {services.map((s) => (
          <Cell key={s.number}>
            <Number>{s.number}</Number>
            <ServiceTitle>{s.title}</ServiceTitle>
            <Description>{s.description}</Description>
          </Cell>
        ))}
      </Grid>

      <Cta>
        <CtaText>
          Have a project in mind? <CtaAccent>Let&apos;s talk.</CtaAccent>
        </CtaText>
        <CtaButton href="/contact">
          Get in touch
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M3 13L13 3M13 3H5M13 3V11"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </CtaButton>
      </Cta>
    </Section>
  );
}
