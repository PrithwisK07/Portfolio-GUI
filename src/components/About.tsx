"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const aboutText = "We are a digital atelier crafting immersive experiences that live at the intersection of design, technology, and human emotion. We don't just build websites; we engineer digital atmospheres.";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        onEnter: () => {
          gsap.to('.about-word-span', { y: 0, duration: 1, stagger: 0.02, ease: 'power3.out' });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="about" className="py-32 px-6 md:px-12 flex flex-col md:flex-row justify-between items-start border-t border-white/10">
      <div className="w-full md:w-1/4 mb-12 md:mb-0">
        <h3 className="font-display text-sm tracking-widest uppercase text-white/50">Manifesto</h3>
      </div>
      <div className="w-full md:w-3/4">
        <p className="font-display text-3xl md:text-5xl leading-tight tracking-tight">
          {aboutText.split(' ').map((word, i) => (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '8px' }}>
              <span className="about-word-span" style={{ display: 'inline-block', transform: 'translateY(100%)', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                {word}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}