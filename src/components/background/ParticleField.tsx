"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  tw: number;
}

interface Shooter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 160;
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      tw: Math.random() * Math.PI * 2,
    }));

    let shooters: Shooter[] = [];
    let lastShooter = 0;

    let mouseX = width / 2;
    let mouseY = height / 2;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    let t = 0;

    function spawnShooter() {
      const startX = Math.random() * width * 0.6 + width * 0.2;
      shooters.push({
        x: startX,
        y: -10,
        vx: (Math.random() - 0.3) * 6,
        vy: Math.random() * 4 + 6,
        life: 0,
        maxLife: 60 + Math.random() * 30,
      });
    }

    function frame() {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      // parallax stars
      for (const s of stars) {
        s.tw += 0.02;
        const parallax = (s.z - 0.5) * 30;
        const dx = (mouseX / width - 0.5) * parallax;
        const dy = (mouseY / height - 0.5) * parallax;
        const alpha = 0.35 + Math.sin(s.tw) * 0.35;
        ctx.beginPath();
        ctx.arc(s.x + dx, s.y + dy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 210, 255, ${Math.max(0.1, alpha)})`;
        ctx.fill();
      }

      if (t - lastShooter > 140 && Math.random() < 0.05) {
        spawnShooter();
        lastShooter = t;
      }

      shooters.forEach((sh) => {
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life += 1;
        const alpha = 1 - sh.life / sh.maxLife;
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 6, sh.y - sh.vy * 6);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 6, sh.y - sh.vy * 6);
        ctx.stroke();
      });
      shooters = shooters.filter((sh) => sh.life < sh.maxLife && sh.y < height + 20);

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden
    />
  );
}
