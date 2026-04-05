"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  // Where this particle sits when forming the hand shape
  homeX: number;
  homeY: number;
  // Current position
  x: number;
  y: number;
  // Pre-computed scatter trajectory
  angle: number;
  dist: number;
  // Unique offset for organic variation
  swirl: number;
  size: number;
}

export default function ParticleSymbol({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const timerRef = useRef(0);

  // Phase durations (seconds)
  const HOLD_FORMED = 5.0; // particles sit as the hand shape
  const SCATTER = 3.5; // particles break apart outward
  const HOLD_SCATTERED = 3.0; // particles swirl freely
  const REFORM = 3.5; // particles spiral back into hand shape
  const TOTAL = HOLD_FORMED + SCATTER + HOLD_SCATTERED + REFORM;

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const logicalW = canvas.clientWidth;
    const logicalH = canvas.clientHeight;

    sizeRef.current = { w: logicalW, h: logicalH };
    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;

    // Rasterize the SVG to an offscreen canvas so we can sample pixel positions
    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext("2d")!;

    const img = new window.Image();
    img.onload = () => {
      // Draw symbol centered, roughly 65% of canvas height
      const symbolH = logicalH * dpr * 0.65;
      const symbolW = (img.naturalWidth / img.naturalHeight) * symbolH;
      const ox = (canvas.width - symbolW) / 2;
      const oy = (canvas.height - symbolH) / 2;

      offCtx.drawImage(img, ox, oy, symbolW, symbolH);
      const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const particles: Particle[] = [];
      // Dense sampling — smaller step = more particles = more solid-looking shape
      const step = Math.max(
        2,
        Math.round(Math.sqrt((canvas.width * canvas.height) / 8000))
      );

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const i = (y * canvas.width + x) * 4;
          if (pixels[i + 3] > 30) {
            const baseAngle = Math.atan2(y - cy, x - cx);
            particles.push({
              homeX: x / dpr,
              homeY: y / dpr,
              x: x / dpr,
              y: y / dpr,
              angle: baseAngle + (Math.random() - 0.5) * 1.6,
              dist: 130 + Math.random() * 320,
              swirl: Math.random() * Math.PI * 2,
              size: 1.2 + Math.random() * 1.4,
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

    const onResize = () => initParticles(canvas);
    window.addEventListener("resize", onResize);

    const ctx = canvas.getContext("2d")!;
    let lastTime = performance.now();

    const ease = (v: number) => v * v * (3 - 2 * v); // smoothstep

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      timerRef.current += dt;

      const { w, h } = sizeRef.current;
      const dpr = window.devicePixelRatio || 1;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cycleTime = timerRef.current % TOTAL;
      const nowSec = now / 1000;
      const particles = particlesRef.current;

      // Determine phase and normalized progress (0 → 1)
      let phase: "formed" | "scatter" | "scattered" | "reform";
      let t: number;

      if (cycleTime < HOLD_FORMED) {
        phase = "formed";
        t = cycleTime / HOLD_FORMED;
      } else if (cycleTime < HOLD_FORMED + SCATTER) {
        phase = "scatter";
        t = (cycleTime - HOLD_FORMED) / SCATTER;
      } else if (cycleTime < HOLD_FORMED + SCATTER + HOLD_SCATTERED) {
        phase = "scattered";
        t = (cycleTime - HOLD_FORMED - SCATTER) / HOLD_SCATTERED;
      } else {
        phase = "reform";
        t = (cycleTime - HOLD_FORMED - SCATTER - HOLD_SCATTERED) / REFORM;
      }

      const eased = ease(t);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (phase === "formed") {
          // Particles hold the hand shape with a very subtle shimmer
          const shimmer = Math.sin(nowSec * 2.0 + p.swirl) * 0.4;
          p.x += (p.homeX - p.x) * 0.2 + shimmer * 0.05;
          p.y += (p.homeY - p.y) * 0.2 + shimmer * 0.04;
        } else if (phase === "scatter") {
          // Break apart: each particle flies outward along its unique angle with swirl
          const progress = eased;
          const swirlAngle =
            p.angle + Math.sin(nowSec * 0.8 + p.swirl) * 0.7 * progress;
          const targetX = p.homeX + Math.cos(swirlAngle) * p.dist * progress;
          const targetY = p.homeY + Math.sin(swirlAngle) * p.dist * progress;
          p.x += (targetX - p.x) * 0.07;
          p.y += (targetY - p.y) * 0.07;
        } else if (phase === "scattered") {
          // Free swirl: particles drift organically
          const swirlX =
            Math.sin(nowSec * 0.5 + p.swirl) * 1.8 +
            Math.sin(nowSec * 0.2 + i * 0.005) * 1.0;
          const swirlY =
            Math.cos(nowSec * 0.4 + p.swirl * 1.3) * 1.8 +
            Math.cos(nowSec * 0.15 + i * 0.005) * 1.0;
          p.x += swirlX * 0.3;
          p.y += swirlY * 0.3;
        } else {
          // Reform: spiral back to home positions
          const progress = eased;
          const remaining = 1 - progress;
          const spiralAngle =
            Math.sin(nowSec * 1.2 + p.swirl) * 0.5 * remaining;
          const targetX = p.homeX + Math.cos(spiralAngle) * 10 * remaining;
          const targetY = p.homeY + Math.sin(spiralAngle) * 10 * remaining;
          const speed = 0.03 + progress * 0.15;
          p.x += (targetX - p.x) * speed;
          p.y += (targetY - p.y) * speed;
        }

        // Particle alpha: strong when formed, still clearly visible when scattered
        let alpha: number;
        if (phase === "formed") {
          alpha = 0.95 + Math.sin(nowSec * 1.5 + p.swirl) * 0.05;
        } else if (phase === "scatter") {
          alpha = 0.95 - eased * 0.15;
        } else if (phase === "scattered") {
          alpha = 0.8 + Math.sin(nowSec * 0.8 + p.swirl) * 0.1;
        } else {
          alpha = 0.8 + eased * 0.15 + Math.sin(nowSec * 1.5 + p.swirl) * 0.05;
        }

        ctx.globalAlpha = alpha;
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
  }, [
    initParticles,
    HOLD_FORMED,
    SCATTER,
    HOLD_SCATTERED,
    REFORM,
    TOTAL,
  ]);

  return (
    <canvas ref={canvasRef} className={className} aria-hidden="true" />
  );
}
