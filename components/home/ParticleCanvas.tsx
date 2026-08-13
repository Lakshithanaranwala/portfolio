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

const PARTICLE_COUNT = 130;
const PARTICLE_RADIUS = 1.5;
const PARTICLE_OPACITY = 0.55;
const REPEL_RADIUS = 130;
const REPEL_STRENGTH = 5;
const MAX_SPEED = 0.5;
const RETURN_LERP = 0.04;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
};

function createParticle(w: number, h: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * MAX_SPEED + 0.08;
  const baseVx = Math.cos(angle) * speed;
  const baseVy = Math.sin(angle) * speed;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: baseVx,
    vy: baseVy,
    baseVx,
    baseVy,
  };
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const isHiddenRef = useRef(false);
  const isDarkRef = useRef(true);
  const lastTimeRef = useRef(0);

  const { isDark } = useThemeToggle();

  // Sync isDark to ref so animation loop picks it up without restarting
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initParticles = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(w, h)
      );
      // Share direct reference — mutations in the loop are visible to readers
      particleStore.points = particlesRef.current;
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Track mouse relative to the canvas bounds
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only track if mouse is within section bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current = { x, y };
      } else {
        mouseRef.current = { x: -9999, y: -9999 };
      }
    };

    const onVisibilityChange = () => {
      isHiddenRef.current = document.hidden;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);

      // When tab is hidden, update only every ~250ms
      if (isHiddenRef.current && time - lastTimeRef.current < 250) return;
      lastTimeRef.current = time;

      const w = canvas.width;
      const h = canvas.height;
      const color = isDarkRef.current ? '255,255,255' : '13,13,13';

      ctx.clearRect(0, 0, w, h);

      for (const p of particlesRef.current) {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distSq = dx * dx + dy * dy;
        const repelSq = REPEL_RADIUS * REPEL_RADIUS;

        if (distSq < repelSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) ** 1.5;
          p.vx += (dx / dist) * force * REPEL_STRENGTH;
          p.vy += (dy / dist) * force * REPEL_STRENGTH;
        }

        // Smoothly return to base drift velocity
        p.vx += (p.baseVx - p.vx) * RETURN_LERP;
        p.vy += (p.baseVy - p.vy) * RETURN_LERP;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

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
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <Canvas ref={canvasRef} data-particle-canvas />;
}
