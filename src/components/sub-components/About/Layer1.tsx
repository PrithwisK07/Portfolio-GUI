import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { textSideA } from './aboutData';

export default function Layer1() {
  const layerRef = useRef<HTMLDivElement>(null);
  const purpleBoxRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const middleRingRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const maskRef = useRef<SVGCircleElement>(null);

  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);

  const imageA = "./asset/ss.png"; 
  const imageB = "./asset/ss1.png";

  const rightCards = [
    { id: 0, title: "Manifesto", label: "About Us", text: textSideA || "We are a creative studio pushing boundaries." },
    { id: 1, title: "Stacking Cards 3D (CSS)", label: "Scroll Animations", text: "Here is a sticky card. As you scroll, the next ones will dynamically stack on top..." },
    { id: 2, title: "Spatial Cards Slider", label: "Sliders & Marquees", text: "Immersive slider experience using GSAP and 3D transforms for seamless navigation." }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      const proxy = { radius: 170, tickLength: 4, strokeWidth: 1 }; 

      gsap.set([".mid-imgA", ".mid-imgB", ".in-imgA", ".in-imgB"], { xPercent: -50, yPercent: -50, top: "50%", left: "50%" });
      gsap.set([".outer-imgB", ".mid-imgB", ".in-imgB"], { opacity: 0 });
      gsap.set([".outer-imgA", ".mid-imgA", ".in-imgA"], { opacity: 1 });
      gsap.set([outerRingRef.current, middleRingRef.current, innerRingRef.current], { rotation: 0 });
      gsap.set(svgRef.current, { opacity: 0 });

      const initialC = 2 * Math.PI * proxy.radius;
      gsap.set(maskRef.current, { transformOrigin: "center", rotation: -90, strokeDasharray: initialC, strokeDashoffset: initialC });

      const buildStep = (ringRef: React.RefObject<HTMLDivElement | null>, imgOut: string | null, imgIn: string | null, targetRadius: number, targetTickLength: number, targetStrokeWidth: number, targetRotation: number, label: string) => {
        tl.to(proxy, {
          radius: targetRadius, tickLength: targetTickLength, strokeWidth: targetStrokeWidth, duration: 0.3, ease: "power2.inOut",
          onUpdate: () => {
            const r = proxy.radius; const l = proxy.tickLength; const sw = proxy.strokeWidth;
            purpleBoxRef.current?.querySelectorAll('.tick-line').forEach(line => {
              line.setAttribute('y1', String(240 - r - l)); line.setAttribute('y2', String(240 - r + l)); line.setAttribute('stroke-width', String(sw));
            });
            if (maskRef.current) maskRef.current.setAttribute('r', String(r));
          }
        }, `${label}-radius`);

        tl.call(() => {
          const c = 2 * Math.PI * proxy.radius;
          gsap.set(maskRef.current, { strokeDasharray: c, strokeDashoffset: c });
        });

        tl.to(maskRef.current, { strokeDashoffset: 0, duration: 0.5, ease: "linear" }, `${label}-timer`);
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

      tl.to(svgRef.current, { opacity: 1, duration: 0.3 }); 
      buildStep(middleRingRef, ".mid-imgA", ".mid-imgB", 170, 4, 1, 135, "jumb1-c2");
      buildStep(innerRingRef, ".in-imgA", ".in-imgB", 110, 3, 1, -90, "jumb1-c3");
      buildStep(outerRingRef, ".outer-imgA", ".outer-imgB", 230, 6, 2, 45, "jumb1-c1");
      tl.to(svgRef.current, { opacity: 0, duration: 0.3 }); tl.to({}, { duration: 0.5 }); 

      tl.to(svgRef.current, { opacity: 1, duration: 0.3 }); 
      buildStep(outerRingRef, null, null, 230, 6, 2, 0, "reass1-c1");
      buildStep(middleRingRef, null, null, 170, 4, 1, 0, "reass1-c2");
      buildStep(innerRingRef, null, null, 110, 3, 1, 0, "reass1-c3");
      tl.to(svgRef.current, { opacity: 0, duration: 0.3 }); tl.to({}, { duration: 2.5 }); 

      tl.to(svgRef.current, { opacity: 1, duration: 0.3 }); 
      buildStep(middleRingRef, ".mid-imgB", ".mid-imgA", 170, 4, 1, 135, "jumb2-c2");
      buildStep(innerRingRef, ".in-imgB", ".in-imgA", 110, 3, 1, -90, "jumb2-c3");
      buildStep(outerRingRef, ".outer-imgB", ".outer-imgA", 230, 6, 2, 45, "jumb2-c1");
      tl.to(svgRef.current, { opacity: 0, duration: 0.3 }); tl.to({}, { duration: 0.5 }); 

      tl.to(svgRef.current, { opacity: 1, duration: 0.3 }); 
      buildStep(outerRingRef, null, null, 230, 6, 2, 0, "reass2-c1");
      buildStep(middleRingRef, null, null, 170, 4, 1, 0, "reass2-c2");
      buildStep(innerRingRef, null, null, 110, 3, 1, 0, "reass2-c3");
      tl.to(svgRef.current, { opacity: 0, duration: 0.3 }); tl.to({}, { duration: 2.5 }); 

    }, purpleBoxRef); 
    return () => ctx.revert(); 
  }, []);

  const handleCardTransition = (direction: 'up' | 'down') => {
    if (isAnimating.current || !cardsContainerRef.current) return;
    isAnimating.current = true;
    
    const isUp = direction === 'up';
    const nextIndex = isUp ? (currentIndex + 1) % rightCards.length : (currentIndex - 1 + rightCards.length) % rightCards.length;
    const currentEl = cardsContainerRef.current.children[currentIndex] as HTMLElement;
    const nextEl = cardsContainerRef.current.children[nextIndex] as HTMLElement;

    gsap.set(nextEl, { display: 'flex', yPercent: isUp ? 100 : -100, rotationX: isUp ? -80 : 80, z: -300, opacity: 0, transformOrigin: isUp ? '50% 100%' : '50% 0%' });
    gsap.set(currentEl, { transformOrigin: isUp ? '50% 0%' : '50% 100%' });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(currentEl, { display: 'none' });
        setCurrentIndex(nextIndex);
        isAnimating.current = false;
      }
    });

    tl.to(currentEl, { yPercent: isUp ? -100 : 100, rotationX: isUp ? 80 : -80, z: -300, opacity: 0, duration: 0.85, ease: "power3.inOut" }, 0);
    tl.to(nextEl, { yPercent: 0, rotationX: 0, z: 0, opacity: 1, duration: 0.85, ease: "power3.inOut" }, 0);
  };

  const handleScrollToProjects = () => {
    const section = document.getElementById('work');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const renderPipes = () => {
    return Array.from({ length: 48 }).map((_, i) => {
      const angle = (i * 360) / 48;
      return (
        <g key={i} transform={`rotate(${angle} 240 240)`}>
          <line className="tick-line" x1="240" y1={240 - 170 - 4} x2="240" y2={240 - 170 + 4} stroke="white" strokeWidth="1" strokeLinecap="round" />
        </g>
      );
    });
  };

  return (
    <div 
      ref={layerRef} 
      className="layer1-scroll-wrapper relative w-full flex flex-col lg:flex-row items-center justify-start lg:justify-center px-4 md:px-8 py-0 lg:py-12 lg:pt-20 z-[1] gap-12 lg:gap-8 bg-white max-w-full mx-auto" 
    >
      
      {/* LEFT SIDE: Purple Interactive Container */}
      <div className="w-full lg:w-[45%] flex items-center justify-center lg:justify-end shrink-0 min-h-[60dvh] lg:min-h-0 lg:h-auto pt-24 lg:pt-0">
        <div 
          ref={purpleBoxRef} 
          className="relative w-full max-w-[420px] md:w-[85%] md:max-w-none lg:w-full lg:max-w-[600px] h-[360px] md:h-[450px] lg:h-[665px] bg-[#5e43f3] rounded-[2.5rem] lg:rounded-3xl overflow-hidden flex flex-col items-center justify-center shadow-2xl mx-auto lg:mx-0"
        >
          <div className="absolute top-6 left-6 md:top-8 md:left-10 lg:top-8 lg:left-10 text-white z-50 pointer-events-none">
            <h3 className="text-xl md:text-2xl lg:text-3xl opacity-90 font-brisa">Created by</h3>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-haffer-regular leading-none mt-1 lg:mt-2 tracking-tight">Prithwis</h1>
            <h2 className="text-lg md:text-xl lg:text-2xl font-haffer-light tracking-wide mt-1 opacity-90">Karmakar</h2>
          </div>

          <div className="relative w-[480px] h-[480px] flex items-center justify-center scale-[0.45] md:scale-[0.6] lg:scale-100 top-4 md:top-8 lg:top-15">
            <div ref={outerRingRef} className="absolute w-[440px] h-[440px] rounded-full overflow-hidden z-10">
              <img src={imageA} alt="Outer A" className="outer-imgA absolute inset-0 w-full h-full object-cover" />
              <img src={imageB} alt="Outer B" className="outer-imgB absolute inset-0 w-full h-full object-cover" />
            </div>
            <div ref={middleRingRef} className="absolute w-[320px] h-[320px] rounded-full overflow-hidden z-20">
              <div className="relative w-full h-full">
                <img src={imageA} alt="Middle A" className="mid-imgA absolute w-[440px] h-[440px] max-w-none object-cover" />
                <img src={imageB} alt="Middle B" className="mid-imgB absolute w-[440px] h-[440px] max-w-none object-cover" />
              </div>
            </div>
            <div ref={innerRingRef} className="absolute w-[200px] h-[200px] rounded-full overflow-hidden z-30">
              <div className="relative w-full h-full">
                <img src={imageA} alt="Inner A" className="in-imgA absolute w-[440px] h-[440px] max-w-none object-cover" />
                <img src={imageB} alt="Inner B" className="in-imgB absolute w-[440px] h-[440px] max-w-none object-cover" />
              </div>
            </div>
            <svg ref={svgRef} className="absolute w-[480px] h-[480px] pointer-events-none z-40" viewBox="0 0 480 480">
              <defs>
                <mask id="timer-mask"><circle ref={maskRef} cx="240" cy="240" r="170" stroke="white" strokeWidth="24" fill="none" /></mask>
              </defs>
              <g opacity="0.3">{renderPipes()}</g>
              <g mask="url(#timer-mask)">{renderPipes()}</g>
            </svg>
          </div>

          <button onClick={handleScrollToProjects} className="absolute bottom-6 md:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 text-[14px] lg:text-[15px] font-semibold tracking-wide rounded-[2px] z-50 hover:bg-gray-100 transition-colors cursor-pointer-custom whitespace-nowrap">
            See Projects
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: Osmo Pill Container */}
      <div className="w-full lg:w-[55%] flex items-center justify-center lg:justify-start shrink-0 min-h-[60dvh] lg:min-h-0 lg:h-auto pb-16 lg:pb-0">
        {/* Changed from rigid heights to min-h to let the container expand beautifully if the inner content requires it */}
        <div className="relative w-full max-w-[420px] md:w-[85%] md:max-w-none lg:w-full lg:max-w-[800px] min-h-[500px] md:min-h-[500px] lg:min-h-[665px] h-auto bg-[#201D1D] rounded-[3rem] lg:rounded-full flex flex-col justify-center lg:justify-between items-center py-8 lg:py-5 px-4 lg:px-15 shadow-2xl mx-auto lg:mx-0 overflow-hidden">
          
          <div className="hidden lg:block text-center mt-4 z-10 -space-y-1">
            <h3 className="text-[#9DFE51] font-haffer-regular font-medium text-lg tracking-wide">Latest updates</h3>
            <h3 className="text-[#f4f4f4] font-haffer-light tracking-wide opacity-90">from Osmo</h3>
          </div>
          
          {/* Changed items-center to items-stretch to let the grid dictate the height securely */}
          <div className="relative w-full max-w-[665px] flex-grow flex items-stretch justify-center" style={{ perspective: '1200px' }}>
            
            <div className="absolute top-0 left-0 w-full h-[40%] z-30 cursor-pointer-custom group flex justify-center items-start pt-2 lg:pt-10 pointer-events-auto" onClick={() => handleCardTransition('up')}>
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-transparent lg:bg-white text-white/50 lg:text-black border border-white/20 lg:border-none rounded-full flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 lg:translate-y-4 lg:group-hover:translate-y-0 shadow-none lg:shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[40%] z-30 cursor-pointer-custom group flex justify-center items-end pb-2 lg:pb-10 pointer-events-auto" onClick={() => handleCardTransition('down')}>
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-transparent lg:bg-white text-white/50 lg:text-black border border-white/20 lg:border-none rounded-full flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 lg:-translate-y-4 lg:group-hover:translate-y-0 shadow-none lg:shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              </div>
            </div>

            {/* Changed from absolute layout to CSS Grid layout to enable flawless shrink-wrapping */}
            <div ref={cardsContainerRef} className="grid w-[95%] lg:w-full pointer-events-none z-20 place-items-center" style={{ transformStyle: 'preserve-3d' }}>
              {rightCards.map((card, idx) => (
                // [grid-area:1/1] stacks them, while h-fit allows the container to dynamically scale up based on text
                <div key={card.id} className={`[grid-area:1/1] w-full bg-[#9DFE51] rounded-3xl lg:rounded-2xl p-4 lg:px-4 lg:py-2 flex flex-col lg:flex-row gap-4 lg:gap-3 items-stretch shadow-xl pointer-events-auto ${idx === 0 ? 'flex' : 'hidden'} h-fit lg:h-auto`} style={{ backfaceVisibility: 'hidden' }}>
                  
                  <div className="w-full lg:w-[45%] flex flex-col justify-center py-2 lg:py-0 px-2 lg:px-2">              
                    <h4 className="text-[#111] text-[26px] md:text-3xl font-haffer-regular font-medium leading-[1.1] tracking-tight text-center lg:text-left">{card.title}</h4>
                  </div>

                  {/* flex-grow ensures the dark box cleanly expands as text requires it */}
                  <div className="w-full lg:flex-grow bg-[#1A1F2B] lg:bg-gray-800 rounded-2xl lg:rounded-xl p-5 lg:p-6 flex flex-col justify-center shadow-2xl lg:shadow-inner border border-white/5 lg:border-none">
                    <h5 className="text-white/50 text-[11px] lg:text-xs mb-3 lg:mb-4 tracking-widest uppercase shrink-0">{card.label}</h5>
                    <p className="font-display text-[14px] md:text-[16px] lg:text-[17px] leading-relaxed lg:leading-snug tracking-tight text-[#f4f4f4]">
                      {card.text.split(' ').map((word, i) => (
                        <span key={i} className="inline-block overflow-hidden mr-1">
                          <span className="about-word-span inline-block transform translate-y-0">{word}</span>
                        </span>
                      ))}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block mb-6 z-10 w-1/4 pointer-events-none">
            <p className="text-[#9DFE51] text-2xl lg:text-3xl leading-5 text-center font-brisa opacity-90">
              New stuff is added every week!
            </p>
          </div>

          <div className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-10">
            {rightCards.map((_, idx) => (
              <div key={idx} className={`w-[3px] h-3.5 rounded-full transition-colors duration-500 ${idx === currentIndex ? 'bg-[#9DFE51]' : 'bg-white/10'}`}></div>
            ))}
          </div>
          
        </div>
      </div>

    </div>
  );
}