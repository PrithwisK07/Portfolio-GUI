import { useEffect, useRef, useState, RefObject } from 'react';
import gsap from 'gsap';

interface Layer3Props {
  layer3Ref: RefObject<HTMLDivElement | null>;
}

export default function Layer3({ layer3Ref }: Layer3Props) {
  const tvScreenRef = useRef<HTMLDivElement>(null);
  const fullVideoRef = useRef<HTMLVideoElement>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);

  useEffect(() => {
    if (thumbnailVideoRef.current) {
      thumbnailVideoRef.current.muted = true;
      thumbnailVideoRef.current.play().catch((err) => {
        console.warn("Thumbnail video autoplay blocked:", err);
      });
    }
  }, []);

  const handleTvTurnOn = () => {
    if (isVideoExpanded || !tvScreenRef.current) return;
    setIsVideoExpanded(true);

    if (fullVideoRef.current) {
      fullVideoRef.current.load();
      fullVideoRef.current.play().catch(err => console.warn("Video play error:", err));
    }

    const tvTl = gsap.timeline();
    
    gsap.to(".video-thumbnail-wrapper", { opacity: 0, duration: 0.2 });
    gsap.to("#main-nav", { opacity: 0, duration: 0.3, pointerEvents: "none" });
    gsap.to("#main-nav", { display: "none", delay: 0.3});

    gsap.set(tvScreenRef.current, {
      width: "0vw",
      height: "0px",
      opacity: 1,
      pointerEvents: "auto"
    });

    tvTl.to(tvScreenRef.current, { width: "102vw", duration: 0.3, ease: "power4.inOut" })
      .to(tvScreenRef.current, { height: "102dvh", duration: 0.6, ease: "expo.inOut" }, "+=0.1")
      .to(".tv-close-btn", { opacity: 1, duration: 0.3 });
  };

  const handleTvTurnOff = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isVideoExpanded || !tvScreenRef.current) return;
    
    const tvTl = gsap.timeline({
      onComplete: () => {
        setIsVideoExpanded(false);
        if (fullVideoRef.current) fullVideoRef.current.pause();
        gsap.set(tvScreenRef.current, { pointerEvents: "none", opacity: 0 });
      }
    });

    gsap.to("#main-nav", { opacity: 1, duration:0.7});
    gsap.to("#main-nav", { display: "flex", delay: 0.7});

    tvTl.to(".tv-close-btn", { opacity: 0, duration: 0.2 })
      .to(tvScreenRef.current, { height: "0px", duration: 0.5, ease: "expo.inOut" })
      .to(tvScreenRef.current, { width: "0vw", duration: 0.3, ease: "power4.inOut" }, "+=0.1");

    gsap.to(".video-thumbnail-wrapper", { opacity: 1, duration: 0.3, delay: 0.8 });
  };

  return (
    <div ref={layer3Ref} className="absolute inset-0 z-[0] bg-gradient-to-b from-[#F8F8F8] to-[#F4F4F3] flex flex-col items-center justify-center overflow-hidden">
      
      <div className="absolute top-[10%] md:top-[10%] lg:top-[8%] max-w-[90%] md:max-w-3xl lg:max-w-4xl px-4 md:px-6 text-center z-10">
        <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-snug md:leading-tight lg:leading-[3.25rem] text-[#111]">
          Osmo is an ever-growing platform with Webflow & HTML resources. Get exclusive access to the elements, techniques and code behind award-winning work.
        </h2>
      </div>

      <div className="relative w-full h-full flex items-center justify-center mt-[15vh] md:mt-[20vh] lg:mt-[25vh]">
        
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[5]">
          <div className="absolute w-full h-[1.5px] bg-[#c1c1c1] opacity-60"></div>
          <div className="absolute h-[200vh] w-[1.5px] bg-[#c1c1c1] opacity-60"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
          {Array.from({ length: 75 }).map((_, i) => (
            <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${i * 5}deg)` }}>
              <div className={`h-[5px] md:h-[6px] lg:h-[8px] ${i % 5 !== 0 ? 'bg-[#565555]/40 w-[1px]' : 'bg-[#9DFE51] w-[2px] md:w-[3px] h-[8px] md:h-[10px] lg:h-[14px]'} translate-y-[-48vw] md:translate-y-[-42vw] lg:translate-y-[-240px]`} />
            </div>
          ))}
        </div>

        <div 
          className="video-thumbnail-wrapper group relative z-20 cursor-pointer-custom flex flex-col items-center"
          onClick={handleTvTurnOn}
        >
          <div className="font-display absolute bottom-full left-1/2 -translate-x-1/2 translate-y-5 mb-3 md:mb-5 lg:bottom-auto lg:left-auto lg:right-full lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:mb-0 lg:mr-12 transition-transform duration-500 ease-out lg:group-hover:-translate-x-8 pointer-events-none">
            <span className="text-[14vw] md:text-[10vw] lg:text-[5vw] font-bold uppercase tracking-tighter text-[#D8D8D8]">Play</span>
          </div>

          <div className="font-display absolute top-full left-1/2 -translate-x-1/2 -translate-y-5 mt-3 md:mt-5 lg:top-1/2 lg:left-full lg:-translate-y-1/2 lg:translate-x-0 lg:mt-0 lg:ml-12 transition-transform duration-500 ease-out lg:group-hover:translate-x-6 pointer-events-none">
            <span className="text-[14vw] md:text-[10vw] lg:text-[5vw] font-bold uppercase tracking-tighter text-[#D8D8D8]">Reel</span>
          </div>

          <div className="video-thumbnail w-[85vw] md:w-[75vw] lg:w-[320px] h-[55vw] md:h-[48vw] lg:h-[200px] bg-black/90 relative overflow-hidden flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-[1.03] rounded-[1.25rem] lg:rounded-lg z-10">
            <video ref={thumbnailVideoRef} src="/asset/demo-kings-and-pig.mp4" muted loop playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none mt-3 scale-115" />
            <div className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 text-white text-[11px] lg:text-xs tracking-wider z-10 bg-[#201D1D] px-1.5 py-0.5 rounded-sm">00:29</div>
          </div>
          
          {/* Arrow FIX: flex-row-reverse on mobile shifts the arrow to the right, lg:flex-row resets it to the left. Re-centered horizontally. */}
          <div className="absolute top-full mt-[4vw] left-1/2 -translate-x-1/2 lg:translate-x-0 md:mt-[3vw] lg:top-auto lg:left-auto lg:-bottom-16 lg:right-[-70%] rotate-0 lg:rotate-[-10deg] opacity-80 pointer-events-none flex flex-row-reverse lg:flex-row items-center lg:items-end gap-1.5 lg:gap-2 w-max">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 32" fill="none" className="w-6 h-6 md:w-8 md:h-8 text-[#FF3B00] -mt-3 lg:mt-0 lg:mb-8 [transform:scaleX(-1.5)_scaleY(1.8)] md:[transform:scaleX(-1.8)_scaleY(2)] lg:[transform:scaleX(1.8)_scaleY(1.8)] rotate-[-15deg] lg:rotate-15">
              <path d="M-1.3266e-06 0.812487L1.24998 0.603613L1.62857 -0.000167918C1.45886 1.95803 4.50712 2.87186 5.21207 4.73215C5.42421 5.2935 4.76822 5.38815 4.56913 5.21191C4.52018 5.16948 4.33088 4.48411 3.92945 4.0631C3.5835 3.7041 2.02674 1.96782 1.63183 2.28114C2.1377 7.34635 3.34526 11.9905 5.93334 16.3998C11.2009 25.3846 20.7308 30.3095 30.9689 31.1385C15.8484 31.7782 2.73822 19.0694 1.29894 4.23934C0.443857 4.58202 1.35768 7.3594 -1.04856e-06 7.17337L-1.32646e-06 0.815748L-1.3266e-06 0.812487Z" fill="currentColor"></path>
            </svg>
            <span className="text-[#FF3B00] font-brisa text-2xl md:text-3xl lg:text-4xl whitespace-nowrap pt-9 md:pt-15 lg:pt-0">See what it can do!</span>
          </div>
        </div>

      </div>

      <div ref={tvScreenRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] z-[100] flex items-center justify-center overflow-hidden opacity-0 pointer-events-none">
        <button 
          onClick={handleTvTurnOff} 
          className="tv-close-btn absolute top-6 right-6 md:top-8 md:right-8 lg:top-10 lg:right-10 z-[100] opacity-0 cursor-pointer-custom flex items-center gap-1 group pointer-events-auto"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#2E2E2E] active:bg-[#444] group-hover:bg-[#3A3A3A] transition-colors rounded-full flex items-center justify-center text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div className="hidden md:flex h-12 bg-[#2E2E2E] group-hover:bg-[#3A3A3A] transition-colors rounded-lg items-center justify-center px-4 lg:px-5">
            <span className="text-white font-medium text-sm lg:text-base tracking-wide">Close</span>
          </div>
        </button>

        <video ref={fullVideoRef} muted loop playsInline preload="auto" className="w-full h-full object-cover md:-mt-20 md:scale-110 pointer-events-none">
          <source src="/asset/demo-large.mp4" type="video/mp4" />
        </video>
      </div>

    </div>
  );
}