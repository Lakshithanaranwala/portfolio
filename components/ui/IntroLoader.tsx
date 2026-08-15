'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useThemeToggle } from '@/components/providers/ThemeProvider';

/* ─── Constants ─────────────────────────────────────────────────────────── */

const BAR_COUNT = 5;
const ENTER_MS = 900;
const EXIT_MS = 900;
const STAGGER_MS = 90;
const HOLD_MS = 80;
const EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';

const TOTAL_MS =
  ENTER_MS + (BAR_COUNT - 1) * STAGGER_MS + HOLD_MS +
  EXIT_MS + (BAR_COUNT - 1) * STAGGER_MS;

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  z-index: 99999;
  pointer-events: all;
`;

const Bar = styled.div<{ $color: string }>`
  flex: 1;
  height: 100%;
  background: ${({ $color }) => $color};
  transform: translateY(-100%);
  will-change: transform;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function IntroLoader() {
  const { isDark } = useThemeToggle();
  const barColor = isDark ? '#ffffff' : '#121417';
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const bars = barsRef.current;

    bars.forEach((bar) => {
      if (!bar) return;
      bar.style.transition = 'none';
      bar.style.transform = 'translateY(-100%)';
    });

    // Entry: bars drop down, staggered left → right
    const enterTimers = bars.map((bar, i) =>
      setTimeout(() => {
        if (!bar) return;
        bar.style.transition = `transform ${ENTER_MS}ms ${EASING}`;
        bar.style.transform = 'translateY(0%)';
      }, i * STAGGER_MS)
    );

    // Exit: bars fall off screen, staggered left → right
    const totalEnterTime = ENTER_MS + (BAR_COUNT - 1) * STAGGER_MS + HOLD_MS;
    const exitTimers = bars.map((bar, i) =>
      setTimeout(() => {
        if (!bar) return;
        bar.style.transition = `transform ${EXIT_MS}ms ${EASING}`;
        bar.style.transform = 'translateY(100%)';
      }, totalEnterTime + i * STAGGER_MS)
    );

    // Remove from DOM once fully gone
    const hideTimer = setTimeout(() => setVisible(false), TOTAL_MS);

    return () => {
      [...enterTimers, ...exitTimers, hideTimer].forEach(clearTimeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <Overlay>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <Bar
          key={i}
          $color={barColor}
          ref={(el) => { barsRef.current[i] = el; }}
        />
      ))}
    </Overlay>
  );
}
