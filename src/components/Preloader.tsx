"use client";
import { useEffect } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" }
      });

      // 0. Reveal the actual Navigation immediately
      tl.fromTo(".global-nav-reveal", 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1.25 },
        0
      );

      // 1. Initial letter reveal ("A e t" and "h e r")
      tl.fromTo(".willem__letter", 
        { yPercent: 100 },
        { yPercent: 0, stagger: 0.025, duration: 1.25 },
        0 
      );

      // 2. Open the image box space
      tl.fromTo(".willem-loader__box",
        { width: "0em" },
        { width: "1em", duration: 1.25 },
        "< 1.25"
      );
      tl.fromTo(".willem__growing-image",
        { width: "0%" },
        { width: "100%", duration: 1.25 },
        "<"
      );

      // 3. Shift the heading start/end outwards for spacing
      tl.fromTo(".willem__h1-start",
        { x: "0em" },
        { x: "-0.05em", duration: 1.25 },
        "<"
      );
      tl.fromTo(".willem__h1-end",
        { x: "0em" },
        { x: "0.05em", duration: 1.25 },
        "<"
      );

      // 4. Staggered image flash
      tl.fromTo(".willem__cover-image-extra",
        { opacity: 1 },
        { opacity: 0, duration: 0.05, ease: "none", stagger: 0.5 },
        "-=0.05"
      );

      // 5. Expand final element (the Video) to full screen
      tl.to(".willem__growing-image",
        { width: "100vw", height: "100vh", scale: 1.15, duration: 2 },
        "< 1.25"
      );
      tl.to(".willem-loader__box",
        { width: "100vw", duration: 2 },
        "<"
      );

      // 6. Seamless Handoff
      tl.set('.preloader', { autoAlpha: 0 });

      // 7. Slide in the 3 White Steps from the Right
      tl.fromTo('.hero-step',
        { xPercent: 100 },
        { xPercent: 0, duration: 1.4, stagger: 0.15, ease: 'expo.inOut' }
      );

      // 8. Trigger Text Reveal inside the steps 
      // FIX: Changed from yPercent to y: "110%" and y: "0%" to properly override global.css
      tl.fromTo('.reveal-text', 
        { y: "110%" }, 
        { y: "0%", duration: 1.2, stagger: 0.05, ease: 'power4.out' },
        "-=0.8"
      );

      // 9. Fade in the circular "Play Reel" button
      tl.fromTo('.reveal-fade',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' },
        "< 0.5"
      );

    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="preloader fixed inset-0 z-[10000] bg-[#f4f4f4] text-[#201d1d] flex justify-center items-center overflow-hidden font-display">
      <div className="willem-loader flex justify-center items-center w-full h-full absolute top-0 left-0 overflow-hidden">
        
        <div className="willem__h1 flex w-full relative text-[5.5em] md:text-[9em] lg:text-[12.5em] font-medium leading-[0.75] whitespace-nowrap justify-center">
          
          <div className="willem__h1-start flex justify-end flex-1 overflow-hidden">
            <span className="willem__letter block relative">A</span>
            <span className="willem__letter block relative">e</span>
            <span className="willem__letter block relative">t</span>
          </div>

          <div className="willem-loader__box flex flex-col justify-center items-center w-0 relative">
            <div className="willem-loader__box-inner flex justify-center items-center min-w-[1em] h-full relative">
              <div className="willem__growing-image flex justify-center items-center w-0 h-full absolute overflow-hidden">
                <div className="willem__growing-image-wrap absolute w-full min-w-[1em] h-full">
                  
                  <img
                    className="willem__cover-image-extra absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none z-[3]"
                    src="/asset/layer1.png" 
                    alt="Section Screenshot 1"
                    loading="lazy"
                  />
                  <img
                    className="willem__cover-image-extra absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none z-[2]"
                    src="/asset/layer2.png"
                    alt="Section Screenshot 2"
                    loading="lazy"
                  />
                  <img
                    className="willem__cover-image-extra absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none z-[1]"
                    src="/asset/layer3.png"
                    alt="Section Screenshot 3"
                    loading="lazy"
                  />
                  
                  <video 
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    preload="auto"
                  >
                    {/* The ?v=1 acts as a cache-buster for this specific Chrome bug */}
                    <source src="/asset/demo-kings-and-pig.mp4?v=1" type="video/mp4" />
                  </video>
                  
                </div>
              </div>
            </div>
          </div>

          <div className="willem__h1-end flex justify-start flex-1 overflow-hidden">
            <span className="willem__letter block relative">h</span>
            <span className="willem__letter block relative">e</span>
            <span className="willem__letter block relative">r</span>
          </div>
          
        </div>

      </div>
    </div>
  );
}