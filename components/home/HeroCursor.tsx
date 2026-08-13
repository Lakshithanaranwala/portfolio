'use client';

import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useThemeToggle } from '@/components/providers/ThemeProvider';
import { particleStore } from '@/lib/particleStore';

const CURSOR_SIZE = 44;
const CURSOR_RADIUS = CURSOR_SIZE / 2;
const POS_LERP = 0.13;
const SCALE_LERP = 0.1;
const EFFECT_LERP = 0.07;
const BLUR_BASE = 6;
const BLUR_MAX = 14;
const BLUR_INTERACTIVE = 0.5;
const PARTICLE_CHECK_RADIUS = CURSOR_RADIUS + 4;

const CursorEl = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${CURSOR_SIZE}px;
  height: ${CURSOR_SIZE}px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
  border: 1px solid transparent;
  transition: opacity 0.25s ease;
`;

export default function HeroCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const isDarkRef = useRef(true);

  // Animated state (all in refs to avoid re-renders)
  const posRef = useRef({ x: -9999, y: -9999 });
  const targetPosRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const scaleRef = useRef(1);
  const targetScaleRef = useRef(1);
  const blurRef = useRef(BLUR_BASE);
  const glowRef = useRef(0);
  const bgAlphaRef = useRef(0.06);
  const borderAlphaRef = useRef(0.22);
  const isInteractiveRef = useRef(false);

  const { isDark } = useThemeToggle();

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    // Init position at viewport center
    posRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    targetPosRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [role="button"]')) {
        targetScaleRef.current = 1.5;
        isInteractiveRef.current = true;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [role="button"]')) {
        targetScaleRef.current = 1;
        isInteractiveRef.current = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      // Lerp position
      posRef.current.x += (targetPosRef.current.x - posRef.current.x) * POS_LERP;
      posRef.current.y += (targetPosRef.current.y - posRef.current.y) * POS_LERP;

      // Lerp scale
      scaleRef.current += (targetScaleRef.current - scaleRef.current) * SCALE_LERP;

      // Count particles within cursor radius
      const canvas = document.querySelector('[data-particle-canvas]') as HTMLCanvasElement | null;
      let nearCount = 0;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const pts = particleStore.points;
        const rSq = PARTICLE_CHECK_RADIUS * PARTICLE_CHECK_RADIUS;
        for (const p of pts) {
          const dx = (p.x + rect.left) - posRef.current.x;
          const dy = (p.y + rect.top) - posRef.current.y;
          if (dx * dx + dy * dy < rSq) nearCount++;
        }
      }

      // Hide when mouse is outside the hero section
      const heroEl = document.querySelector('[data-hero-section]');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        const inHero =
          posRef.current.x >= rect.left &&
          posRef.current.x <= rect.right &&
          posRef.current.y >= rect.top &&
          posRef.current.y <= rect.bottom;
        el.style.opacity = inHero ? '1' : '0';
        // Must also disable backdrop-filter — opacity:0 alone still blurs content beneath
        if (!inHero) {
          el.style.backdropFilter = 'none';
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (el.style as any).webkitBackdropFilter = 'none';
        }
      }

      const onInteractive = isInteractiveRef.current;
      const dark = isDarkRef.current;

      // Lerp blur — drops to BLUR_INTERACTIVE on interactive elements
      const particleBlur = nearCount > 0
        ? BLUR_BASE + Math.min(nearCount / 4, 1) * (BLUR_MAX - BLUR_BASE)
        : BLUR_BASE;
      const targetBlur = onInteractive ? BLUR_INTERACTIVE : particleBlur;
      const targetGlow = onInteractive ? 0 : (nearCount > 0 ? Math.min(nearCount / 4, 1) : 0);

      blurRef.current += (targetBlur - blurRef.current) * EFFECT_LERP;
      glowRef.current += (targetGlow - glowRef.current) * EFFECT_LERP;

      const glow = glowRef.current;

      // Lerp bg alpha — very transparent on interactive
      const targetBgAlpha = onInteractive
        ? 0
        : (dark ? 0.06 + glow * 0.08 : 0.04 + glow * 0.06);
      const targetBorderAlpha = onInteractive
        ? (dark ? 0.35 : 0.25)
        : (dark ? 0.22 + glow * 0.45 : 0.15 + glow * 0.35);

      bgAlphaRef.current += (targetBgAlpha - bgAlphaRef.current) * EFFECT_LERP;
      borderAlphaRef.current += (targetBorderAlpha - borderAlphaRef.current) * EFFECT_LERP;

      // Build styles
      const blur = blurRef.current.toFixed(2);
      const x = (posRef.current.x - CURSOR_RADIUS).toFixed(2);
      const y = (posRef.current.y - CURSOR_RADIUS).toFixed(2);
      const scale = scaleRef.current.toFixed(3);
      const bgAlpha = bgAlphaRef.current.toFixed(3);
      const borderAlpha = borderAlphaRef.current.toFixed(3);
      const glowColor = dark
        ? `rgba(255,255,255,${(glow * 0.28).toFixed(3)})`
        : `rgba(0,0,0,${(glow * 0.18).toFixed(3)})`;
      const glowSpread = (glow * 22).toFixed(1);
      const glowSize = (glow * 9).toFixed(1);

      el.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      el.style.background = dark
        ? `rgba(255,255,255,${bgAlpha})`
        : `rgba(0,0,0,${bgAlpha})`;
      el.style.backdropFilter = `blur(${blur}px) saturate(160%)`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el.style as any).webkitBackdropFilter = `blur(${blur}px) saturate(160%)`;
      el.style.borderColor = dark
        ? `rgba(255,255,255,${borderAlpha})`
        : `rgba(0,0,0,${borderAlpha})`;
      el.style.boxShadow = glow > 0.01
        ? `0 0 ${glowSpread}px ${glowSize}px ${glowColor}, inset 0 0 ${(glow * 10).toFixed(1)}px ${glowColor}`
        : 'none';
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return <CursorEl ref={cursorRef} />;
}
