"use client";

import { useEffect, useRef } from "react";

type Rocket = { x: number; y: number; targetX: number; targetY: number; hue: number; speed: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; decay: number; hue: number; size: number };

const palette = [43, 272, 324, 18];

export function FireworksCanvas({ finale = false }: { finale?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let ticker = 0;
    let launchIndex = 0;
    let lastTime = 0;
    let visible = false;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, width < 600 ? 1.15 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) drawQuietSky();
    };

    const drawQuietSky = () => {
      context.clearRect(0, 0, width, height);
      [
        [0.24, 0.28, 35, 43],
        [0.76, 0.24, 43, 18],
        [0.68, 0.57, 27, 324],
      ].forEach(([x, y, radius, hue]) => {
        const centerX = x * width;
        const centerY = y * height;
        context.strokeStyle = `hsla(${hue}, 90%, 70%, .42)`;
        context.lineWidth = 1.4;
        context.beginPath();
        for (let ray = 0; ray < 12; ray += 1) {
          const angle = (ray / 12) * Math.PI * 2;
          context.moveTo(centerX + Math.cos(angle) * radius * 0.25, centerY + Math.sin(angle) * radius * 0.25);
          context.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        }
        context.stroke();
        const glow = context.createRadialGradient(centerX, centerY, 1, centerX, centerY, radius);
        glow.addColorStop(0, `hsla(${hue}, 100%, 74%, .28)`);
        glow.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
        context.fillStyle = glow;
        context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      });
    };

    const burst = (rocket: Rocket) => {
      const amount = width < 600 ? 36 : 58;
      for (let index = 0; index < amount; index += 1) {
        const angle = (index / amount) * Math.PI * 2;
        const speed = 0.8 + ((index * 17) % 13) / 10;
        sparks.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.008 + ((index * 11) % 8) / 1000,
          hue: rocket.hue + ((index % 5) - 2) * 3,
          size: 1 + (index % 3) * 0.45,
        });
      }
    };

    const launch = () => {
      const index = launchIndex++;
      const originX = width * (0.12 + ((index * 31) % 76) / 100);
      const targetX = width * (0.16 + ((index * 43) % 68) / 100);
      const targetY = height * (0.17 + ((index * 19) % 34) / 100);
      rockets.push({ x: originX, y: height + 8, targetX, targetY, hue: palette[index % palette.length], speed: 4 + (index % 3) * 0.45 });
    };

    const draw = (time: number) => {
      if (!visible || reducedMotion) return;
      const delta = Math.min((time - (lastTime || time)) / 16.67, 2.2);
      lastTime = time;
      ticker += delta;
      if (ticker > (finale ? 62 : 84)) {
        ticker = 0;
        launch();
      }

      context.globalCompositeOperation = "destination-out";
      context.fillStyle = "rgba(0, 0, 0, 0.22)";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (let index = rockets.length - 1; index >= 0; index -= 1) {
        const rocket = rockets[index];
        const dx = rocket.targetX - rocket.x;
        const dy = rocket.targetY - rocket.y;
        const distance = Math.hypot(dx, dy);
        context.strokeStyle = `hsla(${rocket.hue}, 100%, 75%, .8)`;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(rocket.x, rocket.y);
        context.lineTo(rocket.x - dx * 0.035, rocket.y + 8);
        context.stroke();
        if (distance < rocket.speed * delta + 4) {
          burst(rocket);
          rockets.splice(index, 1);
        } else {
          rocket.x += (dx / distance) * rocket.speed * delta;
          rocket.y += (dy / distance) * rocket.speed * delta;
        }
      }

      for (let index = sparks.length - 1; index >= 0; index -= 1) {
        const spark = sparks[index];
        spark.x += spark.vx * delta;
        spark.y += spark.vy * delta;
        spark.vy += 0.012 * delta;
        spark.vx *= 0.99;
        spark.vy *= 0.99;
        spark.life -= spark.decay * delta;
        if (spark.life <= 0) {
          sparks.splice(index, 1);
          continue;
        }
        context.fillStyle = `hsla(${spark.hue}, 100%, ${64 + spark.life * 22}%, ${spark.life})`;
        context.shadowColor = `hsla(${spark.hue}, 100%, 68%, ${spark.life})`;
        context.shadowBlur = 8;
        context.beginPath();
        context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        context.fill();
      }
      context.shadowBlur = 0;
      context.globalCompositeOperation = "source-over";
      frame = window.requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && reducedMotion) drawQuietSky();
      if (visible && !reducedMotion && !frame) frame = window.requestAnimationFrame(draw);
      if (!visible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
      }
    }, { threshold: 0.08 });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    resize();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [finale]);

  return <canvas className={`effects-canvas${finale ? " effects-canvas--finale" : ""}`} ref={canvasRef} aria-hidden="true" />;
}
