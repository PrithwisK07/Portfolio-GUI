import { useEffect, useRef, useState, RefObject } from 'react';
import gsap from 'gsap';
import { handleHoverAdd, handleHoverRemove } from '../CustomCursor';

interface Layer3Props {
  layer3Ref: RefObject<HTMLDivElement>;
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

    gsap.set(tvScreenRef.current, {
      width: "0vw",
      height: "1px",
      opacity: 1,
      pointerEvents: "auto"
    });

    tvTl.to(tvScreenRef.current, { width: "100vw", duration: 0.3, ease: "power4.inOut" })
      .to(tvScreenRef.current, { height: "100vh", duration: 0.6, ease: "expo.inOut" }, "+=0.1")
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

    tvTl.to(".tv-close-btn", { opacity: 0, duration: 0.2 })
      .to(tvScreenRef.current, { height: "1px", duration: 0.5, ease: "expo.inOut" })
      .to(tvScreenRef.current, { width: "0vw", duration: 0.3, ease: "power4.inOut" }, "+=0.1");

    gsap.to(".video-thumbnail-wrapper", { opacity: 1, duration: 0.3, delay: 0.8 });
  };

  return (
    <div ref={layer3Ref} className="absolute inset-0 z-[0] bg-gradient-to-b from-[#F8F8F8] to-[#F4F4F3] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Top Typography Header */}
      <div className="absolute top-[8%] max-w-4xl px-6 text-center z-10">
        <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tighter text-[#111]">
          Osmo is an ever-growing platform with Webflow & HTML resources. Get exclusive access to the elements, techniques and code behind award-winning work.
        </h2>
      </div>

      {/* Central Interactive Cluster - Pushed down to add spacing */}
      <div className="relative w-full h-full flex items-center justify-center mt-[25vh]">
        
        {/* Intersecting Crosshair Lines */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[5]">
          <div className="absolute w-full h-[1.5px] bg-[#c1c1c1] opacity-60"></div>
          {/* Height is oversized (200vh) to ensure it spans the whole screen even when pushed down */}
          <div className="absolute h-[200vh] w-[1.5px] bg-[#c1c1c1] opacity-60"></div>
        </div>

        {/* Circular Compass Ticks */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 z-[5]">
          {Array.from({ length: 72 }).map((_, i) => (
            <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${i * 5}deg)` }}>
              <div className="w-[1px] h-[5px] md:h-[8px] bg-black/40 translate-y-[-160px] md:translate-y-[-240px]" />
            </div>
          ))}
        </div>

        {/* Video & Floating Text Wrapper */}
        <div 
          className="video-thumbnail-wrapper group relative z-20 cursor-pointer flex flex-col items-center" 
          onClick={handleTvTurnOn} 
          onMouseEnter={handleHoverAdd} 
          onMouseLeave={handleHoverRemove}
        >
          {/* Dynamic 'Play' Text - Anchored to the left of the video */}
          <div className=" font-display absolute right-full top-1/2 -translate-y-1/2 mr-6 md:mr-12 transition-transform duration-500 ease-out group-hover:-translate-x-8 pointer-events-none">
            <span className="text-[14vw] md:text-[5vw] font-bold uppercase tracking-tighter text-[#D8D8D8]">Play</span>
          </div>

          {/* Dynamic 'Reel' Text - Anchored to the right of the video */}
          <div className="font-display absolute left-full top-1/2 -translate-y-1/2 ml-6 md:ml-12 transition-transform duration-500 ease-out group-hover:translate-x-6 pointer-events-none">
            <span className="text-[14vw] md:text-[5vw] font-bold uppercase tracking-tighter text-[#D8D8D8]">Reel</span>
          </div>

          {/* Small Video Player */}
          <div className="video-thumbnail w-[220px] md:w-[320px] h-[140px] md:h-[200px] bg-black/90 relative overflow-hidden flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-[1.03] rounded-xl md:rounded-lg">
            <video ref={thumbnailVideoRef} src="/asset/demo-kings-and-pig.mp4" muted loop playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none mt-3 scale-115" />
            <div className="absolute bottom-4 right-4 text-white text-xs tracking-wider z-10 bg-[#201D1D] px-1.5 py-0.5 rounded-s">00:29</div>
          </div>
          
          {/* See what it can do! Arrow */}
          <div className="absolute -bottom-16 right-0 md:right-[-70%] rotate-[-10deg] opacity-80 pointer-events-none flex items-end gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 32" fill="none" className="w-8 h-8 text-[#FF3B00] mb-8 scale-180 rotate-15">
              <path d="M-1.3266e-06 0.812487L1.24998 0.603613L1.62857 -0.000167918C1.45886 1.95803 4.50712 2.87186 5.21207 4.73215C5.42421 5.2935 4.76822 5.38815 4.56913 5.21191C4.52018 5.16948 4.33088 4.48411 3.92945 4.0631C3.5835 3.7041 2.02674 1.96782 1.63183 2.28114C2.1377 7.34635 3.34526 11.9905 5.93334 16.3998C11.2009 25.3846 20.7308 30.3095 30.9689 31.1385C15.8484 31.7782 2.73822 19.0694 1.29894 4.23934C0.443857 4.58202 1.35768 7.3594 -1.04856e-06 7.17337L-1.32646e-06 0.815748L-1.3266e-06 0.812487Z" fill="currentColor"></path>
            </svg>
            <span className="text-[#FF3B00] font-brisa text-2xl md:text-4xl">See what it can do!</span>
          </div>
        </div>

      </div>

      {/* The Expanding TV Screen Overlay (Changed to 'fixed' to perfectly span viewport on scroll) */}
      <div ref={tvScreenRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] z-[100] flex items-center justify-center overflow-hidden opacity-0 pointer-events-none">
        
        {/* Custom split pill close button */}
        <button 
          onClick={handleTvTurnOff}
          className="tv-close-btn absolute top-6 right-6 md:top-10 md:right-10 z-[60] opacity-0 cursor-pointer flex items-center gap-1 group pointer-events-auto"
          onMouseEnter={handleHoverAdd} 
          onMouseLeave={handleHoverRemove}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#2E2E2E] hover:bg-[#3A3A3A] transition-colors rounded-full flex items-center justify-center text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div className="h-10 md:h-12 bg-[#2E2E2E] hover:bg-[#3A3A3A] transition-colors rounded-lg flex items-center justify-center px-4 md:px-5">
            <span className="text-white font-medium text-sm md:text-base tracking-wide">Close</span>
          </div>
        </button>

        <video ref={fullVideoRef} muted loop playsInline preload="auto" className="w-full h-full object-cover -mt-20 scale-110 pointer-events-none">
          <source src="/asset/demo-large.mp4" type="video/mp4" />
        </video>
      </div>

    </div>
  );
}