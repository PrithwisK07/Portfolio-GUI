/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Base 6 unique items 
const baseServices = [
  {
    id: "01",
    tag: "The Vault",
    title: "Digital Strategy",
    desc: "We decode complex market algorithms to position your brand precisely where it needs to be, architecting roadmaps that guarantee digital dominance.",
    deliverables: ["Market & Competitor Analysis", "Brand Positioning & Identity", "Growth Architecture", "Technical SEO Audits"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    color: "bg-[#111111]", 
    textColor: "text-white",
  },
  {
    id: "02",
    tag: "Page Transition Course",
    title: "Page Transition Course",
    desc: "Learn how to create seamless page transitions that take your websites to the next level. We cover everything from basic routing to complex WebGL swaps.",
    deliverables: ["Next.js Routing", "Framer Motion", "GSAP Page Transitions", "WebGL Swaps"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
    color: "bg-[#9DFF50]", 
    textColor: "text-black",
  },
  {
    id: "03",
    tag: "Buttons",
    title: "Interactive Buttons",
    desc: "A massive collection of magnetic, hover-responsive, and physics-based buttons ready to drop into your modern web applications.",
    deliverables: ["Magnetic Hover", "SVG Path Animations", "Physics Based", "Copy & Paste Ready"],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    color: "bg-[#6B46FF]", 
    textColor: "text-white",
  },
  {
    id: "04",
    tag: "Easings",
    title: "Custom Easings",
    desc: "Stop using linear animations. Our library of custom bezier curves and physics springs will make your motion design feel incredibly premium.",
    deliverables: ["Cubic Beziers", "Spring Physics", "Motion Guidelines", "GSAP Configs"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    color: "bg-[#FF8C42]", 
    textColor: "text-black",
  },
  {
    id: "05",
    tag: "Icons",
    title: "Vector Icons",
    desc: "Hundreds of meticulously crafted vector icons optimized for the web. Lightweight, scalable, and beautifully animated for interaction.",
    deliverables: ["SVG Sprites", "Animated Lottie", "React Components", "Figma File"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
    color: "bg-[#007AFF]", 
    textColor: "text-white",
  },
  {
    id: "06",
    tag: "Community",
    title: "Private Community",
    desc: "Join hundreds of other creative developers in our private Discord. Share work, get code reviews, and collaborate on bleeding-edge projects.",
    deliverables: ["Discord Access", "Weekly Workshops", "Code Reviews", "Job Board"],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    color: "bg-[#FF2D55]", 
    textColor: "text-white",
  }
];

const wheelData = Array.from({ length: 4 }).flatMap((_, i) => 
  baseServices.map((service, index) => ({
    ...service,
    uniqueId: `${service.id}-clone-${i}`,
    logicalIndex: index
  }))
);

const TOTAL_UNIQUE_ITEMS = baseServices.length;

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Refs for custom manual lerp
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const lastActiveIndex = useRef(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);
  const cursorVisible = useRef(false);

  const radius = 3000; 
  const cardSpacingAngle = 15; 
  const tickRadius = radius + 120; 

  useEffect(() => {
    buttonRefs.current.forEach((btn, i) => {
      if (btn) {
        gsap.to(btn, {
          borderRadius: activeIndex === i ? 9999 : 4,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto"
        });
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    gsap.set(cursorRef.current, { scale: 0, opacity: 0, xPercent: -50, yPercent: -50 });
    gsap.set(wheelRef.current, { rotation: 0, transformOrigin: "0px 0px" });

    const ticker = gsap.ticker.add(() => {
      // --- Cursor Lerp Logic ---
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.15;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.15;
      
      if (cursorRef.current) {
        gsap.set(cursorRef.current, { 
          x: currentMouse.current.x, 
          y: currentMouse.current.y 
        });
      }

      // --- Wheel Rotation Logic ---
      if (targetRotation.current > 180) {
        targetRotation.current -= 360;
        currentRotation.current -= 360;
      } else if (targetRotation.current < -180) {
        targetRotation.current += 360;
        currentRotation.current += 360;
      }

      currentRotation.current += (targetRotation.current - currentRotation.current) * 0.08;
      
      if (wheelRef.current) {
        gsap.set(wheelRef.current, { rotation: currentRotation.current, transformOrigin: "0px 0px" });
      }

      const currentLogicalIndex = Math.round(-currentRotation.current / cardSpacingAngle);
      const currentWrappedIndex = ((currentLogicalIndex % TOTAL_UNIQUE_ITEMS) + TOTAL_UNIQUE_ITEMS) % TOTAL_UNIQUE_ITEMS;
      
      if (currentWrappedIndex !== lastActiveIndex.current) {
        lastActiveIndex.current = currentWrappedIndex;
        setActiveIndex(currentWrappedIndex);
      }
    });

    return () => gsap.ticker.remove(ticker);
  }, []);

  const handleButtonClick = (buttonIndex: number) => {
    const currentRot = targetRotation.current;
    const currentLogicalIndex = Math.round(-currentRot / cardSpacingAngle);
    const currentWrappedIndex = ((currentLogicalIndex % TOTAL_UNIQUE_ITEMS) + TOTAL_UNIQUE_ITEMS) % TOTAL_UNIQUE_ITEMS;

    let diff = buttonIndex - currentWrappedIndex;
    if (diff > TOTAL_UNIQUE_ITEMS / 2) diff -= TOTAL_UNIQUE_ITEMS;
    if (diff < -TOTAL_UNIQUE_ITEMS / 2) diff += TOTAL_UNIQUE_ITEMS;

    targetRotation.current = currentRot - (diff * cardSpacingAngle);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    let isOverHeader = false;
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      isOverHeader = e.clientY <= rect.bottom + 40; 
    }

    if (!isOverHeader) {
      isDragging.current = true;
      startX.current = e.clientX;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    let isOverHeader = false;
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      isOverHeader = e.clientY <= rect.bottom + 40;
    }

    targetMouse.current.x = e.clientX;
    targetMouse.current.y = e.clientY;

    if (isOverHeader && !isDragging.current) {
      if (cursorVisible.current) {
        gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
        gsap.to('.cursor-dot, .cursor-outline', { opacity: 1, duration: 0.3 }); 
        cursorVisible.current = false;
        if (containerRef.current) containerRef.current.style.cursor = 'auto'; 
      }
    } else {
      if (!cursorVisible.current) {
        currentMouse.current.x = e.clientX;
        currentMouse.current.y = e.clientY;
        gsap.set(cursorRef.current, { x: e.clientX, y: e.clientY });

        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' });
        gsap.to('.cursor-dot, .cursor-outline', { opacity: 0, duration: 0.3 }); 
        cursorVisible.current = true;
        if (containerRef.current) containerRef.current.style.cursor = 'none';
      }
    }

    if (!isDragging.current) return;
    
    const deltaX = e.clientX - startX.current;
    targetRotation.current += deltaX * 0.03; 
    startX.current = e.clientX; 
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    targetRotation.current = Math.round(targetRotation.current / cardSpacingAngle) * cardSpacingAngle;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (cursorVisible.current) {
      gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
      gsap.to('.cursor-dot, .cursor-outline', { opacity: 1, duration: 0.3 });
      cursorVisible.current = false;
      if (containerRef.current) containerRef.current.style.cursor = 'auto';
    }
  };

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 flex items-center justify-center gap-2 pointer-events-none z-50"
        style={{ mixBlendMode: 'normal' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#222]"></div>
        <div className="w-20 h-20 bg-[#222] text-white rounded-full flex items-center justify-center text-sm font-medium tracking-wide shadow-xl border border-white/10 shrink-0">
          Drag
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#222]"></div>
      </div>

      <section 
        ref={containerRef} 
        className="relative w-full h-[1400px] overflow-hidden bg-[#F5F5F5] select-none touch-none overscroll-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handleMouseLeave}
        id="services"
      >
        <div 
          ref={headerRef}
          className="absolute top-0 left-0 w-full pt-[17.5vh] pb-10 flex flex-col items-center justify-center z-20 text-center px-6 pointer-events-none gap-8"
        >
          <h2 className="font-display text-5xl md:text-8xl tracking-tighter text-[#111] font-medium leading-tighter">
            A growing toolkit for<br/>creative developers
          </h2>
          <p className="text-[#111]/70 text-lg mb-10">
            Access everything with a single membership:
          </p>
          
          <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-1 max-w-full px-4 items-center justify-center pointer-events-auto p-1">
            {baseServices.map((service, i) => (
              <button 
                key={service.id}
                ref={(el) => { buttonRefs.current[i] = el; }}
                onClick={() => handleButtonClick(i)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border transition-colors duration-300 ${
                  activeIndex === i 
                  ? 'bg-[#111] text-white border-transparent' 
                  : 'bg-[#EAEAEA] text-[#111] border-transparent hover:bg-[#DFDFDF] hover:border-black/10'
                }`}
              >
                {service.tag}
              </button>
            ))}
          </div>
        </div>

        {/* Static Anchored Arrows Overlay */}
        {/* top = 3880 (wheel origin) - 3000 (radius) = 880px center point */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[550px] md:h-[600px] pointer-events-none z-10"
          style={{ top: '880px' }}
        >
          {/* Left Arrow */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-12 md:-left-25 w-8 h-8 text-red-600 scale-180 -scale-x-280">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 31 32" fill="none" className="scribble-arrow is--reel rotate-140">
              <path d="M-1.3266e-06 0.812487L1.24998 0.603613L1.62857 -0.000167918C1.45886 1.95803 4.50712 2.87186 5.21207 4.73215C5.42421 5.2935 4.76822 5.38815 4.56913 5.21191C4.52018 5.16948 4.33088 4.48411 3.92945 4.0631C3.5835 3.7041 2.02674 1.96782 1.63183 2.28114C2.1377 7.34635 3.34526 11.9905 5.93334 16.3998C11.2009 25.3846 20.7308 30.3095 30.9689 31.1385C15.8484 31.7782 2.73822 19.0694 1.29894 4.23934C0.443857 4.58202 1.35768 7.3594 -1.04856e-06 7.17337L-1.32646e-06 0.815748L-1.3266e-06 0.812487Z" fill="currentColor"></path>
            </svg>
          </div>

          {/* Right Arrow */}
          <div className="absolute top-1/2 -translate-y-1/2 -right-12 md:-right-25 w-8 h-8 text-red-600 scale-280">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 31 32" fill="none" className="scribble-arrow is--reel rotate-140">
              <path d="M-1.3266e-06 0.812487L1.24998 0.603613L1.62857 -0.000167918C1.45886 1.95803 4.50712 2.87186 5.21207 4.73215C5.42421 5.2935 4.76822 5.38815 4.56913 5.21191C4.52018 5.16948 4.33088 4.48411 3.92945 4.0631C3.5835 3.7041 2.02674 1.96782 1.63183 2.28114C2.1377 7.34635 3.34526 11.9905 5.93334 16.3998C11.2009 25.3846 20.7308 30.3095 30.9689 31.1385C15.8484 31.7782 2.73822 19.0694 1.29894 4.23934C0.443857 4.58202 1.35768 7.3594 -1.04856e-06 7.17337L-1.32646e-06 0.815748L-1.3266e-06 0.812487Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        <div 
          className="absolute w-0 h-0 pointer-events-none"
          style={{ top: '3880px', left: '50%' }} 
        >
          <div className="absolute inset-0">
            {Array.from({ length: 450 }).map((_, i) => {
              const angle = i * 0.8; 
              const isMajorTick = i % 10 === 0; 
              
              return (
                <div 
                  key={`tick-${i}`}
                  className={`absolute left-0 top-0 w-[2px] ${isMajorTick ? 'h-6 bg-accent/80' : 'h-3 bg-black/10'}`}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${tickRadius}px)`,
                  }}
                />
              );
            })}
          </div>

          <div ref={wheelRef} className="absolute inset-0 will-change-transform z-0">
            {wheelData.map((service, i) => {
              const idx = i - 12; 
              const angle = idx * cardSpacingAngle; 
              
              return (
                <div 
                  key={service.uniqueId}
                  className={`absolute left-0 top-0 w-[350px] md:w-[500px] h-[550px] md:h-[600px] rounded-[1.5rem] p-10 flex flex-col items-center text-center shadow-2xl ${service.color} ${service.textColor}`}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                  }}
                >
                  <div className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full mb-12 border ${service.textColor === 'text-black' ? 'border-black/10 bg-black/5' : 'border-white/10 bg-white/10'}`}>
                    {service.deliverables[0]}
                  </div>

                  <div className="text-5xl mb-6 font-light">
                    *
                  </div>

                  <h3 className="font-display text-4xl md:text-5xl tracking-tight mb-4 font-medium">
                    {service.title}
                  </h3>
                  <p className={`text-sm md:text-base mb-auto px-4 leading-relaxed ${service.textColor === 'text-black' ? 'text-black/70' : 'text-white/70'}`}>
                    {service.desc}
                  </p>

                  <div className="relative w-full h-[200px] mt-8 rounded-[1rem] overflow-hidden bg-black/20">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover mix-blend-overlay opacity-60 pointer-events-none"
                      draggable={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <button className="px-6 py-3 bg-white text-black text-sm font-medium rounded-lg shadow-lg hover:scale-105 transition-transform pointer-events-auto cursor-pointer">
                          Discover
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}