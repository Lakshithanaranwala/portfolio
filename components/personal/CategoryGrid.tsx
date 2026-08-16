'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const CURSOR_SIZE = 64;

/* ─── Data ───────────────────────────────────────────────────────────────── */

const CATEGORIES = [
  {
    label: 'Branding',
    src: '/personal/branding.png',
    raised: false,
  },
  {
    label: 'Illustrations',
    src: '/personal/illustrations.png',
    raised: true,
  },
  {
    label: 'Marketing',
    src: '/personal/marketing.png',
    raised: false,
  },
];

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  align-items: end;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div<{ $raised: boolean }>`
  position: relative;
  height: 62vh;
  min-height: 420px;
  margin-top: ${({ $raised }) => ($raised ? '-6rem' : '0')};
  overflow: hidden;
  background: #111;
  cursor: pointer;

  img {
    filter: saturate(0.2);
    transition: filter 0.5s ease;
  }

  &:hover img {
    filter: saturate(1);
  }

  @media (max-width: 700px) {
    margin-top: 0;
    height: 55vw;
    min-height: 260px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.1) 45%,
    transparent 70%
  );
  z-index: 1;
`;

const CategoryLabel = styled.p`
  position: absolute;
  bottom: 1.75rem;
  left: 1.75rem;
  z-index: 2;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 3.25rem);
  font-weight: 300;
  letter-spacing: -0.01em;
  color: #fff;
  line-height: 1;
  margin: 0;
`;

const CustomCursor = styled.div<{ $visible: boolean }>`
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

export default function CategoryGrid() {
  const [cursorVisible, setCursorVisible] = useState(false);
  const gridRef        = useRef<HTMLDivElement>(null);
  const cursorRef      = useRef<HTMLDivElement>(null);
  const cursorPosRef   = useRef({ x: 0, y: 0 });
  const targetPosRef   = useRef({ x: 0, y: 0 });
  const rafRef         = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (cursorRef.current) {
        cursorPosRef.current.x += (targetPosRef.current.x - cursorPosRef.current.x) * 0.14;
        cursorPosRef.current.y += (targetPosRef.current.y - cursorPosRef.current.y) * 0.14;
        cursorRef.current.style.transform = `translate3d(${cursorPosRef.current.x - CURSOR_SIZE / 2}px, ${cursorPosRef.current.y - CURSOR_SIZE / 2}px, 0)`;
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const onMove   = (e: MouseEvent) => { targetPosRef.current = { x: e.clientX, y: e.clientY }; };
    const onEnter  = (e: MouseEvent) => {
      cursorPosRef.current = { x: e.clientX, y: e.clientY };
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setCursorVisible(true);
    };
    const onLeave  = () => setCursorVisible(false);

    grid.addEventListener('mousemove',  onMove,  { passive: true });
    grid.addEventListener('mouseenter', onEnter);
    grid.addEventListener('mouseleave', onLeave);
    return () => {
      grid.removeEventListener('mousemove',  onMove);
      grid.removeEventListener('mouseenter', onEnter);
      grid.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <Grid ref={gridRef} style={{ cursor: 'none' }}>
        {CATEGORIES.map((cat) => (
          <Card key={cat.label} $raised={cat.raised}>
            <Image
              src={cat.src}
              alt={cat.label}
              fill
              style={{ objectFit: 'cover' }}
            />
            <Overlay />
            <CategoryLabel>{cat.label}</CategoryLabel>
          </Card>
        ))}
      </Grid>

      <CustomCursor ref={cursorRef} $visible={cursorVisible}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <line x1="8" y1="20" x2="20" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <polyline points="11,8 20,8 20,17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </CustomCursor>
    </>
  );
}
