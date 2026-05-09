"use client";
import { useEffect, useRef } from 'react';

export default function MeteorShower() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Adjust these to change the density and speed of the stars
    const meteorCount = 20; 
    const meteors: any[] = [];

    const createMeteor = () => {
      return {
        // Start anywhere across the screen, extending offscreen left to account for the slant
        x: Math.random() * width * 1.5 - (width * 0.5), 
        y: Math.random() * height * -1, // Start above the screen
        length: Math.random() * 100 + 40, // Length of the tail
        speed: Math.random() * 15 + 10, // How fast they fall
        opacity: Math.random() * 0.4 + 0.1, // Subtle brightness
        thickness: Math.random() * 1.5 + 0.5
      };
    };

    for (let i = 0; i < meteorCount; i++) meteors.push(createMeteor());

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';

      meteors.forEach((m, index) => {
        // Draw the line at a 45-degree angle
        const tailX = m.x - m.length;
        const tailY = m.y - m.length;

        const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = m.thickness;
        ctx.stroke();

        // Move the meteor down and to the right
        m.x += m.speed;
        m.y += m.speed;

        // Reset if it goes off screen
        if (m.y > height + 100 || m.x > width + 100) {
          meteors[index] = createMeteor();
          meteors[index].y = -Math.random() * 200 - 100; // Reset just above screen
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-50" 
    />
  );
}