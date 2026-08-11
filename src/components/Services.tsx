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

// 24 items in total (4 full loops) to map symmetrically onto a 360 degree circle
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
  
  // States
  const [activeIndex, setActiveIndex] = useState(0);
  const lastActiveIndex = useRef(0);

  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);
  const cursorVisible = useRef(false);

  // Configuration for spacing and curvature
  const radius = 3000; 
  const cardSpacingAngle = 15; 
  const tickRadius = radius + 120; 

  // --- GSAP Animation for Smooth Button Morphing ---
  useEffect(() => {
    buttonRefs.current.forEach((btn, i) => {
      if (btn) {
        gsap.to(btn, {
          borderRadius: activeIndex === i ? 9999 : 4, // 9999px = full pill, 8px = rounded-md
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto"
        });
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    gsap.set(wheelRef.current, { rotation: 0, transformOrigin: "0px 0px" });
    
    const ticker = gsap.ticker.add(() => {
      // INFINITE SCROLL WRAPPING
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

      // Sync active button
      const currentLogicalIndex = Math.round(-currentRotation.current / cardSpacingAngle);
      const currentWrappedIndex = ((currentLogicalIndex % TOTAL_UNIQUE_ITEMS) + TOTAL_UNIQUE_ITEMS) % TOTAL_UNIQUE_ITEMS;
      
      if (currentWrappedIndex !== lastActiveIndex.current) {
        lastActiveIndex.current = currentWrappedIndex;
        setActiveIndex(currentWrappedIndex);
      }
    });

    return () => gsap.ticker.remove(ticker);
  }, []);

  // --- Button Navigation ---
  const handleButtonClick = (buttonIndex: number) => {
    const currentRot = targetRotation.current;
    const currentLogicalIndex = Math.round(-currentRot / cardSpacingAngle);
    const currentWrappedIndex = ((currentLogicalIndex % TOTAL_UNIQUE_ITEMS) + TOTAL_UNIQUE_ITEMS) % TOTAL_UNIQUE_ITEMS;

    let diff = buttonIndex - currentWrappedIndex;
    if (diff > TOTAL_UNIQUE_ITEMS / 2) diff -= TOTAL_UNIQUE_ITEMS;
    if (diff < -TOTAL_UNIQUE_ITEMS / 2) diff += TOTAL_UNIQUE_ITEMS;

    targetRotation.current = currentRot - (diff * cardSpacingAngle);
  };

  // --- Drag & Cursor Interactions ---
  const handlePointerDown = (e: React.PointerEvent) => {
    let isOverHeader = false;
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      // Calculate if the click is within the header/button area
      isOverHeader = e.clientY <= rect.bottom + 40; 
    }

    // Only allow dragging if we are not clicking the header/buttons
    if (!isOverHeader) {
      isDragging.current = true;
      startX.current = e.clientX;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    let isOverHeader = false;
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      // Set a buffer zone below the buttons so the custom cursor strictly 
      // appears only when over the wheel (cards and ticks)
      isOverHeader = e.clientY <= rect.bottom + 40;
    }

    if (isOverHeader && !isDragging.current) {
      // Hide custom cursor, restore native cursor
      if (cursorVisible.current) {
        gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
        cursorVisible.current = false;
        if (containerRef.current) containerRef.current.style.cursor = 'auto';
      }
    } else {
      // Show custom cursor, hide native cursor
      if (!cursorVisible.current) {
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' });
        cursorVisible.current = true;
        if (containerRef.current) containerRef.current.style.cursor = 'none';
      }
      // Follow mouse
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
      }
    }

    // Handle the actual wheel rotation logic
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - startX.current;
    targetRotation.current += deltaX * 0.03; 
    startX.current = e.clientX; 
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    // Snap to closest card seamlessly
    targetRotation.current = Math.round(targetRotation.current / cardSpacingAngle) * cardSpacingAngle;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    // Ensure cursor cleans up when mouse leaves the entire section entirely
    if (cursorVisible.current) {
      gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
      cursorVisible.current = false;
      if (containerRef.current) containerRef.current.style.cursor = 'auto';
    }
  };

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-20 h-20 bg-[#222] text-white rounded-full flex items-center justify-center text-sm font-medium tracking-wide pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 shadow-xl border border-white/10"
        style={{ mixBlendMode: 'normal' }}
      >
        Drag
      </div>

      <section 
        ref={containerRef} 
        className="relative w-full h-[1200px] overflow-hidden bg-[#F5F5F5] select-none touch-none overscroll-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handleMouseLeave}
      >
        {/* Fixed Header */}
        <div 
          ref={headerRef}
          className="absolute top-0 left-0 w-full pt-[15vh] pb-10 flex flex-col items-center justify-center z-10 text-center px-6 pointer-events-none"
        >
          <h2 className="font-display text-5xl md:text-8xl tracking-tighter text-[#111] mb-6 font-medium leading-tighter">
            A growing toolkit for<br/>creative developers
          </h2>
          <p className="text-[#111]/70 text-lg mb-8">
            Access everything with a single membership:
          </p>
          
          <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-1 max-w-full px-4 items-center justify-center pointer-events-auto p-1">
            {baseServices.map((service, i) => (
              <button 
                key={service.id}
                ref={(el) => { buttonRefs.current[i] = el; }}
                onClick={() => handleButtonClick(i)}
                // CSS only handles color transitions now; GSAP handles the border-radius perfectly
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

        {/* Pivot Point at 3800px down */}
        <div 
          className="absolute w-0 h-0 pointer-events-none"
          style={{ top: '3800px', left: '50%' }} 
        >
          {/* Stationary Compass / Tick Background */}
          <div className="absolute inset-0">
            {Array.from({ length: 450 }).map((_, i) => {
              const angle = i * 0.8; 
              const isMajorTick = i % 10 === 0; 
              
              return (
                <div 
                  key={`tick-${i}`}
                  className={`absolute left-0 top-0 w-[2px] ${isMajorTick ? 'h-6 bg-black/20' : 'h-3 bg-black/10'}`}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${tickRadius}px)`,
                  }}
                />
              );
            })}
          </div>

          {/* Rotating Cards Layer */}
          <div ref={wheelRef} className="absolute inset-0 will-change-transform">
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