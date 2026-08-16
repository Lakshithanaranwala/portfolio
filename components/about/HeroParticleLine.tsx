'use client';

import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useThemeToggle } from '@/components/providers/ThemeProvider';

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
`;

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

/* ─── Constants ─────────────────────────────────────────────────────────── */

const PARTICLE_COUNT  = 350;
const PARTICLE_RADIUS = 1.5;
const PARTICLE_OPACITY = 0.55;
const REPEL_RADIUS    = 100;
const REPEL_STRENGTH  = 5;
const MAX_SPEED       = 0.4;
const FORM_LERP       = 0.055;

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  targetX: number; targetY: number;
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function makeParticle(w: number, h: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * MAX_SPEED + 0.05;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    targetX: 0,
    targetY: 0,
  };
}

function getMargin(_w: number) {
  return 0;
}

function assignLineTargets(particles: Particle[], w: number, h: number) {
  const margin = getMargin(w);
  const lineY = h - PARTICLE_RADIUS - 2;
  const lineW = w - margin * 2;
  particles.forEach((p, i) => {
    p.targetX = margin + (i / (particles.length - 1)) * lineW;
    p.targetY = lineY;
  });
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function HeroParticleLine() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const particles  = useRef<Particle[]>([]);
  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const rafRef     = useRef<number>(0);
  const isDarkRef  = useRef(true);
  const hiddenRef  = useRef(false);
  const lastTimeRef = useRef(0);

  const { isDark } = useThemeToggle();
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function init() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles.current = Array.from({ length: PARTICLE_COUNT }, () =>
        makeParticle(canvas.width, canvas.height)
      );
      assignLineTargets(particles.current, canvas.width, canvas.height);
    }

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles.current.forEach(p => {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
      });
      assignLineTargets(particles.current, canvas.width, canvas.height);
    }

    init();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── Pointer ── */
    function updatePointer(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mouseRef.current = (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height)
        ? { x, y } : { x: -9999, y: -9999 };
    }

    const onMouseMove  = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const onTouchMove  = (e: TouchEvent) => { if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchStart = (e: TouchEvent) => { if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchEnd   = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    const onVisChange  = () => { hiddenRef.current = document.hidden; };

    window.addEventListener('mousemove',  onMouseMove,  { passive: true });
    window.addEventListener('touchmove',  onTouchMove,  { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    document.addEventListener('visibilitychange', onVisChange);

    /* ── Animation loop ── */
    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      if (hiddenRef.current && time - lastTimeRef.current < 250) return;
      lastTimeRef.current = time;

      const w     = canvas.width;
      const h     = canvas.height;
      const color = isDarkRef.current ? '255,255,255' : '13,13,13';
      const repSq = REPEL_RADIUS * REPEL_RADIUS;

      ctx.clearRect(0, 0, w, h);

      for (const p of particles.current) {
        const dx     = p.x - mouseRef.current.x;
        const dy     = p.y - mouseRef.current.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < repSq && distSq > 0.01) {
          const dist  = Math.sqrt(distSq);
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) ** 1.5;
          p.vx += (dx / dist) * force * REPEL_STRENGTH;
          p.vy += (dy / dist) * force * REPEL_STRENGTH;
        }

        // Dampen velocity and lerp back toward target
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x  += p.vx;
        p.y  += p.vy;
        p.x  += (p.targetX - p.x) * FORM_LERP;
        p.y  += (p.targetY - p.y) * FORM_LERP;

        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${PARTICLE_OPACITY})`;
        ctx.fill();
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, []);

  return (
    <Wrapper>
      <Canvas ref={canvasRef} />
    </Wrapper>
  );
}
