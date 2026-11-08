"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; seedX: number; seedY: number; radius: number; alpha: number };

export function HeroTitleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = false;
    let points: Point[] = [];

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, width < 600 ? 1.1 : 1.35);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const viewportWidth = window.innerWidth;
      const fontSize = viewportWidth <= 560
        ? Math.min(94, Math.max(64, viewportWidth * 0.19))
        : viewportWidth <= 900
          ? Math.min(132, Math.max(72, viewportWidth * 0.16))
          : Math.min(168, Math.max(72, viewportWidth * 0.128));
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.ceil(width);
      offscreen.height = Math.ceil(height);
      const offscreenContext = offscreen.getContext("2d");
      if (!offscreenContext) return;
      offscreenContext.font = `500 ${fontSize}px Georgia, serif`;
      offscreenContext.textBaseline = "middle";
      const letters = Array.from("DIWALI");
      const letterGap = fontSize * 0.12;
      const widths = letters.map((letter) => offscreenContext.measureText(letter).width);
      const lineWidth = widths.reduce((total, item) => total + item, 0) + letterGap * (letters.length - 1);
      let cursor = (width - lineWidth) / 2;
      const centerY = height * 0.47;
      offscreenContext.fillStyle = "#fff7e6";
      letters.forEach((letter, index) => {
        offscreenContext.fillText(letter, cursor, centerY);
        cursor += widths[index] + letterGap;
      });

      const image = offscreenContext.getImageData(0, 0, offscreen.width, offscreen.height).data;
      const stride = width < 600 ? 8 : 7;
      const targets: Array<[number, number, number]> = [];
      for (let y = Math.floor(centerY - fontSize * 0.58); y < centerY + fontSize * 0.42; y += stride) {
        for (let x = Math.floor(width * 0.12); x < width * 0.88; x += stride) {
          const alpha = image[(Math.floor(y) * offscreen.width + Math.floor(x)) * 4 + 3];
          if (alpha > 150) targets.push([x, y, alpha / 255]);
        }
      }
      const maxPoints = width < 600 ? 420 : 760;
      points = targets.length <= maxPoints
        ? targets.map(([x, y, alpha], index) => ({ x, y, seedX: ((index * 67) % 100) / 100, seedY: ((index * 43) % 100) / 100, radius: 0.65 + (index % 4) * 0.27, alpha }))
        : targets.filter((_, index) => index % Math.ceil(targets.length / maxPoints) === 0).map(([x, y, alpha], index) => ({ x, y, seedX: ((index * 67) % 100) / 100, seedY: ((index * 43) % 100) / 100, radius: 0.65 + (index % 4) * 0.27, alpha }));
      if (reducedMotion) paint();
    };

    const paint = () => {
      context.clearRect(0, 0, width, height);
      const progress = Number(canvas.closest(".scene--hero")?.getAttribute("data-title-progress") ?? "0");
      const ease = progress * progress * (3 - 2 * progress);
      const dissolve = Math.max(0, 1 - Math.max(0, progress - 0.84) / 0.16);
      for (const point of points) {
        const startX = point.seedX * width;
        const startY = point.seedY * height;
        const x = startX + (point.x - startX) * ease;
        const y = startY + (point.y - startY) * ease;
        context.fillStyle = `rgba(255, ${194 + Math.round(point.alpha * 35)}, ${116 + Math.round(point.alpha * 82)}, ${point.alpha * dissolve})`;
        context.shadowColor = "#ffc361";
        context.shadowBlur = reducedMotion ? 0 : 5;
        context.beginPath();
        context.arc(x, y, point.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.shadowBlur = 0;
    };

    const tick = () => {
      if (!visible || reducedMotion) return;
      paint();
      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && reducedMotion) paint();
      if (visible && !reducedMotion && !frame) frame = window.requestAnimationFrame(tick);
      if (!visible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { threshold: 0.02 });
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

  return <canvas className="hero-title-particles" ref={canvasRef} aria-hidden="true" />;
}
