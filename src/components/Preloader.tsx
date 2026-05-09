"use client";
import { useEffect } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  useEffect(() => {
    const tl = gsap.timeline();
    tl.to('.preloader-text', { y: 0, duration: 1, ease: 'power4.out' })
      .to('.preloader-text', { y: '-100%', duration: 0.8, ease: 'power4.in', delay: 0.5 })
      .to('.preloader', { y: '-100%', duration: 1, ease: 'power4.inOut' }, "-=0.4")
      .to('.reveal-text', { y: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out' }, "-=0.5")
      .to('.hero-meta', { opacity: 1, duration: 1 }, "-=0.5");
  }, []);

  return (
    <div className="preloader fixed inset-0 bg-dark z-[10000] flex justify-center items-center text-light font-display text-[2vw]">
      <div className="overflow-hidden">
        <div className="preloader-text translate-y-full">LOADING EXPERIENCE</div>
      </div>
    </div>
  );
}