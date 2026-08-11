"use client";
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

export default function Footer() {
  const btnRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isExpanded) return;
    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn || !text) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    gsap.to(text, { x: x * 0.1, y: y * 0.1, duration: 0.4, ease: 'power2.out' });
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isExpanded) return;
    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn || !text) return;

    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    gsap.to(text, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
  };

  const handleExpand = () => {
    if (isExpanded) return;
    setIsExpanded(true);

    const btn = btnRef.current;
    const text = textRef.current;
    const content = contentRef.current;

    gsap.killTweensOf(btn);
    gsap.killTweensOf(text);

    // Calculate exact pixel dimensions for a flawless transition
    const targetWidth = Math.min(window.innerWidth * 0.9, 800);
    const targetHeight = Math.max(window.innerHeight * 0.6, 400);

    const tl = gsap.timeline();

    tl.to(text, { opacity: 0, duration: 0.2 }, 0)
      // By putting this at position "0", it fires instantly alongside the text fade
      .to(btn, { 
        x: 0, 
        y: 0, 
        width: targetWidth, 
        height: targetHeight, 
        borderRadius: 32, 
        rotation: 180, // A slow half-spin while expanding looks incredibly premium
        backgroundColor: "#050505",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#ffffff",
        duration: 0.8, 
        ease: "power4.inOut" 
      }, 0)
      .fromTo(content, 
        { autoAlpha: 0, scale: 0.95 }, 
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" }, 
        "-=0.3" // Sneak the text in slightly before the expansion finishes
      );
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    const btn = btnRef.current;
    const text = textRef.current;
    const content = contentRef.current;

    const tl = gsap.timeline({
      onComplete: () => setIsExpanded(false)
    });

    tl.to(content, { autoAlpha: 0, scale: 0.95, duration: 0.3 }, 0)
      // Morph back into the exact original button state
      .to(btn, { 
        width: 280, 
        height: 88, 
        borderRadius: 44, 
        rotation: 0,
        backgroundColor: "#f4f4f5", 
        border: "0px solid rgba(255, 255, 255, 0)",
        color: "#050505", 
        duration: 0.8, 
        ease: "power4.inOut",
        // THIS IS THE FIX: Remove inline styles once the animation completes
        clearProps: "backgroundColor,color,border" 
      }, 0)
      .to(text, { opacity: 1, duration: 0.3 }, "-=0.3");
  };

  return (
    <section id="contact" className="h-screen py-32 px-6 md:px-12 flex flex-col justify-center items-center text-center relative border-t border-white/10 overflow-hidden">
      {/* THE NEW GRID BACKGROUND */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)`,
          backgroundSize: '96px 96px'
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full font-display text-[20vw] font-black text-white/4 whitespace-nowrap pointer-events-none tracking-tighter z-0">
        HELLO
      </div>
      
      <h2 className="font-display text-4xl md:text-7xl mb-12 max-w-4xl tracking-tight relative z-10">
        Ready to create something extraordinary?
      </h2>
      
      <div 
        ref={btnRef}
        onClick={handleExpand}
        className={`magnetic-btn font-display font-semibold text-xl flex flex-col items-center justify-center relative overflow-hidden z-20 shadow-2xl bg-[#f4f4f5] text-[#050505] border-0 border-transparent ${
          !isExpanded ? 'hover:bg-accent transition-colors duration-300 cursor-pointer' : 'cursor-default'
        }`}
        style={{
          width: 280,
          height: 88,
          borderRadius: 44,
        }}
        onMouseEnter={(e) => { if (!isExpanded) handleHoverAdd(); }}
        onMouseLeave={(e) => { if (!isExpanded) { handleHoverRemove(); handleMagneticLeave(e); } }}
        onMouseMove={handleMagneticMove}
      >
        <span ref={textRef} className="block pointer-events-none absolute">
          Initiate Contact
        </span>

        <div 
          ref={contentRef} 
          className="absolute inset-0 flex flex-col justify-center items-center opacity-0 invisible p-8 w-full h-full rotate-180"
        >

          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:bg-white hover:text-black hover:border-transparent transition-colors z-30 cursor-pointer"
            onMouseEnter={handleHoverAdd}
            onMouseLeave={handleHoverRemove}
          >
            ✕
          </button>
          
          <h3 className="font-display text-lg md:text-xl text-white/40 mb-4 uppercase tracking-widest relative z-10">
            Drop us a line
          </h3>
          
          <a 
            href="mailto:hello@aether.com"
            className="font-display text-4xl md:text-7xl text-white hover:text-accent transition-colors relative z-30"
            onMouseEnter={handleHoverAdd}
            onMouseLeave={handleHoverRemove}
          >
            hello@aether.com
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 w-full flex justify-between px-6 md:px-12 text-xs uppercase tracking-widest text-white/40 z-10">
        <span>Based in the Void</span>
        <span>© Aether 2026</span>
      </div>
      
    </section>
  );
}