/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

const textSideA = "We are a digital atelier crafting immersive experiences that live at the intersection of design, technology, and human emotion. We don't just build websites; we engineer digital atmospheres.";

const bubblesData = [
  { 
    id: 1, 
    value: "16", 
    label: "AWARDS", 
    bgColor: "#A37BFF", 
    textColor: "#5710FF", 
    size: "clamp(580px, 15vw, 700px)", 
    left: "10%" 
  },
  { 
    id: 2, 
    value: "48", 
    label: "PROJECTS", 
    bgColor: "#03543A", 
    textColor: "#B1FF05", 
    size: "clamp(640px, 25vw, 840px)", 
    left: "60%" 
  },
  { 
    id: 3, 
    value: "104", 
    label: "CLIENTS", 
    bgColor: "#2E51FF", 
    textColor: "#2EFFF0", 
    size: "clamp(560px, 20vw, 780px)", 
    left: "-5%" 
  },
  { 
    id: 4, 
    value: "99%", 
    label: "RETENTION", 
    bgColor: "#FF107A", 
    textColor: "#800080", 
    size: "clamp(600px, 22vw, 800px)", 
    left: "69%" 
  },
  { 
    id: 5, 
    value: "12", 
    label: "OFFICES", 
    bgColor: "#FF4D00", 
    textColor: "#EEFE43", 
    size: "clamp(500px, 18vw, 720px)", 
    left: "50%" 
  },
];

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const lightLayerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      
      // 1. Text Reveal for Dark Side
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
      
      // Step A: Diagonal Wipe covers the screen (Right to Left)
      .to(animState, {
         x: -100, 
         duration: 2, 
         ease: 'none',
         onUpdate: updateClipPath
      }, "reveal")

      // Step B: Slot Machine Letter Shuffle
      // Scrolls the vertical reels upwards (-80%) to land on the 5th item (the real letter)
      .fromTo('.slot-reel', 
         { y: '0%' }, 
         { 
           y: '-80%', 
           duration: 1.2, 
           stagger: { each: 0.05, from: "end" }, 
           ease: "power4.inOut" // A smooth acceleration and deceleration like a physical reel
         }, 
         "reveal+=0.1" 
      );
      
      // Step C: Bubbles float up
      bubblesRef.current.forEach((bubble, idx) => {
        const isLastBubble = idx === bubblesRef.current.length - 1;

        if(isLastBubble)
          gsap.set(bubble, { scale: 0.3, xPercent: -50 });
        else
          gsap.set(bubble, { scale: 0.3, xPercent: 0 });

        tl.to(bubble, {
          y: isLastBubble ? "-155vh" : "-250vh", 
          scale: 1.1,  
          rotation: isLastBubble ? 0 : Math.random() * 30 - 15,
          duration: 4, 
          ease: "none" 
        }, 
        idx === 0 ? "reveal+=1.8" : "-=3.2"); 
      });
      
      // Step D: Diagonal Wipe CONTINUES off the screen immediately
      tl.to(animState, {
         x: -350, 
         duration: 1.5,
         ease: 'none',
         onUpdate: updateClipPath
      });

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      id="about" 
      className="h-screen w-full relative border-t border-white/10 overflow-hidden"
    >
      
      {/* --- LAYER 1: SIDE A (DARK THEME) --- */}
      <div className="absolute inset-0 flex items-center px-6 md:px-12 z-0 bg-dark">
        <div className="w-full flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-1/4 mb-12 md:mb-0">
            <h3 className="font-display text-sm tracking-widest uppercase opacity-60">Manifesto</h3>
          </div>
          <div className="w-full md:w-3/4">
            <p className="font-display text-3xl md:text-5xl leading-tight tracking-tight">
              {textSideA.split(' ').map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-2 md:mr-3">
                  <span className="about-word-span inline-block transform translate-y-full">
                    {word}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* --- LAYER 2: SIDE B (INTERACTIVE LIGHT THEME) --- */}
      <div 
        ref={lightLayerRef}
        className="absolute inset-0 flex items-center justify-center z-10 bg-[#F1F0E8] overflow-hidden"
      >
        
        <div className="layer-2-content relative z-20 text-center flex flex-col items-center pointer-events-auto px-4 translate-y-[4vh]">
          
          {/* Added 'group' to enable the hover-underline effect without JS */}
          <span 
            className="group relative cursor-pointer text-[#FF3B00] text-4xl md:text-6xl mb-4 tracking-wide -rotate-10 font-brisa inline-block"
            onMouseEnter={handleHoverAdd}
            onMouseLeave={handleHoverRemove}
          >
            Introducing...
            
            {/* Hand-drawn SVG underline with progressive drawing animation */}
            <svg 
              className="absolute left-0 -bottom-1 md:-bottom-2 w-full h-4 md:h-5" 
              viewBox="0 0 200 20" 
              preserveAspectRatio="none"
              fill="none" 
            >
              <path 
                d="M 2,15 Q 60,0 120,12 T 198,5" 
                stroke="#FF3B00" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                pathLength="1"
                className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-all duration-500 ease-out group-hover:[stroke-dashoffset:0]" 
              />
            </svg>
          </span>
          
          <h2 className="font-palma-heavy text-[15vw] md:text-[11vw] font-black tracking-normal leading-[0.5] uppercase text-[#1C1C1C] pointer-events-none">
            {['THE', 'BIGGEST', 'EVER'].map((word, wordIdx) => (
              <span key={wordIdx} className="block overflow-hidden">
                {word.split('').map((char, charIdx) => {
                  
                  const charCode = char.charCodeAt(0);
                  const dummy1 = String.fromCharCode(((charCode + 5) % 26) + 65);
                  const dummy2 = String.fromCharCode(((charCode + 11) % 26) + 65);
                  const dummy3 = String.fromCharCode(((charCode + 17) % 26) + 65);
                  const dummy4 = String.fromCharCode(((charCode + 23) % 26) + 65);

                  return (
                    <span key={charIdx} className="relative inline-block h-[0.85em] overflow-hidden align-bottom">
                      
                      {/* 1. The Invisible Spacer: Dictates the exact natural width of the real character */}
                      <span className="invisible inline-flex h-[1em] items-center justify-center">
                        {char}
                      </span>
                      
                      {/* 2. The Absolute Reel: Positioned over the spacer. Dummy widths no longer stretch the parent! */}
                      <span className="slot-reel absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center will-change-transform">
                        <span className="h-[0.7em] leading-none flex items-center justify-center">{dummy1}</span>
                        <span className="h-[1em] leading-none flex items-center justify-center">{dummy2}</span>
                        <span className="h-[1em] leading-none flex items-center justify-center">{dummy3}</span>
                        <span className="h-[1em] leading-none flex items-center justify-center">{dummy4}</span>
                        <span className="h-[1em] leading-none flex items-center justify-center">{char}</span>
                      </span>
                      
                    </span>
                  );
                })}
              </span>
            ))}
          </h2>
          
          <p className="mt-8 md:mt-12 text-sm md:text-xl font-palma-medium max-w-md text-[#1C1C1C]/80 pointer-events-none">
            The DIGITAL FRONTIER is here. The WORLD's most immersive WEB experiences unfold across the BROWSER.
          </p>
        </div>

        {/* The Bubbles Container */}
        {bubblesData.map((bubble, idx) => (
          <div
            key={bubble.id}
            ref={el => { bubblesRef.current[idx] = el; }}
            onMouseEnter={handleHoverAdd}
            onMouseLeave={handleHoverRemove}
            className="absolute z-30 rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer will-change-transform"
            style={{
              backgroundColor: bubble.bgColor,
              width: bubble.size,
              height: bubble.size,
              left: bubble.left,
              top: '100%', 
            }}
          >
            <span className="font-palma-heavy text-[80px] md:text-[150px] font-black leading-none text-white tracking-tighter">
              {bubble.value}
            </span>
            <span 
              className="font-palma-heavy text-2xl md:text-5xl font-extrabold uppercase tracking-tight mt-2 md:mt-4"
              style={{ color: bubble.textColor }}
            >
              {bubble.label}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}