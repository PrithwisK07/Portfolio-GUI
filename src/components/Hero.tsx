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

    const ctx = gsap.context(() => {
      // Dynamically calculate exactly how far Step 2 & 3 need to move right
      // to align perfectly with the left edge of Step 1.
      const getOffset = (el: HTMLElement | null) => {
        if (!step1Ref.current || !el) return 0;
        const offset = el.offsetWidth - step1Ref.current.offsetWidth;
        return offset > 0 ? offset : 0; // Ensures it doesn't break on mobile where widths match
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          // The animation finishes when the bottom of this 200vh wrapper reaches 40% from the top of the screen.
          // This means the NEXT section will already be covering the bottom 60% of the screen, achieving that perfect overlapping pull-up effect.
          end: "bottom 40%", 
          scrub: 1, // Smoothly link animation to scroll progress
          invalidateOnRefresh: true, // Recalculates widths perfectly if user resizes window
        }
      });

      // Retract Step 2
      tl.to(step2Ref.current, {
        x: () => getOffset(step2Ref.current),
        ease: "none"
      }, 0);

      // Retract Step 3
      tl.to(step3Ref.current, {
        x: () => getOffset(step3Ref.current),
        ease: "none"
      }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Smooth Lerp Follow for "Play Reel"
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  // Elastic Snap Back
  const handleMouseLeave = () => {
    if (!textRef.current) return;
    gsap.to(textRef.current, {
      x: 0,
      y: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto"
    });
  };

  return (
    // Outer Wrapper creates the scroll distance (200vh) to allow for scrubbing without moving the page down
    <section ref={sectionRef} className="relative w-full h-[150vh] md:h-[200vh]">
      
      {/* Inner Wrapper sticks to the screen while you scroll through the 200vh space */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505] text-[#050505]">
        
        {/* Background Video */}
        <video 
          className="absolute top-0 left-0 w-full h-full scale-115 object-cover z-0 pointer-events-none" 
          src="/asset/demo-kings-and-pig.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline 
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none"></div>

        {/* Interactive Area for Play Reel */}
        <div 
          className="absolute inset-0 z-[2] cursor-default" 
          onMouseMove={handleMouseMove} 
          onMouseLeave={handleMouseLeave}
        >
          {/* Invisible Anchor Point for the custom cursor text */}
          <div ref={anchorRef} className="absolute top-1/2 left-[20vw] md:left-[25vw] w-0 h-0">
            <div 
              ref={textRef} 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max text-white text-sm font-medium tracking-wider text-center mix-blend-difference pointer-events-none reveal-fade opacity-0"
            >
              Play Reel<br/>(00:33)
            </div>
          </div>
        </div>

        {/* --- THE THREE STAGGERED WHITE STEPS --- */}
        
        {/* Step 1: Top Right */}
        <div ref={step1Ref} className="hero-step absolute top-0 right-0 w-[100%] md:w-[50vw] lg:w-[45vw] h-[30vh] bg-white z-[10] flex items-start justify-between p-8 md:p-12 pt-24 md:pt-12">
            <div className="reveal-text-wrapper"><span className="reveal-text text-xs md:text-sm font-bold tracking-wide">Work, Services, About</span></div>
            <div className="reveal-text-wrapper"><span className="reveal-text text-xs md:text-sm font-bold tracking-wide border-b-2 border-black pb-1 cursor-pointer-custom">Start a project</span></div>
        </div>

        {/* Step 2: Middle Right */}
        <div ref={step2Ref} className="hero-step absolute top-[30vh] right-0 w-[100%] md:w-[70vw] lg:w-[65vw] h-[40vh] bg-white z-[10] p-8 md:p-12 flex flex-col justify-center">
            <div className="absolute top-8 left-8 text-sm font-medium hidden md:block">
              <div className="reveal-text-wrapper"><span className="reveal-text">(01)</span></div>
            </div>
            <div className="flex gap-12 text-xs md:text-sm mb-6 font-medium mt-8 md:mt-0 ml-0 md:ml-24 lg:ml-32">
                <div className="reveal-text-wrapper"><span className="reveal-text">Strategic<br/>design partner</span></div>
                <div className="reveal-text-wrapper"><span className="reveal-text">+ Digital<br/>Production House</span></div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tighter ml-0 md:ml-24 lg:ml-32">
                <div className="reveal-text-wrapper"><span className="reveal-text">Designing Tomorrow&apos;s</span></div><br/>
                <div className="reveal-text-wrapper"><span className="reveal-text">Creative Landscape</span></div><br/>
                <div className="reveal-text-wrapper"><span className="reveal-text">with The Unseen.</span></div>
            </h1>
        </div>

        {/* Step 3: Bottom Right (Giant Text) */}
        <div ref={step3Ref} className="hero-step absolute bottom-0 right-0 w-[100%] md:w-[90vw] lg:w-[85vw] h-[30vh] bg-white z-[10] p-8 md:p-12 flex items-end">
            <h2 className="font-display text-[22vw] md:text-[14vw] leading-[0.75] tracking-tighter uppercase w-full font-bold">
                <div className="reveal-text-wrapper w-full"><span className="reveal-text">REALITIES</span></div>
            </h2>
        </div>

      </div>
    </section>
  );
}