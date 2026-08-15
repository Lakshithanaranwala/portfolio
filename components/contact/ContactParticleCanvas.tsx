'use client';

import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useThemeToggle } from '@/components/providers/ThemeProvider';

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

/* ─── Constants ─────────────────────────────────────────────────────────── */

const PARTICLE_COUNT   = 350;
const PARTICLE_RADIUS  = 2;
const PARTICLE_OPACITY = 0.55;
const REPEL_RADIUS     = 110;
const REPEL_STRENGTH   = 5;
const MAX_SPEED        = 0.45;
const SCATTER_LERP     = 0.012;
const FORM_LERP        = 0.065;
const JITTER           = 3;
const FORM_HOLD_MS     = 1800;  // hold at left before drifting
const SCATTER_HOLD_MS  = 3500;  // scatter before reforming
const DRIFT_SECONDS    = 10;    // seconds to cross the screen

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Mode = 'floating' | 'forming' | 'drifting' | 'scattered';

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  baseVx: number; baseVy: number;
  targetX: number; targetY: number;
  id: number;
};

type RelPt = { rx: number; ry: number };

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function makeParticle(w: number, h: number, id: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * MAX_SPEED + 0.08;
  const bvx = Math.cos(angle) * speed;
  const bvy = Math.sin(angle) * speed;
  return { x: Math.random() * w, y: Math.random() * h, vx: bvx, vy: bvy, baseVx: bvx, baseVy: bvy, targetX: 0, targetY: 0, id };
}

function drawEnvelope(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const lw = Math.max(7, w * 0.045);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Outer rectangle
  ctx.strokeRect(x, y, w, h);

  // Top V-flap
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y + h * 0.48);
  ctx.lineTo(x + w, y);
  ctx.stroke();

  // Bottom fold lines
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w * 0.38, y + h * 0.53);
  ctx.moveTo(x + w, y + h);
  ctx.lineTo(x + w * 0.62, y + h * 0.53);
  ctx.stroke();
}

function sampleIcon(cw: number, ch: number): { pts: RelPt[]; centerX: number; centerY: number; iW: number } {
  if (!cw || !ch) return { pts: [], centerX: 0, centerY: 0, iW: 0 };

  const iW   = cw * 0.20;
  const iH   = iW * 0.65;
  const pad  = cw * 0.05;
  const ix   = pad;
  const iy   = (ch - iH) / 2;
  const icx  = ix + iW / 2;
  const icy  = ch / 2;

  const off = document.createElement('canvas');
  off.width  = cw;
  off.height = ch;
  const ctx = off.getContext('2d');
  if (!ctx) return { pts: [], centerX: icx, centerY: icy, iW };

  drawEnvelope(ctx, ix, iy, iW, iH);

  const { data } = ctx.getImageData(0, 0, cw, ch);
  const pts: RelPt[] = [];
  const step = 5;

  for (let y = 0; y < ch; y += step) {
    for (let x = 0; x < cw; x += step) {
      if (data[(y * cw + x) * 4 + 3] > 100) {
        pts.push({ rx: x - icx, ry: y - icy });
      }
    }
  }

  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }

  return { pts: pts.slice(0, PARTICLE_COUNT), centerX: icx, centerY: icy, iW };
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ContactParticleCanvas() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const particles   = useRef<Particle[]>([]);
  const mouseRef    = useRef({ x: -9999, y: -9999 });
  const rafRef      = useRef<number>(0);
  const hiddenRef   = useRef(false);
  const isDarkRef   = useRef(true);
  const lastTimeRef = useRef(0);
  const modeRef     = useRef<Mode>('floating');
  const driftRef    = useRef(0);
  const driftSpeedRef = useRef(1);
  const maxDriftRef   = useRef(0);
  const relPtsRef   = useRef<RelPt[]>([]);
  const icxRef      = useRef(0);
  const icyRef      = useRef(0);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isDark } = useThemeToggle();
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function clearTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    function assignTargets(drift: number) {
      const cx = icxRef.current + drift;
      const cy = icyRef.current;
      const pts = relPtsRef.current;
      particles.current.forEach((p, i) => {
        if (i < pts.length) {
          p.targetX = cx + pts[i].rx;
          p.targetY = cy + pts[i].ry;
        } else {
          p.targetX = cx + (Math.random() - 0.5) * 80;
          p.targetY = cy + (Math.random() - 0.5) * 50;
        }
      });
    }

    function startForming() {
      if (!canvas.width || !canvas.height) {
        timerRef.current = setTimeout(startForming, 200);
        return;
      }
      driftRef.current = 0;
      const { pts, centerX, centerY, iW } = sampleIcon(canvas.width, canvas.height);
      relPtsRef.current = pts;
      icxRef.current    = centerX;
      icyRef.current    = centerY;
      // max drift: icon center travels from startX to (cw - 5% - iW/2)
      maxDriftRef.current  = canvas.width * 0.95 - iW / 2 - centerX;
      driftSpeedRef.current = maxDriftRef.current / (DRIFT_SECONDS * 60);
      assignTargets(0);
      modeRef.current = 'forming';
      clearTimer();
      timerRef.current = setTimeout(() => {
        modeRef.current = 'drifting';
      }, FORM_HOLD_MS);
    }

    function scatter() {
      if (modeRef.current === 'scattered') return;
      clearTimer();
      modeRef.current = 'scattered';
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
      timerRef.current = setTimeout(startForming, SCATTER_HOLD_MS);
    }

    function initParticles() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      particles.current = Array.from({ length: PARTICLE_COUNT }, (_, id) => makeParticle(w, h, id));
    }

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
      if (modeRef.current === 'forming' || modeRef.current === 'drifting') {
        const { pts, centerX, centerY, iW } = sampleIcon(canvas.width, canvas.height);
        relPtsRef.current     = pts;
        icxRef.current        = centerX;
        icyRef.current        = centerY;
        maxDriftRef.current   = canvas.width * 0.95 - iW / 2 - centerX;
        driftSpeedRef.current = maxDriftRef.current / (DRIFT_SECONDS * 60);
        assignTargets(driftRef.current);
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    startForming();

    /* ── Pointer tracking ── */
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

      if (mode === 'drifting') {
        driftRef.current += driftSpeedRef.current;
        assignTargets(driftRef.current);
        if (driftRef.current >= maxDriftRef.current) scatter();
      }

      ctx.clearRect(0, 0, w, h);
      let cursorHit = false;

      for (const p of particles.current) {
        const dx     = p.x - mouseRef.current.x;
        const dy     = p.y - mouseRef.current.y;
        const distSq = dx * dx + dy * dy;
        const repSq  = REPEL_RADIUS * REPEL_RADIUS;

        if (mode === 'forming' || mode === 'drifting') {
          if (distSq < repSq) cursorHit = true;
          const jx = Math.sin(time * 0.0022 + p.id * 0.91) * JITTER;
          const jy = Math.cos(time * 0.0031 + p.id * 1.17) * JITTER;
          p.x += (p.targetX + jx - p.x) * FORM_LERP;
          p.y += (p.targetY + jy - p.y) * FORM_LERP;
        } else {
          if (distSq < repSq && distSq > 0.01) {
            const dist  = Math.sqrt(distSq);
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) ** 1.5;
            p.vx += (dx / dist) * force * REPEL_STRENGTH;
            p.vy += (dy / dist) * force * REPEL_STRENGTH;
          }
          p.vx += (p.baseVx - p.vx) * SCATTER_LERP;
          p.vy += (p.baseVy - p.vy) * SCATTER_LERP;
          p.x  += p.vx;
          p.y  += p.vy;
          if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${PARTICLE_OPACITY})`;
        ctx.fill();
      }

      if (cursorHit && (mode === 'forming' || mode === 'drifting')) scatter();
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      clearTimer();
      window.removeEventListener('mousemove',        onMouseMove);
      window.removeEventListener('touchmove',        onTouchMove);
      window.removeEventListener('touchstart',       onTouchStart);
      window.removeEventListener('touchend',         onTouchEnd);
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, []);

  return <Canvas ref={canvasRef} />;
}
