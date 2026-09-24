'use client';

import React, { useEffect, useRef } from 'react';

/**
 * AnimatedEnergyBackground
 *
 * A sophisticated field of thousands of tiny glowing particles forming flowing
 * curved energy structures (neural pathways, magnetic field lines, flowing ribbons).
 *
 * Visual Characteristics:
 * - 3-Tier Depth Architecture:
 *    * Background (65%): tiny (0.8-1.4px), low opacity, slow ambient drift
 *    * Midground (30%): medium (1.5-2.4px), flowing curved ribbons & neural streams
 *    * Foreground (5%): occasional brighter glowing nodes (2.6-3.8px) with soft cyan/white halos
 * - Color Hierarchy: 95% subtle, 4% medium glowing, 1% bright particle clusters
 * - Colors: Cyan (#22d3ee), Teal (#14b8a6), Electric Blue (#38bdf8), Soft White (rgba(255,255,255,0.75))
 * - Main Movement: Continuous organic upward flow (BOTTOM → TOP) along curved sinusoidal flow ribbons
 * - Content Protection: Lateral emphasis; center zone automatically attenuated to preserve 100% text readability
 * - 60 FPS Performance: Batched Canvas 2D rendering, DPR clamp, tab-visibility auto-pause, prefers-reduced-motion
 */

interface RibbonSpine {
  baseXRatio: number;
  amp1: number;
  freq1: number;
  speed1: number;
  amp2: number;
  freq2: number;
  speed2: number;
  phase: number;
  width: number;
}

interface Particle {
  x: number;
  y: number;
  ribbonIndex: number; // -1 for ambient, 0-4 for specific energy ribbons
  offset: number;      // lateral dispersion offset from ribbon center
  speed: number;       // upward speed (px per frame delta)
  size: number;
  layer: 0 | 1 | 2;    // 0 = background, 1 = midground stream, 2 = foreground cluster
  baseAlpha: number;
  currentAlpha: number;
  colorType: 'cyan' | 'teal' | 'blue' | 'brightCyan' | 'softWhite';
  pulseFreq: number;
  phase: number;
  glowRadius: number;
  isBrightNode: boolean;
}

interface AnimatedEnergyBackgroundProps {
  /** Optional custom total particle count override */
  particleCount?: number;
  /** Speed multiplier (default: 1.0) */
  speedMultiplier?: number;
  /** Custom CSS classes */
  className?: string;
}

export const AnimatedEnergyBackground: React.FC<AnimatedEnergyBackgroundProps> = ({
  particleCount: customParticleCount,
  speedMultiplier = 1.0,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isRunning = true;
    let lastTime = performance.now();

    // Accessibility: Query prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = mediaQuery.matches;

    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        drawStaticSnapshot();
      }
    };
    mediaQuery.addEventListener?.('change', handleMotionPreferenceChange);

    // Responsive dimensions & DPR (clamped to max 2 for 60 FPS performance)
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // 5 Large-Scale Curved Energy Ribbons (Lateral emphasis, neural field curves)
    const ribbons: RibbonSpine[] = [
      {
        baseXRatio: 0.12, // Far Left sweeping stream
        amp1: 45,
        freq1: 0.0022,
        speed1: 0.00045,
        amp2: 20,
        freq2: 0.0055,
        speed2: 0.0007,
        phase: 0.4,
        width: 55,
      },
      {
        baseXRatio: 0.28, // Left-Center neural stream
        amp1: 35,
        freq1: 0.0019,
        speed1: 0.00035,
        amp2: 18,
        freq2: 0.0048,
        speed2: 0.0005,
        phase: 1.8,
        width: 48,
      },
      {
        baseXRatio: 0.50, // Center subtle ambient ribbon (kept gentle and sparse)
        amp1: 25,
        freq1: 0.0015,
        speed1: 0.00025,
        amp2: 12,
        freq2: 0.0035,
        speed2: 0.0004,
        phase: 3.14,
        width: 60,
      },
      {
        baseXRatio: 0.72, // Right-Center neural stream
        amp1: 38,
        freq1: 0.0020,
        speed1: 0.00040,
        amp2: 22,
        freq2: 0.0050,
        speed2: 0.0006,
        phase: 4.5,
        width: 50,
      },
      {
        baseXRatio: 0.88, // Far Right sweeping stream
        amp1: 50,
        freq1: 0.0024,
        speed1: 0.00050,
        amp2: 25,
        freq2: 0.0060,
        speed2: 0.00075,
        phase: 5.7,
        width: 60,
      },
    ];

    // Evaluates the continuous mathematical spine of a ribbon at height y and time t
    const getRibbonSpineX = (r: RibbonSpine, y: number, t: number): number => {
      const baseX = r.baseXRatio * width;
      const wave1 = Math.sin(y * r.freq1 + t * r.speed1 + r.phase) * r.amp1;
      const wave2 = Math.cos(y * r.freq2 - t * r.speed2 + r.phase * 1.5) * r.amp2;
      return baseX + wave1 + wave2;
    };

    let particles: Particle[] = [];

    // Factory: Spawn or reset a particle with 3-tier depth and clinical palette
    const createParticle = (initialSpread = false): Particle => {
      // 3-Tier Layer Roll
      const layerRoll = Math.random();
      let layer: 0 | 1 | 2;
      let size: number;
      let baseAlpha: number;
      let speed: number;
      let isBrightNode = false;

      if (layerRoll < 0.65) {
        // Layer 0: Background (65% of particles, tiny, low opacity, slow)
        layer = 0;
        size = 0.8 + Math.random() * 0.7; // 0.8 - 1.5px
        baseAlpha = 0.08 + Math.random() * 0.16; // 0.08 - 0.24
        speed = (0.28 + Math.random() * 0.35) * speedMultiplier;
      } else if (layerRoll < 0.95) {
        // Layer 1: Midground (30% of particles, flowing curved ribbons)
        layer = 1;
        size = 1.5 + Math.random() * 0.9; // 1.5 - 2.4px
        baseAlpha = 0.24 + Math.random() * 0.28; // 0.24 - 0.52
        speed = (0.45 + Math.random() * 0.55) * speedMultiplier;
      } else {
        // Layer 2: Foreground (5% of particles, of which ~1% are super bright focal nodes)
        layer = 2;
        const brightRoll = Math.random();
        if (brightRoll < 0.25) {
          // Top 1% bright particle cluster node
          isBrightNode = true;
          size = 2.8 + Math.random() * 1.0; // 2.8 - 3.8px
          baseAlpha = 0.70 + Math.random() * 0.25; // 0.70 - 0.95
          speed = (0.60 + Math.random() * 0.45) * speedMultiplier;
        } else {
          // 4% medium glowing particle
          size = 2.4 + Math.random() * 0.6; // 2.4 - 3.0px
          baseAlpha = 0.45 + Math.random() * 0.25; // 0.45 - 0.70
          speed = (0.50 + Math.random() * 0.45) * speedMultiplier;
        }
      }

      // Initial Y: distribute across screen on startup; below bottom on continuous loop
      const y = initialSpread ? Math.random() * (height + 40) : height + 10 + Math.random() * 60;

      // Assign Ribbon: 75% assigned to one of the 5 curved energy ribbons; 25% ambient
      const ribbonRoll = Math.random();
      let ribbonIndex = -1;
      let offset = 0;
      let baseX = 0;

      if (ribbonRoll < 0.75) {
        // Lateral weighting: favor ribbons 0, 1, 3, 4 (avoid clustering bright nodes in center ribbon 2)
        if (isBrightNode) {
          const lateralRibbons = [0, 1, 3, 4];
          ribbonIndex = lateralRibbons[Math.floor(Math.random() * lateralRibbons.length)];
        } else {
          ribbonIndex = Math.floor(Math.random() * ribbons.length);
        }
        const r = ribbons[ribbonIndex];
        // Gaussian-like concentration towards ribbon spine
        const spread = (Math.random() - 0.5 + (Math.random() - 0.5)) * r.width;
        offset = spread;
        baseX = getRibbonSpineX(r, y, performance.now()) + offset;
      } else {
        // Ambient particle
        ribbonIndex = -1;
        offset = 0;
        baseX = Math.random() * width;
      }

      // Color Palette Assignment strictly adhering to clinical MediScan-AI aesthetic
      let colorType: Particle['colorType'] = 'cyan';
      if (isBrightNode) {
        colorType = Math.random() < 0.4 ? 'softWhite' : 'brightCyan';
      } else {
        const colorRoll = Math.random();
        if (colorRoll < 0.45) colorType = 'cyan';        // #22D3EE
        else if (colorRoll < 0.75) colorType = 'teal';    // #14B8A6
        else if (colorRoll < 0.95) colorType = 'blue';    // #38BDF8
        else colorType = 'softWhite';                     // Subtle accent
      }

      const glowRadius = isBrightNode ? (size > 3.0 ? 12 : 8) : (layer === 2 ? 5 : 0);

      return {
        x: baseX,
        y,
        ribbonIndex,
        offset,
        speed,
        size,
        layer,
        baseAlpha,
        currentAlpha: baseAlpha,
        colorType,
        pulseFreq: 0.0012 + Math.random() * 0.0025,
        phase: Math.random() * Math.PI * 2,
        glowRadius,
        isBrightNode,
      };
    };

    const initSimulation = () => {
      // Adaptive density: Desktop ~850-1100, Tablet ~450-600, Mobile ~200-300
      let defaultCount = 950;
      if (width < 640) {
        defaultCount = 260;
      } else if (width < 1024) {
        defaultCount = 520;
      }
      const total = customParticleCount ?? defaultCount;
      particles = Array.from({ length: total }, () => createParticle(true));
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initSimulation();
      if (prefersReducedMotion) {
        drawStaticSnapshot();
      }
    };

    // Color string resolver for high-speed canvas drawing
    const resolveRgba = (type: Particle['colorType'], alpha: number): string => {
      switch (type) {
        case 'cyan':
          return `rgba(34, 211, 238, ${alpha})`; // #22D3EE
        case 'teal':
          return `rgba(20, 184, 166, ${alpha})`; // #14B8A6
        case 'blue':
          return `rgba(56, 189, 248, ${alpha})`; // #38BDF8
        case 'brightCyan':
          return `rgba(0, 240, 255, ${alpha})`; // #00F0FF Accent
        case 'softWhite':
          return `rgba(255, 255, 255, ${alpha * 0.85})`;
        default:
          return `rgba(34, 211, 238, ${alpha})`;
      }
    };

    // Static snapshot for users requesting reduced motion
    const drawStaticSnapshot = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle ribbon guide paths
      for (const r of ribbons) {
        ctx.beginPath();
        const steps = 18;
        const stepY = height / steps;
        for (let i = 0; i <= steps; i++) {
          const curY = i * stepY;
          const curX = getRibbonSpineX(r, curY, 0);
          if (i === 0) ctx.moveTo(curX, curY);
          else ctx.lineTo(curX, curY);
        }
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.035)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw particles in batches
      for (const p of particles) {
        const isCenter = p.x > width * 0.28 && p.x < width * 0.72 && p.y < height * 0.8;
        const renderAlpha = isCenter ? p.baseAlpha * 0.35 : p.baseAlpha * 0.75;

        ctx.fillStyle = resolveRgba(p.colorType, renderAlpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Main 60 FPS animation loop
    const animate = (now: number) => {
      if (!isRunning) return;
      const delta = Math.min((now - lastTime) / 16.67, 2.0); // Normalized time delta clamped to 2.0
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // 1. Render delicate curved energy ribbon filaments (neural pathways / magnetic lines)
      for (let rIdx = 0; rIdx < ribbons.length; rIdx++) {
        const r = ribbons[rIdx];
        ctx.beginPath();
        const steps = 14;
        const stepY = (height + 40) / steps;

        for (let s = 0; s <= steps; s++) {
          const sy = height + 20 - s * stepY;
          const sx = getRibbonSpineX(r, sy, now);
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }

        // Fading gradient from bottom to top
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, 'rgba(20, 184, 166, 0)');
        grad.addColorStop(0.3, 'rgba(34, 211, 238, 0.045)');
        grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.045)');
        grad.addColorStop(1, 'rgba(34, 211, 238, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // 2. High-Performance Batched Particle Updates & Drawing
      // To guarantee 60 FPS across thousands of particles, we batch regular particles
      // and only activate shadow glow for the 1% bright cluster nodes.

      const brightNodes: Particle[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Continuous Upward Flow (BOTTOM → TOP)
        p.y -= p.speed * delta;

        // Flow along curved ribbon spine OR harmonic curl field
        if (p.ribbonIndex >= 0) {
          const r = ribbons[p.ribbonIndex];
          const spineX = getRibbonSpineX(r, p.y, now);
          // Subtle horizontal harmonic twist within the ribbon band
          const twist = Math.sin(p.y * 0.004 + now * 0.0008 + p.phase) * 6;
          p.x = spineX + p.offset + twist;
        } else {
          // Ambient gentle sinusoidal drift
          p.x += Math.sin(p.y * 0.0025 + now * 0.0006 + p.phase) * 0.45 * delta;
        }

        // Pulse alpha gently
        const pulse = Math.sin(now * p.pulseFreq + p.phase) * 0.12;
        p.currentAlpha = Math.max(0.04, Math.min(0.95, p.baseAlpha + pulse));

        // Content Protection: Attenuate particles in center zone behind hero text and cards
        const isCenter = p.x > width * 0.28 && p.x < width * 0.72 && p.y < height * 0.78;
        if (isCenter) {
          p.currentAlpha *= 0.35;
        }

        // Loop Reset: Smoothly recycle particles when they float past the top
        if (p.y < -15) {
          particles[i] = createParticle(false);
          continue;
        }

        // Separate out bright nodes for glowing pass; draw standard particles directly
        if (p.isBrightNode) {
          brightNodes.push(p);
        } else {
          ctx.fillStyle = resolveRgba(p.colorType, p.currentAlpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Render 1% Bright Particle Clusters with Soft Cyan/White Halo
      if (brightNodes.length > 0) {
        for (const node of brightNodes) {
          ctx.save();
          ctx.shadowColor = node.colorType === 'softWhite' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 240, 255, 0.65)';
          ctx.shadowBlur = node.glowRadius;
          ctx.fillStyle = resolveRgba(node.colorType, node.currentAlpha);
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(animate);
    };

    // Auto-pause animation when browser tab is inactive to preserve CPU / battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else {
        if (!prefersReducedMotion) {
          isRunning = true;
          lastTime = performance.now();
          animId = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(animate);
    } else {
      drawStaticSnapshot();
    }

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener?.('change', handleMotionPreferenceChange);
    };
  }, [customParticleCount, speedMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: 'transparent',
      }}
    />
  );
};
