'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useThemeToggle } from '@/components/providers/ThemeProvider';

const BAR_COUNT = 5;
const ENTER_MS = 300;
const EXIT_MS = 300;
const STAGGER_MS = 30;
const HOLD_MS = 0;
const EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';

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

export default function Template({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeToggle();
  const barColor = isDark ? '#ffffff' : '#121417';
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const bars = barsRef.current;

    bars.forEach((bar) => {
      if (!bar) return;
      bar.style.transition = 'none';
      bar.style.transform = 'translateY(-100%)';
    });

    const enterTimers = bars.map((bar, i) =>
      setTimeout(() => {
        if (!bar) return;
        bar.style.transition = `transform ${ENTER_MS}ms ${EASING}`;
        bar.style.transform = 'translateY(0%)';
      }, i * STAGGER_MS)
    );

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
