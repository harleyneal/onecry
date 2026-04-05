"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  angle: number;
  dist: number;
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
  const svgImgRef = useRef<HTMLImageElement | null>(null);
  const symbolRectRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const timerRef = useRef(0);

  // Cycle timing
  const HOLD_SOLID = 4.0;
  const DISSOLVE = 3.0;
  const HOLD_SCATTERED = 3.0;
  const REFORM = 3.0;
  const TOTAL = HOLD_SOLID + DISSOLVE + HOLD_SCATTERED + REFORM;

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
      svgImgRef.current = img;

      // Draw symbol centered at ~50% of canvas height
      const symbolH = logicalH * dpr * 0.50;
      const symbolW = (img.naturalWidth / img.naturalHeight) * symbolH;
      const ox = (canvas.width - symbolW) / 2;
      const oy = (canvas.height - symbolH) / 2;

      symbolRectRef.current = {
        x: ox / dpr,
        y: oy / dpr,
        w: symbolW / dpr,
        h: symbolH / dpr,
      };

      offCtx.drawImage(img, ox, oy, symbolW, symbolH);
      const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const particles: Particle[] = [];
      // Denser sampling for a more solid look
      const step = Math.max(2, Math.round(Math.sqrt((canvas.width * canvas.height) / 6000)));

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
              angle: baseAngle + (Math.random() - 0.5) * 1.4,
              dist: 120 + Math.random() * 250,
              swirl: Math.random() * Math.PI * 2,
              size: 1.5 + Math.random() * 1.5,
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

    const ease = (v: number) => v * v * (3 - 2 * v);

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
      const svgImg = svgImgRef.current;
      const rect = symbolRectRef.current;

      // Determine phase and progress
      let phase: "solid" | "dissolve" | "scattered" | "reform";
      let t: number;

      if (cycleTime < HOLD_SOLID) {
        phase = "solid";
        t = cycleTime / HOLD_SOLID;
      } else if (cycleTime < HOLD_SOLID + DISSOLVE) {
        phase = "dissolve";
        t = (cycleTime - HOLD_SOLID) / DISSOLVE;
      } else if (cycleTime < HOLD_SOLID + DISSOLVE + HOLD_SCATTERED) {
        phase = "scattered";
        t = (cycleTime - HOLD_SOLID - DISSOLVE) / HOLD_SCATTERED;
      } else {
        phase = "reform";
        t = (cycleTime - HOLD_SOLID - DISSOLVE - HOLD_SCATTERED) / REFORM;
      }

      const eased = ease(t);

      // --- Draw the solid SVG image (fades out during dissolve, fades in during reform) ---
      if (svgImg && rect.w > 0) {
        let solidAlpha = 0;
        if (phase === "solid") {
          solidAlpha = 1;
        } else if (phase === "dissolve") {
          solidAlpha = 1 - eased;
        } else if (phase === "reform") {
          solidAlpha = eased;
        } else {
          solidAlpha = 0;
        }

        if (solidAlpha > 0.01) {
          ctx.globalAlpha = solidAlpha;
          ctx.drawImage(svgImg, rect.x, rect.y, rect.w, rect.h);
        }
      }

      // --- Draw particles (fade in during dissolve, fade out during reform) ---
      let particleBaseAlpha = 0;
      if (phase === "solid") {
        particleBaseAlpha = 0;
      } else if (phase === "dissolve") {
        particleBaseAlpha = eased;
      } else if (phase === "scattered") {
        particleBaseAlpha = 1;
      } else {
        particleBaseAlpha = 1 - eased;
      }

      if (particleBaseAlpha > 0.01) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (phase === "solid") {
            // Snap to home
            p.x = p.homeX;
            p.y = p.homeY;
          } else if (phase === "dissolve") {
            // Break apart outward with swirl
            const swirlAngle =
              p.angle + Math.sin(nowSec * 0.7 + p.swirl) * 0.6 * eased;
            const targetX = p.homeX + Math.cos(swirlAngle) * p.dist * eased;
            const targetY = p.homeY + Math.sin(swirlAngle) * p.dist * eased;
            p.x += (targetX - p.x) * 0.08;
            p.y += (targetY - p.y) * 0.08;
          } else if (phase === "scattered") {
            // Organic swirling drift
            const swirlX =
              Math.sin(nowSec * 0.5 + p.swirl) * 1.5 +
              Math.sin(nowSec * 0.25 + i * 0.007) * 1.0;
            const swirlY =
              Math.cos(nowSec * 0.4 + p.swirl * 1.3) * 1.5 +
              Math.cos(nowSec * 0.2 + i * 0.007) * 1.0;
            p.x += swirlX * 0.35;
            p.y += swirlY * 0.35;
          } else {
            // Reform: spiral back home
            const remaining = 1 - eased;
            const spiralAngle =
              Math.sin(nowSec * 1.0 + p.swirl) * 0.4 * remaining;
            const targetX = p.homeX + Math.cos(spiralAngle) * 8 * remaining;
            const targetY = p.homeY + Math.sin(spiralAngle) * 8 * remaining;
            const speed = 0.04 + eased * 0.14;
            p.x += (targetX - p.x) * speed;
            p.y += (targetY - p.y) * speed;
          }

          ctx.globalAlpha = particleBaseAlpha * (0.7 + Math.sin(nowSec + p.swirl) * 0.3);
          ctx.fillStyle = "rgb(116, 205, 216)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", onResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles, HOLD_SOLID, DISSOLVE, HOLD_SCATTERED, REFORM, TOTAL]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
