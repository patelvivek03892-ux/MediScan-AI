'use client';

import React, { useEffect, useRef } from 'react';

interface DnaHelix3DProps {
  interactive?: boolean;
  className?: string;
}

export const DnaHelix3D: React.FC<DnaHelix3DProps> = ({ interactive = true, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / canvas.width - 0.5) * 0.5;
      mouseY = ((e.clientY - rect.top) / canvas.height - 0.5) * 0.5;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const numNodes = 36;
    const helixRadius = Math.min(canvas.width, canvas.height) * 0.28;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const speed = 0.02 + mouseX * 0.05;
      angle += speed;

      const nodes: Array<{
        x1: number;
        y1: number;
        z1: number;
        x2: number;
        y2: number;
        z2: number;
        index: number;
      }> = [];

      for (let i = 0; i < numNodes; i++) {
        const t = (i / numNodes) * Math.PI * 4 + angle;
        const y = ((i - numNodes / 2) / numNodes) * (canvas.height * 0.75);

        // Strand 1 (Cyan/Teal)
        const x1 = Math.cos(t) * helixRadius;
        const z1 = Math.sin(t) * helixRadius;

        // Strand 2 (Indigo/Violet) 180 degrees offset
        const x2 = Math.cos(t + Math.PI) * helixRadius;
        const z2 = Math.sin(t + Math.PI) * helixRadius;

        nodes.push({ x1, y1: y, z1, x2, y2: y, z2, index: i });
      }

      // Sort by average depth for correct rendering order
      nodes.sort((a, b) => (a.z1 + a.z2) / 2 - (b.z1 + b.z2) / 2);

      nodes.forEach((node) => {
        // Perspective projection
        const scale1 = (node.z1 + 300) / 400;
        const scale2 = (node.z2 + 300) / 400;

        const pX1 = centerX + node.x1 * (1 + scale1 * 0.4);
        const pY1 = centerY + node.y1 * (1 + mouseY * 0.5);

        const pX2 = centerX + node.x2 * (1 + scale2 * 0.4);
        const pY2 = centerY + node.y2 * (1 + mouseY * 0.5);

        // Draw Base Pair Hydrogen Bond rung
        const gradient = ctx.createLinearGradient(pX1, pY1, pX2, pY2);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.55)'); // cyan
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.4)'); // violet
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0.55)'); // pink

        ctx.beginPath();
        ctx.moveTo(pX1, pY1);
        ctx.lineTo(pX2, pY2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(1, 2 * ((scale1 + scale2) / 2));
        ctx.stroke();

        // Strand 1 Node (Adenine / Thymine marker)
        const r1 = Math.max(2.5, 6 * scale1);
        ctx.beginPath();
        ctx.arc(pX1, pY1, r1, 0, Math.PI * 2);
        ctx.fillStyle = node.z1 > 0 ? '#38bdf8' : '#0284c7';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = node.z1 > 0 ? 12 : 2;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Strand 2 Node (Cytosine / Guanine marker)
        const r2 = Math.max(2.5, 6 * scale2);
        ctx.beginPath();
        ctx.arc(pX2, pY2, r2, 0, Math.PI * 2);
        ctx.fillStyle = node.z2 > 0 ? '#f43f5e' : '#be123c';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = node.z2 > 0 ? 12 : 2;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (interactive) window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive]);

  return (
    <div className={`relative w-full h-full min-h-[360px] pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
