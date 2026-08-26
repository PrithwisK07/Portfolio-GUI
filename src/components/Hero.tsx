"use client";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const step1Ref = useRef<HTMLDivElement | null>(null);
  const step2Ref = useRef<HTMLDivElement | null>(null);
  const step3Ref = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isDesktop } = context.conditions as { isDesktop: boolean, isMobile: boolean };

      if (isDesktop) {
        // DESKTOP LOGIC: Horizontal Scrubbing 
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom 40%", 
            scrub: 1, 
            invalidateOnRefresh: true, 
          }
        });

        const getOffset = (el: HTMLElement | null) => {
          if (!step1Ref.current || !el) return 0;
          const offset = el.offsetWidth - step1Ref.current.offsetWidth;
          return offset > 0 ? offset : 0; 
        };

        gsap.set([step1Ref.current, step2Ref.current, step3Ref.current], { y: 0 });

        tl.to(step2Ref.current, { x: () => getOffset(step2Ref.current), ease: "none" }, 0);
        tl.to(step3Ref.current, { x: () => getOffset(step3Ref.current), ease: "none" }, 0);
        
      } else {
        // MOBILE LOGIC: Vertical Slide-Up Reveal with a "Hold" at the end
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom", 
            scrub: 1, 
            invalidateOnRefresh: true, 
          }
        });

        gsap.set(step1Ref.current, { y: '100vh', x: 0 });
        gsap.set(step2Ref.current, { y: '100vh', x: 0 });
        gsap.set(step3Ref.current, { y: '100vh', x: 0 });

        tl.to(step1Ref.current, { y: 0, ease: "power2.out", duration: 0.3 }, 0)
          .to(step2Ref.current, { y: 0, ease: "power2.out", duration: 0.3 }, 0.1)
          .to(step3Ref.current, { y: 0, ease: "power2.out", duration: 0.3 }, 0.2)
          .to({}, { duration: 0.4 });
      }
    });

    return () => mm.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(hover: none)").matches) return;
    
    if (!anchorRef.current || !textRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const deltaX = e.clientX - rect.left;
    const deltaY = e.clientY - rect.top;

    gsap.to(textRef.current, {
      x: deltaX,
      y: deltaY,
      duration: 0.7,
      ease: "power3.out",
      overwrite: "auto"
    });
  };

  const handleMouseLeave = () => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (!textRef.current) return;
    gsap.to(textRef.current, {
      x: 0,
      y: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto"
    });
  };

  const handleVideoClick = () => {
    if (typeof window !== 'undefined') {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo('#about', { 
          duration: 1.5, 
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
        });
      } else {
        document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full h-[150vh] md:h-[200vh]">
      
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505] text-[#050505]">
        
        <video 
          className="absolute top-0 left-0 w-full h-full scale-115 object-cover z-0 pointer-events-none" 
          preload="auto"
          autoPlay 
          muted 
          loop 
          playsInline 
        >
          <source src="/asset/demo-kings-and-pig.mp4?v=1" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none"></div>

        {/* DESKTOP CURSOR OVERLAY */}
        <div 
          className="hidden md:block absolute inset-0 z-[2] cursor-pointer-custom mix-blend-difference" 
          onMouseMove={handleMouseMove} 
          onMouseLeave={handleMouseLeave}
          onClick={handleVideoClick}
        >
          <div ref={anchorRef} className="absolute top-1/2 left-[20vw] md:left-[25vw] w-0 h-0">
            <div 
              ref={textRef} 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max text-white text-xl font-haffer-regular font-medium tracking-wider text-center pointer-events-none reveal-fade opacity-0"
            >
              Play Reel<br/>(00:33)
            </div>
          </div>
        </div>

        {/* MOBILE CTA BUTTON */}
        <div className="md:hidden absolute bottom-[15vh] left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-3">
          <button 
            onClick={handleVideoClick}
            className="reveal-fade opacity-0 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full px-6 py-3 font-haffer-regular tracking-wide text-sm flex items-center gap-2 active:bg-white/20 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            Play Reel (00:33)
          </button>
          <span className="reveal-fade opacity-0 text-white/50 text-xs font-haffer-light tracking-widest uppercase mt-2">
            Scroll to discover
          </span>
        </div>

        {/* --- THE THREE STAGGERED WHITE STEPS --- */}
        
        {/* Step 1: Fixed Nav overlap. Now items-end on mobile, items-center on desktop */}
        <div ref={step1Ref} className="hero-step absolute top-0 right-0 w-full md:w-[50vw] lg:w-[45vw] h-[30vh] bg-[#f4f4f5] z-[10] flex items-end md:items-center justify-start p-6 pb-8 md:p-8 lg:p-12 pt-28 md:pt-8">
            <div className="reveal-text-wrapper max-w-sm">
                <p className="reveal-text text-lg md:text-lg font-haffer-regular text-gray-700 font-medium leading-relaxed">
                    I craft immersive digital experiences at the intersection of design, technology and human emotion.
                </p>
            </div>
        </div>

        {/* Step 2: Unchanged */}
        <div ref={step2Ref} className="hero-step absolute top-[30vh] right-0 w-full md:w-[70vw] lg:w-[65vw] h-[40vh] bg-[#f4f4f5] z-[10] p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            <div className="relative w-full md:w-fit md:ml-16 lg:ml-24">
              
              <h1 className="font-display text-[25vw] md:text-[16vh] leading-[0.8] tracking-tighter font-medium text-[#1a1a1a]">
                  <div className="reveal-text-wrapper"><span className="reveal-text">Design<span className="text-[#5B50FF]">.</span></span></div><br/>
                  <div className="reveal-text-wrapper"><span className="reveal-text">Code<span className="text-[#9DFF3B]">.</span></span></div>
              </h1>

              <div className="absolute -top-12 right-2 md:-top-10 md:-right-48 lg:-right-66 z-20">
                <div className="reveal-text-wrapper overflow-visible">
                  <div className="reveal-text flex flex-col items-center">
                    <span className="font-brisa text-[#5B50FF] text-2xl md:text-4xl lg:text-5xl tracking-wide whitespace-nowrap">Hey! I'm Prithwis</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 32" fill="none" className="w-5 h-5 md:w-8 md:h-8 text-[#5B50FF] ml-4 md:ml-10 rotate-[-90deg] scale-y-180">
                      <path d="M-1.3266e-06 0.812487L1.24998 0.603613L1.62857 -0.000167918C1.45886 1.95803 4.50712 2.87186 5.21207 4.73215C5.42421 5.2935 4.76822 5.38815 4.56913 5.21191C4.52018 5.16948 4.33088 4.48411 3.92945 4.0631C3.5835 3.7041 2.02674 1.96782 1.63183 2.28114C2.1377 7.34635 3.34526 11.9905 5.93334 16.3998C11.2009 25.3846 20.7308 30.3095 30.9689 31.1385C15.8484 31.7782 2.73822 19.0694 1.29894 4.23934C0.443857 4.58202 1.35768 7.3594 -1.04856e-06 7.17337L-1.32646e-06 0.815748L-1.3266e-06 0.812487Z" fill="currentColor"></path>
                    </svg>
                  </div>
                </div>
              </div>

            </div>
        </div>

        {/* Step 3: Fixed Overflow. Adjusted size to 11.5vw and changed mobile alignment to items-center */}
        <div ref={step3Ref} className="hero-step absolute bottom-0 right-0 w-full md:w-[90vw] lg:w-[85vw] h-[30vh] bg-[#f4f4f5] z-[10] p-6 md:p-8 lg:p-12 flex items-center md:items-end">
            <h2 className="font-display text-[11.5vw] md:text-[13vw] lg:text-[12.5vw] leading-[0.75] uppercase w-full font-bold text-[#1a1a1a]">
                <div className="reveal-text-wrapper w-full">
                  <span className="reveal-text flex justify-between w-full">
                    <span>E</span><span>X</span><span>P</span><span>E</span><span>R</span><span>I</span><span>E</span><span>N</span><span>C</span><span>E</span><span className="text-[#FF3B00]">.</span>
                  </span>
                </div>
            </h2>
        </div>

      </div>
    </section>
  );
}