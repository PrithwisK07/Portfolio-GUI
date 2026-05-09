"use client";
import { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width: number, height: number, time = 0, rafId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.005;

      const cx1 = width * 0.2 + Math.sin(time * 0.8) * width * 0.2;
      const cy1 = height * 0.3 + Math.cos(time * 0.5) * height * 0.2;
      const r1 = width * 0.4;
      const cx2 = width * 0.8 + Math.cos(time * 0.6) * width * 0.2;
      const cy2 = height * 0.7 + Math.sin(time * 0.7) * height * 0.2;
      const r2 = width * 0.5;

      const gradient1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, r1);
      gradient1.addColorStop(0, 'rgba(30, 30, 40, 0.8)');
      gradient1.addColorStop(1, 'rgba(5, 5, 5, 0)');

      const gradient2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r2);
      gradient2.addColorStop(0, 'rgba(40, 20, 10, 0.6)');
      gradient2.addColorStop(1, 'rgba(5, 5, 5, 0)');

      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen -z-10 opacity-40 pointer-events-none" />;
}