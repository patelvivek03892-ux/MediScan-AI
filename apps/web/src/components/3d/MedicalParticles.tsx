'use client';

import React, { useEffect, useRef } from 'react';

export const MedicalParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number;
      y: number;
      radius: number;
      type: 'rbc' | 'wbc' | 'glow';
      vx: number;
      vy: number;
      alpha: number;
      tilt: number;
      tiltSpeed: number;
    }

    const particles: Particle[] = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      const typeRand = Math.random();
      const type: 'rbc' | 'wbc' | 'glow' =
        typeRand < 0.4 ? 'rbc' : typeRand < 0.6 ? 'wbc' : 'glow';

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: type === 'rbc' ? 8 + Math.random() * 8 : type === 'wbc' ? 10 + Math.random() * 6 : 2 + Math.random() * 3,
        type,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.4,
        alpha: 0.15 + Math.random() * 0.3,
        tilt: Math.random() * Math.PI,
        tiltSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.tilt += p.tiltSpeed;

        if (p.y < -30) p.y = canvas.height + 30;
        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tilt);

        if (p.type === 'rbc') {
          // Biconcave disc representation of Red Blood Cell
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 1.3, p.radius * 0.7, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha * 0.6})`;
          ctx.strokeStyle = `rgba(220, 38, 38, ${p.alpha * 0.8})`;
          ctx.lineWidth = 1.5;
          ctx.fill();
          ctx.stroke();

          // Indentation dimple
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 0.5, p.radius * 0.25, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(185, 28, 28, ${p.alpha * 0.7})`;
          ctx.fill();
        } else if (p.type === 'wbc') {
          // White blood cell with spherical granulocyte texture
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224, 231, 255, ${p.alpha * 0.45})`;
          ctx.strokeStyle = `rgba(147, 197, 253, ${p.alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();

          // Multilobed nucleus representation
          ctx.beginPath();
          ctx.arc(p.radius * 0.25, -p.radius * 0.25, p.radius * 0.35, 0, Math.PI * 2);
          ctx.arc(-p.radius * 0.25, p.radius * 0.2, p.radius * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha * 0.5})`;
          ctx.fill();
        } else {
          // Micro glow molecule
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
};
