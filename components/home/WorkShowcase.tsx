'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

/* ─── Constants ─────────────────────────────────────────────────────────── */

const SLIDE_DURATION = 4000;

const ARC_SIZE = 56;
const ARC_RADIUS = 23;
const CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;

const CURSOR_SIZE = 64;

type Slide = { id: string; url: string; alt: string };

const FALLBACK_SLIDES: Slide[] = [
  { id: '1', url: '/showcase/lasenda.png', alt: 'Lasenda Dashboard' },
  { id: '2', url: '/showcase/cpap.png', alt: 'Sleep & CPAP Center Dashboard' },
  { id: '3', url: '/showcase/ai-dashboard.png', alt: 'JXAI Workflow Dashboard' },
  { id: '4', url: '/showcase/lms.png', alt: 'CleanScan Dashboard' },
];

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 0 7.5rem 6rem;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 0 0 4rem;
  }
`;

const SlideWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  cursor: none;

  @media (max-width: 768px) {
    aspect-ratio: 16 / 9;
    cursor: auto;
  }
`;

const Slide = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.9s ease;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  width: ${ARC_SIZE}px;
  height: ${ARC_SIZE}px;
  z-index: 2;
`;

const ArcSvg = styled.svg`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
`;

const PlayButton = styled.button`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: none;
  color: rgba(255, 255, 255, 0.9);
  z-index: 1;
  padding: 0;

  @media (max-width: 768px) {
    cursor: pointer;
  }

  &:focus-visible {
    outline: none;
  }
`;

const ShowcaseCursor = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${CURSOR_SIZE}px;
  height: ${CURSOR_SIZE}px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.buttonFillBg};
  color: ${({ theme }) => theme.colors.buttonFillText};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  will-change: transform;

  @media (max-width: 768px) {
    display: none;
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function WorkShowcase() {
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES);
  const slidesLenRef = useRef(FALLBACK_SLIDES.length);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    fetch('/api/showcase')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
          slidesLenRef.current = data.length;
        }
      })
      .catch(() => {});
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isPlayingRef = useRef(true);
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const targetCursorRef = useRef({ x: 0, y: 0 });

  /* ── Main animation loop ── */
  useEffect(() => {
    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);

      const delta = lastTimeRef.current ? time - lastTimeRef.current : 0;
      lastTimeRef.current = time;

      // Advance slide progress
      if (isPlayingRef.current) {
        progressRef.current = Math.min(progressRef.current + delta / SLIDE_DURATION, 1);

        if (progressRef.current >= 1) {
          progressRef.current = 0;
          setCurrentSlide((s) => (s + 1) % slidesLenRef.current);
        }

        if (arcRef.current) {
          arcRef.current.style.strokeDashoffset = String(
            CIRCUMFERENCE * (1 - progressRef.current)
          );
        }
      }

      // Lerp cursor position
      if (cursorRef.current) {
        cursorPosRef.current.x += (targetCursorRef.current.x - cursorPosRef.current.x) * 0.14;
        cursorPosRef.current.y += (targetCursorRef.current.y - cursorPosRef.current.y) * 0.14;
        cursorRef.current.style.transform = `translate3d(${cursorPosRef.current.x - CURSOR_SIZE / 2}px, ${cursorPosRef.current.y - CURSOR_SIZE / 2}px, 0)`;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── Mouse events on slide wrapper ── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onMove = (e: MouseEvent) => {
      targetCursorRef.current = { x: e.clientX, y: e.clientY };
    };
    const onEnter = (e: MouseEvent) => {
      // Snap immediately so cursor doesn't fly in from corner
      cursorPosRef.current = { x: e.clientX, y: e.clientY };
      targetCursorRef.current = { x: e.clientX, y: e.clientY };
      setCursorVisible(true);
    };
    const onLeave = () => setCursorVisible(false);

    wrapper.addEventListener('mousemove', onMove, { passive: true });
    wrapper.addEventListener('mouseenter', onEnter);
    wrapper.addEventListener('mouseleave', onLeave);

    return () => {
      wrapper.removeEventListener('mousemove', onMove);
      wrapper.removeEventListener('mouseenter', onEnter);
      wrapper.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    isPlayingRef.current = next;
  };

  return (
    <Section>
      <SlideWrapper ref={wrapperRef}>
        {slides.map((s, i) => (
          <Slide key={s.id} $active={i === currentSlide}>
            <Image
              src={s.url}
              alt={s.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={i === 0}
            />
          </Slide>
        ))}

        <Controls>
          <ArcSvg
            width={ARC_SIZE}
            height={ARC_SIZE}
            viewBox={`0 0 ${ARC_SIZE} ${ARC_SIZE}`}
          >
            {/* Track ring */}
            <circle
              cx={ARC_SIZE / 2}
              cy={ARC_SIZE / 2}
              r={ARC_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.5"
            />
            {/* Progress arc */}
            <circle
              ref={arcRef}
              cx={ARC_SIZE / 2}
              cy={ARC_SIZE / 2}
              r={ARC_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: `${ARC_SIZE / 2}px ${ARC_SIZE / 2}px`,
              }}
            />
          </ArcSvg>

          <PlayButton onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                <rect x="0" y="0" width="3.5" height="12" rx="1" />
                <rect x="6.5" y="0" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor">
                <path d="M0.5 0.5L10.5 6.5L0.5 12.5V0.5Z" />
              </svg>
            )}
          </PlayButton>
        </Controls>
      </SlideWrapper>

      {/* Showcase-specific cursor */}
      <ShowcaseCursor ref={cursorRef} $visible={cursorVisible}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Diagonal line */}
          <line
            x1="8"
            y1="20"
            x2="20"
            y2="8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Arrow head — top-right corner bracket */}
          <polyline
            points="11,8 20,8 20,17"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ShowcaseCursor>
    </Section>
  );
}
