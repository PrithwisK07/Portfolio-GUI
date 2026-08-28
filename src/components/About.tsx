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
    
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isStacked: "(max-width: 1023px)"
    }, (context) => {
      const { isStacked } = context.conditions as { isStacked: boolean };
      
      gsap.fromTo('.about-word-span', 
        { y: '100%' },
        { y: '0%', duration: 1, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: "top 60%" } }
      );

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
          // Extended from +=200% to +=350% so the layer 3 sweep and final bubble travel actually complete
          end: isStacked ? "+=350%" : "+=450%", 
          pin: true,        
          scrub: 1,         
          anticipatePin: 1
        }
      });

      if (isStacked) {
         tl.to('.layer1-scroll-wrapper', { 
           y: () => {
             const wrapper = document.querySelector('.layer1-scroll-wrapper') as HTMLElement;
             return wrapper ? -(wrapper.offsetHeight - window.innerHeight) : 0;
           }, 
           duration: 1.5, 
           ease: "power2.inOut" 
         });
         tl.to({}, { duration: 0.2 });
      }

      tl.addLabel("reveal")
        .to(animState, { x: -100, duration: 2, ease: 'none', onUpdate: updateClipPath }, "reveal")
        .set(layer3Ref.current, { zIndex: 5 }, "reveal+=2.1")
        .fromTo('.slot-reel', { y: '0%' }, { y: '-80%', duration: 1.2, stagger: { each: 0.05, from: "end" }, ease: "power4.inOut" }, "reveal+=0.1" );
      
      bubblesRef.current.forEach((bubble, idx) => {
        const isLastBubble = idx === bubblesRef.current.length - 1;
        
        // Start mobile bubbles at 0.5 scale so they don't disappear, and ensure all bubbles center on their X-axis
        gsap.set(bubble, { scale: isStacked ? 0.5 : 0.3, xPercent: -50 });
        
        // Stop the final bubble slightly higher (-125vh) on mobile so it centers well
        const targetY = isLastBubble ? (isStacked ? "-125vh" : "-155vh") : "-250vh";

        tl.to(bubble, {
          y: targetY, scale: 1.1, rotation: isLastBubble ? 0 : Math.random() * 30 - 15, duration: 4, ease: "none" 
        }, idx === 0 ? "reveal+=1.8" : "-=3.2"); 
      });
      
      tl.to(animState, { x: -350, duration: 1.5, ease: 'none', onUpdate: updateClipPath });

    });
    
    return () => mm.revert();
  }, []);

  return (
    <section ref={containerRef} id="about" className="h-[100dvh] md:h-screen w-screen relative border-t border-white/10 overflow-hidden bg-white">
      <Layer1 />
      <Layer3 layer3Ref={layer3Ref} />
      <Layer2 lightLayerRef={lightLayerRef} bubblesRef={bubblesRef} />
    </section>
  );
}