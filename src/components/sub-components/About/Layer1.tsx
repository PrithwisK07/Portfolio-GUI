import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { textSideA } from './aboutData';

export default function Layer1() {
  // Ref for the entire page layer
  const layerRef = useRef<HTMLDivElement>(null);
  
  // Ref specifically for the scoped GSAP animation inside the purple box
  const purpleBoxRef = useRef<HTMLDivElement>(null);
  
  // Ring Refs for rotation
  const outerRingRef = useRef<HTMLDivElement>(null);
  const middleRingRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);

  // Mask & SVG Refs for visibility and timer control
  const svgRef = useRef<SVGSVGElement>(null);
  const maskRef = useRef<SVGSVGElement>(null);

  // Refs and state for Right Side 3D Interaction
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);

  const imageA = "./asset/ss.png"; 
  const imageB = "./asset/ss1.png";

  // Mock data for the right side cards to cycle through
  const rightCards = [
    {
      id: 0,
      title: "Manifesto",
      label: "About Us",
      text: textSideA || "We are a creative studio pushing boundaries."
    },
    {
      id: 1,
      title: "Stacking Cards 3D (CSS)",
      label: "Scroll Animations",
      text: "Here is a sticky card. As you scroll, the next ones will dynamically stack on top..."
    },
    {
      id: 2,
      title: "Spatial Cards Slider",
      label: "Sliders & Marquees",
      text: "Immersive slider experience using GSAP and 3D transforms for seamless navigation."
    }
  ];

  useEffect(() => {
    // Left side scope
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });

      const proxy = { 
        radius: 170, 
        tickLength: 4, 
        strokeWidth: 1 
      }; 

      // Initial States
      gsap.set([".mid-imgA", ".mid-imgB", ".in-imgA", ".in-imgB"], { xPercent: -50, yPercent: -50, top: "50%", left: "50%" });
      gsap.set([".outer-imgB", ".mid-imgB", ".in-imgB"], { opacity: 0 });
      gsap.set([".outer-imgA", ".mid-imgA", ".in-imgA"], { opacity: 1 });
      gsap.set([outerRingRef.current, middleRingRef.current, innerRingRef.current], { rotation: 0 });
      
      gsap.set(svgRef.current, { opacity: 0 });

      const initialC = 2 * Math.PI * proxy.radius;
      gsap.set(maskRef.current, {
        transformOrigin: "center",
        rotation: -90,
        strokeDasharray: initialC,
        strokeDashoffset: initialC
      });

      const buildStep = (
        ringRef: React.RefObject<HTMLDivElement>, 
        imgOut: string | null, 
        imgIn: string | null, 
        targetRadius: number, 
        targetTickLength: number,
        targetStrokeWidth: number,
        targetRotation: number, 
        label: string
      ) => {
        
        tl.to(proxy, {
          radius: targetRadius,
          tickLength: targetTickLength,
          strokeWidth: targetStrokeWidth,
          duration: 0.3,
          ease: "power2.inOut",
          onUpdate: () => {
            const r = proxy.radius;
            const l = proxy.tickLength;
            const sw = proxy.strokeWidth;
            
            purpleBoxRef.current?.querySelectorAll('.tick-line').forEach(line => {
              line.setAttribute('y1', String(240 - r - l));
              line.setAttribute('y2', String(240 - r + l));
              line.setAttribute('stroke-width', String(sw));
            });
            
            if (maskRef.current) maskRef.current.setAttribute('r', String(r));
          }
        }, `${label}-radius`);

        tl.call(() => {
          const c = 2 * Math.PI * proxy.radius;
          gsap.set(maskRef.current, { strokeDasharray: c, strokeDashoffset: c });
        });

        tl.to(maskRef.current, {
          strokeDashoffset: 0,
          duration: 0.5,
          ease: "linear"
        }, `${label}-timer`);

        tl.to(ringRef.current, { rotation: targetRotation, duration: 0.7, ease: "power3.inOut" }, `${label}-rotate`);
        
        if (imgOut && imgIn) {
          tl.to(imgOut, { opacity: 0, duration: 0.7 }, `${label}-rotate`);
          tl.to(imgIn, { opacity: 1, duration: 0.7 }, `${label}-rotate`);
        }

        tl.call(() => {
          const c = 2 * Math.PI * proxy.radius;
          gsap.set(maskRef.current, { strokeDashoffset: c });
        });
      };

      // PHASE 1: JUMBLE
      tl.to(svgRef.current, { opacity: 1, duration: 0.3 }); 
      buildStep(middleRingRef, ".mid-imgA", ".mid-imgB", 170, 4, 1, 135, "jumb1-c2");
      buildStep(innerRingRef, ".in-imgA", ".in-imgB", 110, 3, 1, -90, "jumb1-c3");
      buildStep(outerRingRef, ".outer-imgA", ".outer-imgB", 230, 6, 2, 45, "jumb1-c1");
      tl.to(svgRef.current, { opacity: 0, duration: 0.3 }); 
      tl.to({}, { duration: 0.5 }); 

      // PHASE 2: REASSEMBLE
      tl.to(svgRef.current, { opacity: 1, duration: 0.3 }); 
      buildStep(outerRingRef, null, null, 230, 6, 2, 0, "reass1-c1");
      buildStep(middleRingRef, null, null, 170, 4, 1, 0, "reass1-c2");
      buildStep(innerRingRef, null, null, 110, 3, 1, 0, "reass1-c3");
      tl.to(svgRef.current, { opacity: 0, duration: 0.3 }); 
      tl.to({}, { duration: 2.5 }); 

      // PHASE 3: JUMBLE
      tl.to(svgRef.current, { opacity: 1, duration: 0.3 }); 
      buildStep(middleRingRef, ".mid-imgB", ".mid-imgA", 170, 4, 1, 135, "jumb2-c2");
      buildStep(innerRingRef, ".in-imgB", ".in-imgA", 110, 3, 1, -90, "jumb2-c3");
      buildStep(outerRingRef, ".outer-imgB", ".outer-imgA", 230, 6, 2, 45, "jumb2-c1");
      tl.to(svgRef.current, { opacity: 0, duration: 0.3 }); 
      tl.to({}, { duration: 0.5 }); 

      // PHASE 4: REASSEMBLE
      tl.to(svgRef.current, { opacity: 1, duration: 0.3 }); 
      buildStep(outerRingRef, null, null, 230, 6, 2, 0, "reass2-c1");
      buildStep(middleRingRef, null, null, 170, 4, 1, 0, "reass2-c2");
      buildStep(innerRingRef, null, null, 110, 3, 1, 0, "reass2-c3");
      tl.to(svgRef.current, { opacity: 0, duration: 0.3 }); 
      tl.to({}, { duration: 2.5 }); 

    }, purpleBoxRef); 

    return () => ctx.revert(); 
  }, []);

  // Right Side Cube Transition Logic
  const handleCardTransition = (direction: 'up' | 'down') => {
    if (isAnimating.current || !cardsContainerRef.current) return;
    isAnimating.current = true;
    
    const isUp = direction === 'up';
    const nextIndex = isUp
      ? (currentIndex + 1) % rightCards.length
      : (currentIndex - 1 + rightCards.length) % rightCards.length;

    const currentEl = cardsContainerRef.current.children[currentIndex] as HTMLElement;
    const nextEl = cardsContainerRef.current.children[nextIndex] as HTMLElement;

    // Prep next card (set display and starting 3D position)
    gsap.set(nextEl, { 
      display: 'flex', 
      yPercent: isUp ? 100 : -100, 
      rotationX: isUp ? -80 : 80,
      z: -300,
      opacity: 0,
      transformOrigin: isUp ? '50% 100%' : '50% 0%'
    });

    // Adjust origin for current card leaving
    gsap.set(currentEl, {
      transformOrigin: isUp ? '50% 0%' : '50% 100%'
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(currentEl, { display: 'none' });
        setCurrentIndex(nextIndex);
        isAnimating.current = false;
      }
    });

    // Animate current out
    tl.to(currentEl, {
      yPercent: isUp ? -100 : 100,
      rotationX: isUp ? 80 : -80,
      z: -300,
      opacity: 0,
      duration: 0.85,
      ease: "power3.inOut"
    }, 0);

    // Animate next in
    tl.to(nextEl, {
      yPercent: 0,
      rotationX: 0,
      z: 0,
      opacity: 1,
      duration: 0.85,
      ease: "power3.inOut"
    }, 0);
  };

  const handleScrollToProjects = () => {
    const section = document.getElementById('work');
    console.log(section);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderPipes = () => {
    return Array.from({ length: 48 }).map((_, i) => {
      const angle = (i * 360) / 48;
      return (
        <g key={i} transform={`rotate(${angle} 240 240)`}>
          <line 
            className="tick-line"
            x1="240" y1={240 - 170 - 4} 
            x2="240" y2={240 - 170 + 4} 
            stroke="white" 
            strokeWidth="1" 
            strokeLinecap="round" 
          />
        </g>
      );
    });
  };

  return (
    <div 
      ref={layerRef} 
      className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-center px-4 md:px-8 py-12 md:py-0 z-[1] md:gap-8 bg-white" 
    >
      
      {/* ========================================= */}
      {/* LEFT SIDE: Purple Interactive Container     */}
      {/* ========================================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
        <div 
          ref={purpleBoxRef} 
          className="relative w-full max-w-[600px] h-[665px] bg-[#5e43f3] rounded-3xl overflow-hidden flex flex-col items-center justify-center shadow-2xl"
        >
          {/* Internal Absolute Text Overlay */}
          <div className="absolute top-6 left-8 md:top-8 md:left-10 text-white z-50 pointer-events-none">
            <h3 className="text-2xl md:text-3xl opacity-90 font-brisa">Created by</h3>
            <h1 className="text-3xl md:text-5xl font-haffer-regular leading-none mt-2 tracking-tight">Prithwis</h1>
            <h2 className="text-lg md:text-2xl font-haffer-light tracking-wide mt-1 opacity-90">Karmakar</h2>
          </div>

          {/* The Animation Core */}
          <div className="relative w-[480px] h-[480px] flex items-center justify-center scale-[0.7] sm:scale-90 md:scale-100 top-15">
            
            {/* OUTER RING (c1) */}
            <div ref={outerRingRef} className="absolute w-[440px] h-[440px] rounded-full overflow-hidden z-10">
              <img src={imageA} alt="Outer A" className="outer-imgA absolute inset-0 w-full h-full object-cover" />
              <img src={imageB} alt="Outer B" className="outer-imgB absolute inset-0 w-full h-full object-cover" />
            </div>

            {/* MIDDLE RING (c2) */}
            <div ref={middleRingRef} className="absolute w-[320px] h-[320px] rounded-full overflow-hidden z-20">
              <div className="relative w-full h-full">
                <img src={imageA} alt="Middle A" className="mid-imgA absolute w-[440px] h-[440px] max-w-none object-cover" />
                <img src={imageB} alt="Middle B" className="mid-imgB absolute w-[440px] h-[440px] max-w-none object-cover" />
              </div>
            </div>

            {/* INNER RING (c3) */}
            <div ref={innerRingRef} className="absolute w-[200px] h-[200px] rounded-full overflow-hidden z-30">
              <div className="relative w-full h-full">
                <img src={imageA} alt="Inner A" className="in-imgA absolute w-[440px] h-[440px] max-w-none object-cover" />
                <img src={imageB} alt="Inner B" className="in-imgB absolute w-[440px] h-[440px] max-w-none object-cover" />
              </div>
            </div>

            {/* SVG TICKS OVERLAY */}
            <svg ref={svgRef} className="absolute w-[480px] h-[480px] pointer-events-none z-40" viewBox="0 0 480 480">
              <defs>
                <mask id="timer-mask">
                  <circle ref={maskRef} cx="240" cy="240" r="170" stroke="white" strokeWidth="24" fill="none" />
                </mask>
              </defs>
              
              <g opacity="0.3">
                {renderPipes()}
              </g>
              
              <g mask="url(#timer-mask)">
                {renderPipes()}
              </g>
            </svg>
          </div>

          {/* About Us Button with Smooth Scroll */}
          <button 
            onClick={handleScrollToProjects}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 text-[15px] font-semibold tracking-wide rounded-[2px] z-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            See Projects
          </button>
        </div>
      </div>


      {/* ========================================= */}
      {/* RIGHT SIDE: Osmo Pill Container             */}
      {/* ========================================= */}
      <div className="w-full md:w-3/4 flex items-center justify-center md:justify-start mt-10 md:mt-0">
        <div className="relative  w-full h-[665px] bg-[#201D1D] rounded-full flex flex-col justify-between items-center py-5 px-4 md:px-15 shadow-2xl overflow-hidden">

          {/* Top Title */}
          <div className="text-center mt-4 z-10 -space-y-1">
            <h3 className="text-[#9DFE51] font-haffer-regular font-medium text-lg tracking-wide">Latest updates</h3>
            <h3 className="text-[#f4f4f4] font-haffer-light tracking-wide opacity-90">from Osmo</h3>
          </div>
          
          {/* Middle 3D Interactive Zone */}
          <div className="relative w-full max-w-[665px] flex-grow flex items-center justify-center" style={{ perspective: '1200px' }}>
            
            {/* Top Hover Zone -> Triggers UP action */}
            <div 
              className="absolute top-0 left-0 w-full h-[40%] z-30 cursor-pointer group flex justify-center items-start pt-10" 
              onClick={() => handleCardTransition('up')}
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </div>
            </div>

            {/* Bottom Hover Zone -> Triggers DOWN action */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[40%] z-30 cursor-pointer group flex justify-center items-end pb-10" 
              onClick={() => handleCardTransition('down')}
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-4 group-hover:translate-y-0 shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              </div>
            </div>

            {/* Cards Container */}
            <div ref={cardsContainerRef} className="relative w-full h-[220px] pointer-events-none z-20" style={{ transformStyle: 'preserve-3d' }}>
              {rightCards.map((card, idx) => (
                <div 
                  key={card.id}
                  className={`absolute inset-0 w-full bg-[#9DFE51] rounded-2xl px-3 py-2 flex flex-col md:flex-row gap-3 items-stretch shadow-xl pointer-events-auto ${idx === 0 ? 'flex' : 'hidden'}`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Left Column (Labels & Titles) */}
                  <div className="w-full md:w-[45%] flex flex-col justify-center pb-2">              
                    <div className="my-8 ml-3">
                      <h4 className="text-[#111] text-2xl md:text-3xl font-haffer-regular font-medium leading-[1.1] tracking-tight">
                        {card.title}
                      </h4>
                    </div>
                  </div>

                  {/* Right Column (Dark Inner Box holding Text) */}
                  <div className="w-full md:w-[80%] bg-gray-800 rounded-xl p-5 md:px-6 flex flex-col justify-center shadow-inner">
                    <h5 className="text-white text-xs opacity-50 mb-4 tracking-widest uppercase">{card.label}</h5>
                    <p className="font-display text-[15px] md:text-[17px] leading-snug tracking-tight text-[#f4f4f4]">
                      {card.text.split(' ').map((word, i) => (
                        <span key={i} className="inline-block overflow-hidden mr-1">
                          <span className="about-word-span inline-block transform translate-y-0">
                            {word}
                          </span>
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Cursive Text */}
          <div className="mb-6 z-10 w-1/4 pointer-events-none">
            <p className="text-[#9DFE51] text-2xl md:text-3xl leading-5 text-center font-brisa opacity-90">
              New stuff is added every week!
            </p>
          </div>

          {/* Right Edge Pagination Indicators */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-10">
            {rightCards.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-[3px] h-3.5 rounded-full transition-colors duration-500 ${idx === currentIndex ? 'bg-[#9DFE51]' : 'bg-white/10'}`}
              ></div>
            ))}
          </div>
          
        </div>
      </div>

    </div>
  );
}