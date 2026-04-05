"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  angle: number; // unique scatter angle
  dist: number; // unique scatter distance
  swirl: number; // swirl offset for organic motion
  size: number;
  alpha: number;
}

export default function ParticleSymbol({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timerRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const SCATTER_DURATION = 4.0;
  const HOLD_SCATTERED = 2.0;
  const GATHER_DURATION = 4.0;
  const HOLD_GATHERED = 5.0;
  const TOTAL_CYCLE =
    SCATTER_DURATION + HOLD_SCATTERED + GATHER_DURATION + HOLD_GATHERED;

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const logicalW = canvas.clientWidth;
    const logicalH = canvas.clientHeight;

    sizeRef.current = { w: logicalW, h: logicalH };
    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;

    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext("2d")!;

    const img = new window.Image();
    img.onload = () => {
      // Draw the symbol centered, at about 45% of the canvas height
      const symbolH = logicalH * dpr * 0.45;
      const symbolW =
        (img.naturalWidth / img.naturalHeight) * symbolH;
      const ox = (canvas.width - symbolW) / 2;
      const oy = (canvas.height - symbolH) / 2;

      offCtx.drawImage(img, ox, oy, symbolW, symbolH);
      const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const particles: Particle[] = [];
      // Sample density based on canvas size — target ~2500-4000 particles
      const area = canvas.width * canvas.height;
      const step = Math.max(3, Math.round(Math.sqrt(area / 3500)));

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const i = (y * canvas.width + x) * 4;
          if (pixels[i + 3] > 30) {
            // Pre-compute a unique scatter direction per particle
            const baseAngle = Math.atan2(y - cy, x - cx);
            const angle = baseAngle + (Math.random() - 0.5) * 1.2;
            const dist = 100 + Math.random() * 200;

            particles.push({
              homeX: x / dpr,
              homeY: y / dpr,
              x: x / dpr,
              y: y / dpr,
              angle,
              dist,
              swirl: Math.random() * Math.PI * 2,
              size: 1.2 + Math.random() * 1.8,
              alpha: 0.5 + Math.random() * 0.5,
            });
          }
        }
      }

      particlesRef.current = particles;
    };
    img.src = "/assets/symbol.svg";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    initParticles(canvas);

    // Handle resize
    const onResize = () => {
      initParticles(canvas);
    };
    window.addEventListener("resize", onResize);

    const ctx = canvas.getContext("2d")!;
    let lastTime = performance.now();

    const ease = (v: number) => v * v * (3 - 2 * v);

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      timerRef.current += dt;

      const { w, h } = sizeRef.current;
      const dpr = window.devicePixelRatio || 1;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cycleTime = timerRef.current % TOTAL_CYCLE;

      let phase: number;
      let t: number;
      if (cycleTime < SCATTER_DURATION) {
        phase = 0;
        t = cycleTime / SCATTER_DURATION;
      } else if (cycleTime < SCATTER_DURATION + HOLD_SCATTERED) {
        phase = 1;
        t = 1;
      } else if (
        cycleTime <
        SCATTER_DURATION + HOLD_SCATTERED + GATHER_DURATION
      ) {
        phase = 2;
        t = (cycleTime - SCATTER_DURATION - HOLD_SCATTERED) / GATHER_DURATION;
      } else {
        phase = 3;
        t = 0;
      }

      const nowSec = now / 1000;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (phase === 0) {
          // Scattering outward with swirl
          const progress = ease(t);
          const swirlAngle =
            p.angle + Math.sin(nowSec * 0.8 + p.swirl) * 0.5 * progress;
          const targetX =
            p.homeX + Math.cos(swirlAngle) * p.dist * progress;
          const targetY =
            p.homeY + Math.sin(swirlAngle) * p.dist * progress;
          p.x += (targetX - p.x) * 0.06;
          p.y += (targetY - p.y) * 0.06;
        } else if (phase === 1) {
          // Drifting scattered — organic swirl
          const swirlX =
            Math.sin(nowSec * 0.6 + p.swirl) * 1.2 +
            Math.sin(nowSec * 0.3 + i * 0.01) * 0.8;
          const swirlY =
            Math.cos(nowSec * 0.5 + p.swirl * 1.3) * 1.2 +
            Math.cos(nowSec * 0.25 + i * 0.01) * 0.8;
          p.x += swirlX * 0.4;
          p.y += swirlY * 0.4;
        } else if (phase === 2) {
          // Gathering back — swirl inward
          const progress = ease(t);
          const remaining = 1 - progress;
          // Add a gentle spiral as they return
          const spiralAngle =
            Math.sin(nowSec * 1.2 + p.swirl) * 0.3 * remaining;
          const targetX = p.homeX + Math.cos(spiralAngle) * 5 * remaining;
          const targetY = p.homeY + Math.sin(spiralAngle) * 5 * remaining;
          const speed = 0.03 + progress * 0.12;
          p.x += (targetX - p.x) * speed;
          p.y += (targetY - p.y) * speed;
        } else {
          // Holding formed — subtle breathing
          const breath = Math.sin(nowSec * 1.5 + p.swirl) * 0.3;
          p.x += (p.homeX - p.x) * 0.12 + breath * 0.1;
          p.y += (p.homeY - p.y) * 0.12 + breath * 0.08;
        }

        // Alpha: full when gathered, softer when scattered
        let alphaMultiplier: number;
        if (phase === 0) {
          alphaMultiplier = 1 - ease(t) * 0.4;
        } else if (phase === 1) {
          alphaMultiplier = 0.6;
        } else if (phase === 2) {
          alphaMultiplier = 0.6 + ease(t) * 0.4;
        } else {
          alphaMultiplier = 1;
        }

        ctx.globalAlpha = p.alpha * alphaMultiplier;
        ctx.fillStyle = "rgb(116, 205, 216)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", onResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles, SCATTER_DURATION, HOLD_SCATTERED, GATHER_DURATION, HOLD_GATHERED, TOTAL_CYCLE]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
