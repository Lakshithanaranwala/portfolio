'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useThemeToggle } from '@/components/providers/ThemeProvider';

/* ─── Constants ─────────────────────────────────────────────────────────── */

const BAR_COUNT = 5;
const ENTER_MS = 900;
const EXIT_MS = 900;
const STAGGER_MS = 90;
const HOLD_MS = 80;
const EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  z-index: 99999;
  pointer-events: none;
`;

const Bar = styled.div<{ $color: string }>`
  flex: 1;
  height: 100%;
  background: ${({ $color }) => $color};
  transform: translateY(-100%);
  will-change: transform;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Template({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeToggle();
  const barColor = isDark
    ? 'rgba(255, 255, 255, 0.93)'
    : 'rgba(18, 20, 23, 0.93)';

  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const bars = barsRef.current;

    // Snap to starting position above viewport, no transition
    bars.forEach((bar) => {
      if (!bar) return;
      bar.style.transition = 'none';
      bar.style.transform = 'translateY(-100%)';
    });

    // Entry phase: bars drop down, staggered left → right
    const enterTimers = bars.map((bar, i) =>
      setTimeout(() => {
        if (!bar) return;
        bar.style.transition = `transform ${ENTER_MS}ms ${EASING}`;
        bar.style.transform = 'translateY(0%)';
      }, i * STAGGER_MS)
    );

    // Exit phase: bars fall off screen, staggered left → right
    const totalEnterTime = ENTER_MS + (BAR_COUNT - 1) * STAGGER_MS + HOLD_MS;

    const exitTimers = bars.map((bar, i) =>
      setTimeout(() => {
        if (!bar) return;
        bar.style.transition = `transform ${EXIT_MS}ms ${EASING}`;
        bar.style.transform = 'translateY(100%)';
      }, totalEnterTime + i * STAGGER_MS)
    );

    return () => {
      [...enterTimers, ...exitTimers].forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <Overlay>
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <Bar
            key={i}
            $color={barColor}
            ref={(el) => { barsRef.current[i] = el; }}
          />
        ))}
      </Overlay>
      {children}
    </>
  );
}
