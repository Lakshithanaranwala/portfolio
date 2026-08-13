'use client';

import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

export const ARROW_CURSOR_SIZE = 64;

export const ArrowCursorEl = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${ARROW_CURSOR_SIZE}px;
  height: ${ARROW_CURSOR_SIZE}px;
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

export const ArrowIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <line x1="8" y1="20" x2="20" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <polyline points="11,8 20,8 20,17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function useArrowCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const targetCursorRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: MouseEvent) => {
      targetCursorRef.current = { x: e.clientX, y: e.clientY };
    };
    const onEnter = (e: MouseEvent) => {
      cursorPosRef.current = { x: e.clientX, y: e.clientY };
      targetCursorRef.current = { x: e.clientX, y: e.clientY };
      setCursorVisible(true);
    };
    const onLeave = () => setCursorVisible(false);

    container.addEventListener('mousemove', onMove, { passive: true });
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const cur = cursorRef.current;
      if (cur) {
        cursorPosRef.current.x += (targetCursorRef.current.x - cursorPosRef.current.x) * 0.14;
        cursorPosRef.current.y += (targetCursorRef.current.y - cursorPosRef.current.y) * 0.14;
        cur.style.transform = `translate3d(${cursorPosRef.current.x - ARROW_CURSOR_SIZE / 2}px, ${cursorPosRef.current.y - ARROW_CURSOR_SIZE / 2}px, 0)`;
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return { containerRef, cursorRef, cursorVisible };
}
