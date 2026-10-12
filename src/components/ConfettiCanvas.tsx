import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  active: boolean;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ["#C89958", "#E8CCA4", "#8E6532", "#F5F2EB", "#A87738", "#6E4C20"];
    const parts = Array.from({ length: 48 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 50,
      r: 2.5 + Math.random() * 3.5,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 1.5 + Math.random() * 2.3,
      vx: -0.6 + Math.random() * 1.2,
      rot: Math.random() * Math.PI,
      vr: -0.05 + Math.random() * 0.1,
    }));

    let frame = 0;
    let animId: number;

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      parts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, 1 - frame / 150);
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        ctx.restore();
      });

      if (frame < 150 && active) {
        animId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  return <canvas ref={canvasRef} id="confetti-canvas" />;
};
