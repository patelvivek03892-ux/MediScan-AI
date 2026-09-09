'use client';

import React, { useEffect, useRef } from 'react';

interface EcgLineProps {
  color?: string;
  height?: number;
  speed?: number;
  bpm?: number;
  className?: string;
}

export const EcgLine: React.FC<EcgLineProps> = ({
  color = '#38bdf8',
  height = 70,
  speed = 2.5,
  bpm = 72,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    // Waveform calculation representing clinical P-Q-R-S-T complexes
    const getWaveformY = (x: number, midY: number): number => {
      const cycleLength = 220;
      const pos = (x + offset) % cycleLength;

      // Baseline
      if (pos < 40) return midY;
      // P wave (atrial depolarization)
      if (pos >= 40 && pos < 60) {
        return midY - Math.sin(((pos - 40) / 20) * Math.PI) * (height * 0.12);
      }
      // PR segment
      if (pos >= 60 && pos < 75) return midY;
      // Q wave (septal depolarization)
      if (pos >= 75 && pos < 82) {
        return midY + (pos - 75) * (height * 0.08);
      }
      // R peak (ventricular depolarization)
      if (pos >= 82 && pos < 95) {
        if (pos < 88) {
          return midY + (height * 0.56) - ((pos - 82) / 6) * (height * 0.95);
        } else {
          return midY - (height * 0.39) + ((pos - 88) / 7) * (height * 0.85);
        }
      }
      // S wave
      if (pos >= 95 && pos < 105) {
        return midY + Math.sin(((pos - 95) / 10) * Math.PI) * (height * 0.22);
      }
      // ST segment
      if (pos >= 105 && pos < 130) return midY;
      // T wave (ventricular repolarization)
      if (pos >= 130 && pos < 165) {
        return midY - Math.sin(((pos - 130) / 35) * Math.PI) * (height * 0.18);
      }
      // Isoelectric line
      return midY;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const midY = canvas.height / 2;

      offset += speed;

      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;

      for (let x = 0; x < canvas.width; x += 2) {
        const y = getWaveformY(x, midY);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw leading pulse bead
      const headX = (canvas.width * 0.85);
      const headY = getWaveformY(headX, midY);

      ctx.beginPath();
      ctx.arc(headX, headY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [color, height, speed, bpm]);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
};
