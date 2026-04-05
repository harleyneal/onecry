"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export default function ParticleSymbol({
  width = 600,
  height = 600,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const phaseRef = useRef(0);
  const timerRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  const SCATTER_DURATION = 3.0;
  const HOLD_SCATTERED = 1.5;
  const GATHER_DURATION = 3.0;
  const HOLD_GATHERED = 4.0;
  const TOTAL_CYCLE =
    SCATTER_DURATION + HOLD_SCATTERED + GATHER_DURATION + HOLD_GATHERED;

  const initParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      // Draw the SVG symbol to an offscreen canvas to sample pixels
      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext("2d")!;

      const img = new window.Image();
      img.onload = () => {
        // Center the symbol in the canvas
        const scale = Math.min(
          (canvas.width * 0.6) / img.naturalWidth,
          (canvas.height * 0.6) / img.naturalHeight
        );
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        const ox = (canvas.width - w) / 2;
        const oy = (canvas.height - h) / 2;

        offCtx.drawImage(img, ox, oy, w, h);
        const imageData = offCtx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const pixels = imageData.data;

        const particles: Particle[] = [];
        const step = 4; // sample every 4th pixel for performance

        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            const i = (y * canvas.width + x) * 4;
            const a = pixels[i + 3];
            if (a > 30) {
              particles.push({
                homeX: x,
                homeY: y,
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                size: 1.5 + Math.random() * 1.5,
                alpha: 0.6 + Math.random() * 0.4,
              });
            }
          }
        }

        particlesRef.current = particles;
      };
      img.src = "/assets/symbol.svg";
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    initParticles(canvas);

    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      timerRef.current += dt;

      const cycleTime = timerRef.current % TOTAL_CYCLE;

      // Determine phase: 0=scattering, 1=holding scattered, 2=gathering, 3=holding gathered
      let t = 0;
      if (cycleTime < SCATTER_DURATION) {
        phaseRef.current = 0;
        t = cycleTime / SCATTER_DURATION;
      } else if (cycleTime < SCATTER_DURATION + HOLD_SCATTERED) {
        phaseRef.current = 1;
        t = 1;
      } else if (
        cycleTime <
        SCATTER_DURATION + HOLD_SCATTERED + GATHER_DURATION
      ) {
        phaseRef.current = 2;
        t =
          (cycleTime - SCATTER_DURATION - HOLD_SCATTERED) / GATHER_DURATION;
      } else {
        phaseRef.current = 3;
        t = 0;
      }

      // Easing
      const ease = (v: number) => v * v * (3 - 2 * v); // smoothstep

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const phase = phaseRef.current;

        if (phase === 0) {
          // Scattering: move away from home
          const angle =
            Math.atan2(p.homeY - height / 2, p.homeX - width / 2) +
            (Math.random() - 0.5) * 0.1;
          const dist = 80 + Math.random() * 120;
          const targetX = p.homeX + Math.cos(angle) * dist * ease(t);
          const targetY = p.homeY + Math.sin(angle) * dist * ease(t);
          p.x += (targetX - p.x) * 0.08;
          p.y += (targetY - p.y) * 0.08;
        } else if (phase === 1) {
          // Hold scattered: gentle drift
          p.x += Math.sin(now * 0.001 + i) * 0.15;
          p.y += Math.cos(now * 0.001 + i * 0.7) * 0.15;
        } else if (phase === 2) {
          // Gathering: return home
          const progress = ease(t);
          p.x += (p.homeX - p.x) * (0.02 + progress * 0.1);
          p.y += (p.homeY - p.y) * (0.02 + progress * 0.1);
        } else {
          // Hold gathered: very subtle pulse
          p.x += (p.homeX - p.x) * 0.15;
          p.y += (p.homeY - p.y) * 0.15;
        }

        // Draw particle
        const distFromHome = Math.hypot(p.x - p.homeX, p.y - p.homeY);
        const alphaMultiplier = phase === 1 ? 0.5 : phase === 0 ? 1 - ease(t) * 0.5 : phase === 2 ? 0.5 + ease(t) * 0.5 : 1;

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
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [width, height, initParticles, SCATTER_DURATION, HOLD_SCATTERED, GATHER_DURATION, HOLD_GATHERED, TOTAL_CYCLE]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
