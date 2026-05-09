"use client";
import { useEffect } from 'react';
import gsap from 'gsap';

export const handleHoverAdd = () => document.body.classList.add('cursor-hover');
export const handleHoverRemove = () => document.body.classList.remove('cursor-hover');

export default function CustomCursor() {
  useEffect(() => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
    let cursorRafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(cursorDot, { x: mouseX, y: mouseY });
    };

    window.addEventListener('mousemove', onMouseMove);

    function renderCursor() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      gsap.set(cursorOutline, { x: outlineX, y: outlineY });
      cursorRafId = requestAnimationFrame(renderCursor);
    }
    renderCursor();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(cursorRafId);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot"></div>
      <div className="cursor-outline"></div>
    </>
  );
}