"use client";

import { useEffect, useRef } from "react";

type Seed = { angle: number; radius: number; phase: number; size: number };

export function FinaleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let time = 0;
    const seeds: Seed[] = Array.from({ length: window.innerWidth < 600 ? 30 : 64 }, (_, index) => ({
      angle: ((index * 137.508) % 360) * Math.PI / 180,
      radius: 70 + ((index * 47) % 360),
      phase: index * 0.71,
      size: 0.8 + (index % 4) * 0.42,
    }));

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, width < 600 ? 1.15 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) paint(0, true);
    };

    const paint = (delta: number, still = false) => {
      context.clearRect(0, 0, width, height);
      const progress = Number(canvas.closest(".scene--finale")?.getAttribute("data-final-progress") ?? "0");
      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const travel = width * 0.48 * (1 - Math.min(1, Math.max(0, progress)));
      for (const seed of seeds) {
        if (!still) seed.phase += delta * 0.0012;
        const radius = Math.max(4, seed.radius * (0.24 + 0.76 * (travel / (width * 0.48))) + Math.sin(seed.phase) * 8);
        const x = centerX + Math.cos(seed.angle + seed.phase * 0.24) * radius;
        const y = centerY + Math.sin(seed.angle + seed.phase * 0.24) * radius * 0.72;
        const color = seed.phase % 2 > 1 ? "#ffbf59" : "#f7d58e";
        context.fillStyle = color;
        context.globalAlpha = 0.25 + ((Math.sin(seed.phase * 2) + 1) / 2) * 0.65;
        context.shadowColor = color;
        context.shadowBlur = still ? 2 : 9;
        context.beginPath();
        context.arc(x, y, seed.size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      context.shadowBlur = 0;
    };

    const tick = (timestamp: number) => {
      if (!visible || reducedMotion) return;
      const delta = Math.min(timestamp - (time || timestamp), 34);
      time = timestamp;
      paint(delta);
      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && reducedMotion) paint(0, true);
      if (visible && !reducedMotion && !frame) frame = window.requestAnimationFrame(tick);
      if (!visible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        time = 0;
      }
    }, { threshold: 0.04 });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    resize();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas className="finale-particles" ref={canvasRef} aria-hidden="true" />;
}
