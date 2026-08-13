'use client';

import React, { useRef } from 'react';
import styled from 'styled-components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ParticleCanvas from './ParticleCanvas';
import HeroCursor from './HeroCursor';

gsap.registerPlugin(useGSAP);

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  position: relative;
  min-height: 100svh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
  padding: 0 7.5rem 8rem;
  overflow: hidden;
  transition: background 0.4s ease;
  cursor: none;

  @media (max-width: 768px) {
    padding: 0 1.25rem 5rem;
    cursor: auto;
  }
`;

const HeadingArea = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 2rem;
`;

const LineWrapper = styled.div`
  overflow: hidden;
  line-height: 1;
`;

const HeadingLine = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6.5vw, 7.5rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.05;
  will-change: transform;
  transition: color 0.4s ease;
`;

const GradientLine = styled(HeadingLine)`
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MetaStack = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 3rem;

  @media (max-width: 768px) {
    padding-bottom: 2.5rem;
  }
`;

const MetaRow = styled.div`
  display: flex;
  gap: 4rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MetaLabel = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.04em;
  transition: color 0.4s ease;
`;

const MetaValue = styled.span`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.4s ease;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

const headingLines = [
  "I'm Lakshitha,",
  'AI Native Product Designer.',
  'I Design Products for',
];

const metaRow1 = [
  { label: 'Based', value: 'Colombo, Sri Lanka' },
  { label: 'Focus', value: 'Human Centered | AI-Native | Simplify Complexity' },
];

const metaRow2 = [
  { label: 'Languages', value: 'English' },
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>('.hero-line');
      const meta = gsap.utils.toArray<HTMLElement>('.hero-meta');

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        lines,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, stagger: 0.12 }
      ).fromTo(
        meta,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
        '-=0.4'
      );
    },
    { scope: containerRef }
  );

  return (
    <Section ref={containerRef} data-hero-section>
      <HeroCursor />
      <ParticleCanvas />
      <HeadingArea>
        {headingLines.map((line) => (
          <LineWrapper key={line}>
            <HeadingLine className="hero-line">{line}</HeadingLine>
          </LineWrapper>
        ))}
        <LineWrapper>
          <GradientLine className="hero-line">Humans</GradientLine>
        </LineWrapper>
      </HeadingArea>

      <MetaStack>
        <MetaRow>
          {metaRow1.map((item) => (
            <MetaItem key={item.label} className="hero-meta">
              <MetaLabel>{item.label}</MetaLabel>
              <MetaValue>{item.value}</MetaValue>
            </MetaItem>
          ))}
        </MetaRow>
        <MetaRow>
          {metaRow2.map((item) => (
            <MetaItem key={item.label} className="hero-meta">
              <MetaLabel>{item.label}</MetaLabel>
              <MetaValue>{item.value}</MetaValue>
            </MetaItem>
          ))}
        </MetaRow>
      </MetaStack>
    </Section>
  );
}
