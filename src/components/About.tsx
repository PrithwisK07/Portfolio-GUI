"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import Layer1 from './sub-components/About/Layer1';
import Layer2 from './sub-components/About/Layer2';
import Layer3 from './sub-components/About/Layer3';

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const lightLayerRef = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      
      // 1. Text Reveal for Layer 1
      gsap.fromTo('.about-word-span', 
        { y: '100%' },
        { y: '0%', duration: 1, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: "top 60%" } }
      );

      // 2. The Master Scroll Sequence
      const animState = { x: 150 }; 
      
      const updateClipPath = () => {
         if(lightLayerRef.current) {
             const topLeft = animState.x + 80; 
             const bottomLeft = animState.x;
             const topRight = animState.x + 280; 
             const bottomRight = animState.x + 200; 
             lightLayerRef.current.style.clipPath = `polygon(${topLeft}vw 0%, ${topRight}vw 0%, ${bottomRight}vw 100%, ${bottomLeft}vw 100%)`;
         }
      };
      
      updateClipPath(); 

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", 
          end: "+=450%", 
          pin: true,        
          scrub: 1,         
          anticipatePin: 1
        }
      });

      tl.addLabel("reveal")
        // Step A: Diagonal Wipe covers the screen
        .to(animState, { x: -100, duration: 2, ease: 'none', onUpdate: updateClipPath }, "reveal")
        // Step A.5: Dynamically swap Layer 3's z-index
        .set(layer3Ref.current, { zIndex: 5 }, "reveal+=2.1")
        // Step B: Slot Machine Letter Shuffle
        .fromTo('.slot-reel', { y: '0%' }, { y: '-80%', duration: 1.2, stagger: { each: 0.05, from: "end" }, ease: "power4.inOut" }, "reveal+=0.1" );
      
      // Step C: Bubbles float up
      bubblesRef.current.forEach((bubble, idx) => {
        const isLastBubble = idx === bubblesRef.current.length - 1;
        gsap.set(bubble, { scale: 0.3, xPercent: isLastBubble ? -50 : 0 });
        tl.to(bubble, {
          y: isLastBubble ? "-155vh" : "-250vh", scale: 1.1, rotation: isLastBubble ? 0 : Math.random() * 30 - 15, duration: 4, ease: "none" 
        }, idx === 0 ? "reveal+=1.8" : "-=3.2"); 
      });
      
      // Step D: Diagonal Wipe CONTINUES off the screen immediately (Revealing Layer 3)
      tl.to(animState, { x: -350, duration: 1.5, ease: 'none', onUpdate: updateClipPath });

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="about" className="h-screen w-full relative border-t border-white/10 overflow-hidden">
      <Layer1 />
      <Layer3 layer3Ref={layer3Ref} />
      <Layer2 lightLayerRef={lightLayerRef} bubblesRef={bubblesRef} />
    </section>
  );
}