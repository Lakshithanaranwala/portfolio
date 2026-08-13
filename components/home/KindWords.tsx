'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';

/* ─── Data ───────────────────────────────────────────────────────────────── */

const DURATION = 10000;

const testimonials = [
  {
    quote:
      '"Working with Lakshitha was a seamless experience from start to finish. He brought a clear design vision, asked the right questions, and delivered a product that exceeded our expectations. The attention to detail and genuine care for the user experience truly showed in every decision."',
    name: 'Alex Thompson',
    role: 'Product Director',
    company: 'Launchpad Studio',
  },
  {
    quote:
      '"Lakshitha redesigned our entire app interface and the results were remarkable. User engagement improved significantly, and our team finally had a coherent design system to build from. He communicates clearly, moves fast, and consistently delivers quality work."',
    name: 'Sarah Mitchell',
    role: 'Head of Product',
    company: 'Finflow',
  },
  {
    quote:
      '"I hired Lakshitha to build the brand identity and website for my consultancy. He understood the brief immediately and came back with ideas that felt fresh but grounded. The final result was polished, professional, and exactly on point."',
    name: 'James Okafor',
    role: 'Founder',
    company: 'Meridian Advisory',
  },
];

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 6rem 7.5rem;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 4rem 1.25rem;
  }
`;

const Heading = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 3rem;
  line-height: 1.05;
  transition: color 0.4s ease;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  transition: background 0.4s ease;
`;

const SliderArea = styled.div`
  overflow: hidden;
  padding: 0;
`;

const SlideContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4rem;
  padding: 4rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    padding: 3rem 0;
  }
`;

const Quote = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 1.8vw, 1.4rem);
  font-weight: 300;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text};
  max-width: 65%;
  transition: color 0.4s ease;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Author = styled.div`
  text-align: right;
  flex-shrink: 0;
  padding-top: 0.2rem;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

const AuthorName = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.3rem;
  transition: color 0.4s ease;
`;

const AuthorMeta = styled.p`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  transition: color 0.4s ease;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  position: relative;
  transition: background 0.4s ease;
`;

const ProgressFill = styled.div`
  position: absolute;
  inset: 0 auto 0 0;
  width: 0%;
  background: ${({ theme }) => theme.colors.textMuted};
  transition: background 0.4s ease;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function KindWords() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const isPausedRef = useRef(false);
  const progressRef = useRef(0);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);

      const delta = lastTimeRef.current ? time - lastTimeRef.current : 0;
      lastTimeRef.current = time;

      if (!isPausedRef.current) {
        progressRef.current = Math.min(progressRef.current + delta / DURATION, 1);

        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${progressRef.current * 100}%`;
        }

        if (progressRef.current >= 1) {
          progressRef.current = 0;
          setCurrentIdx((prev) => (prev + 1) % testimonials.length);
        }
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <Section>
      <Heading>Kind words</Heading>

      <Divider />

      <SliderArea
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          >
            <SlideContent>
              <Quote>{testimonials[currentIdx].quote}</Quote>
              <Author>
                <AuthorName>{testimonials[currentIdx].name}</AuthorName>
                <AuthorMeta>
                  {testimonials[currentIdx].role}
                  <br />
                  {testimonials[currentIdx].company}
                </AuthorMeta>
              </Author>
            </SlideContent>
          </motion.div>
        </AnimatePresence>
      </SliderArea>

      <ProgressTrack>
        <ProgressFill ref={progressFillRef} />
      </ProgressTrack>
    </Section>
  );
}
