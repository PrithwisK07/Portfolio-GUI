"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// The two sides of the coin
const textSideA = "We are a digital atelier crafting immersive experiences that live at the intersection of design, technology, and human emotion. We don't just build websites; we engineer digital atmospheres.";
const textSideB = "We rely on ruthless optimization, mathematical precision, and rigorous architecture. Because beautiful design means nothing if the underlying engineering fractures under pressure.";

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const lightLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      
      // 1. Text Reveal Animation (Fires normally before pinning)
      gsap.fromTo('.about-word-span', 
        { y: '100%' },
        { 
          y: '0%', 
          duration: 1, 
          stagger: 0.02, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%", 
          }
        }
      );

      // 2. The Continuous Sweep Animation
      // We start at x: 150 (Fully off-screen to the right)
      const animState = { x: 150 }; 
      
      const updateClipPath = () => {
         if(lightLayerRef.current) {
             // We draw a massive parallelogram that is 200vw wide
             const topLeft = animState.x + 80; // 80vw slant
             const bottomLeft = animState.x;
             const topRight = animState.x + 280; // 200vw width + 80vw slant
             const bottomRight = animState.x + 200; // 200vw width
             
             lightLayerRef.current.style.clipPath = `polygon(${topLeft}vw 0%, ${topRight}vw 0%, ${bottomRight}vw 100%, ${bottomLeft}vw 100%)`;
         }
      };
      updateClipPath(); // Set initial off-screen state

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", 
          end: "+=200%", // 200% gives enough room for In -> Pause -> Out
          pin: true,        
          scrub: 1,         
          anticipatePin: 1
        }
      });

      // PHASE 1: Slide IN (Right to Left)
      tl.to(animState, {
         x: -100, // The left edge goes past the screen, the shape covers the viewport completely
         duration: 1,
         ease: 'none',
         onUpdate: updateClipPath
      })
      // PHASE 2: Pause so the user can read the "Light Side" content
      .to({}, { duration: 0.5 })
      // PHASE 3: Continue sliding OUT (Still Right to Left)
      .to(animState, {
         x: -350, // The right edge continues left until it completely exits the screen
         duration: 1,
         ease: 'none',
         onUpdate: updateClipPath
      });

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const renderText = (text: string) => (
    <p className="font-display text-3xl md:text-5xl leading-tight tracking-tight">
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-2 md:mr-3">
          <span className="about-word-span inline-block transform translate-y-full">
            {word}
          </span>
        </span>
      ))}
    </p>
  );

  return (
    <section ref={containerRef} id="about" className="h-screen w-full relative border-t border-white/10 overflow-hidden">
      
      {/* --- LAYER 1: SIDE A (DARK THEME) --- */}
      <div className="absolute inset-0 flex items-center px-6 md:px-12 z-0 bg-dark">
        <div className="w-full flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-1/4 mb-12 md:mb-0">
            <h3 className="font-display text-sm tracking-widest uppercase opacity-60">Manifesto</h3>
          </div>
          <div className="w-full md:w-3/4">
            {renderText(textSideA)}
          </div>
        </div>
      </div>

      {/* --- LAYER 2: SIDE B (LIGHT THEME) --- */}
      <div 
        ref={lightLayerRef}
        className="absolute inset-0 flex items-center px-6 md:px-12 z-10 bg-white text-dark pointer-events-none"
      >
        <div className="w-full flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-1/4 mb-12 md:mb-0">
            <h3 className="font-display text-sm tracking-widest uppercase opacity-40">The Reality</h3>
          </div>
          <div className="w-full md:w-3/4">
            {renderText(textSideB)}
          </div>
        </div>
      </div>

    </section>
  );
}