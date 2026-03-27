"use client";

import { useEffect, useRef, useCallback } from "react";
import { noise2D } from "@/lib/noise";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleCanvasProps {
  isIdle: boolean;
  whisperTargets?: { x: number; y: number }[];
  className?: string;
}

const COLORS = [
  "200, 168, 136",
  "200, 106, 26",
  "74, 106, 66",
];

const PARTICLE_COUNT = 80;
const NOISE_SCALE = 0.003;
const MOUSE_RADIUS = 80;
const MOUSE_STRENGTH = 2;
const WHISPER_LERP = 0.02;

export function ParticleCanvas({
  isIdle,
  whisperTargets = [],
  className,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);
  const animRef = useRef<number>(undefined);
  const timeRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      targetX: 0,
      targetY: 0,
      size: Math.random() * 2 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.2 + 0.05,
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 200,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    resize();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      frameRef.current++;
      if (frameRef.current % 2 !== 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      timeRef.current += 0.01;

      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const hasWhisperTargets = isIdle && whisperTargets.length > 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;

        if (p.life > p.maxLife) {
          p.life = 0;
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.opacity = Math.random() * 0.2 + 0.05;
        }

        const n = noise2D(p.x * NOISE_SCALE + timeRef.current, p.y * NOISE_SCALE);
        const angle = n * Math.PI * 4;
        let vx = Math.cos(angle) * 0.5;
        let vy = Math.sin(angle) * 0.5;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
          vx += (dx / dist) * force;
          vy += (dy / dist) * force;
        }

        if (hasWhisperTargets && i < whisperTargets.length) {
          const target = whisperTargets[i];
          p.targetX = target.x;
          p.targetY = target.y;
          p.x += (p.targetX - p.x) * WHISPER_LERP;
          p.y += (p.targetY - p.y) * WHISPER_LERP;
        } else {
          p.x += vx;
          p.y += vy;
        }

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const lifeFade = Math.sin((p.life / p.maxLife) * Math.PI);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity * lifeFade})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isIdle, whisperTargets, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}
    />
  );
}
