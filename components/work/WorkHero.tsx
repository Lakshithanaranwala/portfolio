'use client';

import { useRef } from 'react';
import styled from 'styled-components';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ParticleCanvas from '@/components/home/ParticleCanvas';

gsap.registerPlugin(useGSAP);

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  position: relative;
  min-height: 82svh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10rem 7.5rem 6rem;
  overflow: hidden;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 8rem 1.25rem 4rem;
    min-height: 70svh;
  }
`;

const HeadingWrap = styled.div`
  overflow: hidden;
  margin-bottom: 3rem;
`;

const Heading = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 9rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  will-change: transform;
  transition: color 0.4s ease;
`;

const SubWrap = styled.div`
  overflow: hidden;
`;

const Subtitle = styled.p`
  font-family: var(--font-body);
  font-size: clamp(0.9375rem, 1.25vw, 1.125rem);
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 38rem;
  margin: 0;
  will-change: transform;
  transition: color 0.4s ease;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function WorkHero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      headingRef.current,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1.1 },
    ).fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.5',
    );
  }, []);

  return (
    <Section>
      <ParticleCanvas words={['↓']} />
      <HeadingWrap>
        <Heading ref={headingRef}>
          A closer look at the work I&rsquo;ve helped shape
        </Heading>
      </HeadingWrap>
      <SubWrap>
        <Subtitle ref={subtitleRef}>
          Strategic thinker crafting clean, effective designs that seamlessly
          blend user delight with business success.
        </Subtitle>
      </SubWrap>
    </Section>
  );
}
