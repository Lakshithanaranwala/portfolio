'use client';

import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useThemeToggle } from '@/components/providers/ThemeProvider';
import { particleStore } from '@/lib/particleStore';

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

/* ─── Constants ─────────────────────────────────────────────────────────── */

const PARTICLE_COUNT    = 380;
const PARTICLE_RADIUS   = 2;
const PARTICLE_OPACITY  = 0.6;
const REPEL_RADIUS      = 110;
const REPEL_STRENGTH    = 5;
const MAX_SPEED         = 0.45;
const RETURN_LERP       = 0.035;   // floating settle speed
const SCATTER_LERP      = 0.012;   // scattered settle speed (slower = more chaotic)
const FORM_LERP         = 0.065;   // lerp speed toward text targets
const JITTER            = 4.5;     // organic wiggle amplitude (px)
const WORD_HOLD_MS      = 4000;
const SCATTER_DRIFT_MS  = 4000;   // random drift after scatter
const PULL_MS           = 3000;   // gravity pull back to word
const PULL_LERP         = 0.018;  // slow gravity feel
const INITIAL_DELAY_MS  = 1500;
const WORDS             = ['Hi', 'UI', 'UX'];

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Mode = 'floating' | 'forming' | 'scattered' | 'pulling';

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  baseVx: number; baseVy: number;
  targetX: number; targetY: number;
  id: number;
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function makeParticle(w: number, h: number, id: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * MAX_SPEED + 0.08;
  const bvx = Math.cos(angle) * speed;
  const bvy = Math.sin(angle) * speed;
  return {
    x: Math.random() * w, y: Math.random() * h,
    vx: bvx, vy: bvy, baseVx: bvx, baseVy: bvy,
    targetX: 0, targetY: 0, id,
  };
}

function sampleTargets(
  word: string,
  cw: number,
  ch: number,
  count: number,
): { x: number; y: number }[] {
  const off = document.createElement('canvas');
  off.width = cw;
  off.height = ch;
  const ctx = off.getContext('2d');
  if (!ctx) return [];

  const fontSize = Math.min(cw * 0.40, ch * 0.62);
  const pad = 28;

  ctx.clearRect(0, 0, cw, ch);
  ctx.font = `300 ${fontSize}px 'Cormorant Garamond', serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = '#fff';
  ctx.fillText(word, cw - pad, ch - pad);

  const { data } = ctx.getImageData(0, 0, cw, ch);
  const pts: { x: number; y: number }[] = [];
  const step = 5;

  for (let y = 0; y < ch; y += step) {
    for (let x = 0; x < cw; x += step) {
      if (data[(y * cw + x) * 4 + 3] > 100) pts.push({ x, y });
    }
  }

  // Fisher-Yates shuffle then take `count`
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  return pts.slice(0, count);
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ParticleCanvas() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const particles   = useRef<Particle[]>([]);
  const mouseRef    = useRef({ x: -9999, y: -9999 });
  const rafRef      = useRef<number>(0);
  const hiddenRef   = useRef(false);
  const isDarkRef   = useRef(true);
  const lastTimeRef = useRef(0);

  // State machine
  const modeRef      = useRef<Mode>('floating');
  const wordIdxRef   = useRef(0);
  const wordTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scatterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isDark } = useThemeToggle();
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* ── Timers ── */
    function clearAllTimers() {
      if (wordTimer.current) clearTimeout(wordTimer.current);
      if (scatterTimer.current) clearTimeout(scatterTimer.current);
    }

    /* ── Assign targets ── */
    function assignTargets(targets: { x: number; y: number }[]) {
      particles.current.forEach((p, i) => {
        if (i < targets.length) {
          p.targetX = targets[i].x;
          p.targetY = targets[i].y;
        } else {
          // Excess particles hover near the word area
          p.targetX = canvas.width  * (0.55 + Math.random() * 0.42);
          p.targetY = canvas.height * (0.55 + Math.random() * 0.42);
        }
      });
    }

    /* ── Start forming a word ── */
    function startForming() {
      modeRef.current = 'forming';
      const targets = sampleTargets(WORDS[wordIdxRef.current], canvas.width, canvas.height, PARTICLE_COUNT);
      assignTargets(targets);

      clearAllTimers();
      wordTimer.current = setTimeout(() => {
        wordIdxRef.current = (wordIdxRef.current + 1) % WORDS.length;
        startForming();
      }, WORD_HOLD_MS);
    }

    /* ── Scatter / dissolve ── */
    function scatter() {
      if (modeRef.current === 'scattered' || modeRef.current === 'pulling') return;
      clearAllTimers();
      modeRef.current = 'scattered';

      // Burst particles outward from their current positions
      particles.current.forEach(p => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        const ba = Math.random() * Math.PI * 2;
        const bs = Math.random() * MAX_SPEED + 0.08;
        p.baseVx = Math.cos(ba) * bs;
        p.baseVy = Math.sin(ba) * bs;
      });

      // After 4s drift → start gravity pull back (same word, targets already assigned)
      scatterTimer.current = setTimeout(() => startPulling(), SCATTER_DRIFT_MS);
    }

    /* ── Gravity pull back to word ── */
    function startPulling() {
      clearAllTimers();
      modeRef.current = 'pulling';
      // Targets stay as-is from the word that was scattered — same word comes back
      scatterTimer.current = setTimeout(() => startForming(), PULL_MS);
    }

    /* ── Init / resize ── */
    function initParticles() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      particles.current = Array.from({ length: PARTICLE_COUNT }, (_, id) =>
        makeParticle(w, h, id)
      );
      particleStore.points = particles.current;
    }

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
      if (modeRef.current === 'forming') {
        const targets = sampleTargets(WORDS[wordIdxRef.current], canvas.width, canvas.height, PARTICLE_COUNT);
        assignTargets(targets);
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // First word forms after initial delay (gives hero GSAP animation time to finish)
    const initTimer = setTimeout(startForming, INITIAL_DELAY_MS);

    /* ── Mouse / touch tracking ── */
    function updatePointer(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mouseRef.current = (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height)
        ? { x, y }
        : { x: -9999, y: -9999 };
    }

    const onMouseMove  = (e: MouseEvent)  => updatePointer(e.clientX, e.clientY);
    const onTouchMove  = (e: TouchEvent)  => { if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchStart = (e: TouchEvent)  => { if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchEnd   = ()               => { mouseRef.current = { x: -9999, y: -9999 }; };
    const onVisChange  = ()               => { hiddenRef.current = document.hidden; };

    window.addEventListener('mousemove',        onMouseMove,  { passive: true });
    window.addEventListener('touchmove',        onTouchMove,  { passive: true });
    window.addEventListener('touchstart',       onTouchStart, { passive: true });
    window.addEventListener('touchend',         onTouchEnd,   { passive: true });
    document.addEventListener('visibilitychange', onVisChange);

    /* ── Animation loop ── */
    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      if (hiddenRef.current && time - lastTimeRef.current < 250) return;
      lastTimeRef.current = time;

      const w     = canvas.width;
      const h     = canvas.height;
      const color = isDarkRef.current ? '255,255,255' : '13,13,13';
      const mode  = modeRef.current;

      ctx.clearRect(0, 0, w, h);

      let cursorHit = false;

      for (const p of particles.current) {
        const dx     = p.x - mouseRef.current.x;
        const dy     = p.y - mouseRef.current.y;
        const distSq = dx * dx + dy * dy;
        const repSq  = REPEL_RADIUS * REPEL_RADIUS;

        if (mode === 'forming') {
          // Check if cursor/touch is touching any formed particle
          if (distSq < repSq) cursorHit = true;

          // Lerp toward target + organic jitter
          const jx = Math.sin(time * 0.0022 + p.id * 0.91) * JITTER;
          const jy = Math.cos(time * 0.0031 + p.id * 1.17) * JITTER;
          p.x += (p.targetX + jx - p.x) * FORM_LERP;
          p.y += (p.targetY + jy - p.y) * FORM_LERP;

        } else if (mode === 'pulling') {
          // Cursor repulsion still active but no scatter trigger
          if (distSq < repSq && distSq > 0.01) {
            const dist  = Math.sqrt(distSq);
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) ** 1.5;
            p.vx += (dx / dist) * force * REPEL_STRENGTH;
            p.vy += (dy / dist) * force * REPEL_STRENGTH;
          }
          p.vx *= 0.9;
          p.vy *= 0.9;
          p.x  += p.vx;
          p.y  += p.vy;
          // Gravity: slow simultaneous drift toward target
          p.x += (p.targetX - p.x) * PULL_LERP;
          p.y += (p.targetY - p.y) * PULL_LERP;
          // Wrap edges
          if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        } else {
          // floating / scattered: free drift with cursor repulsion
          if (distSq < repSq && distSq > 0.01) {
            const dist  = Math.sqrt(distSq);
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) ** 1.5;
            p.vx += (dx / dist) * force * REPEL_STRENGTH;
            p.vy += (dy / dist) * force * REPEL_STRENGTH;
          }

          const lerp = mode === 'scattered' ? SCATTER_LERP : RETURN_LERP;
          p.vx += (p.baseVx - p.vx) * lerp;
          p.vy += (p.baseVy - p.vy) * lerp;
          p.x  += p.vx;
          p.y  += p.vy;

          // Wrap edges
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${PARTICLE_OPACITY})`;
        ctx.fill();
      }

      // Trigger dissolve if cursor/touch hit any forming particle
      if (cursorHit && mode === 'forming') scatter();
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      clearAllTimers();
      clearTimeout(initTimer);
      window.removeEventListener('mousemove',        onMouseMove);
      window.removeEventListener('touchmove',        onTouchMove);
      window.removeEventListener('touchstart',       onTouchStart);
      window.removeEventListener('touchend',         onTouchEnd);
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, []);

  return <Canvas ref={canvasRef} data-particle-canvas />;
}
