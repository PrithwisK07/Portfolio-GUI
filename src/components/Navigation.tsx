"use client";
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Navigation() {
  const [isPinned, setIsPinned] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isPinnedRef = useRef(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isDesktop, isMobile } = context.conditions as { isDesktop: boolean, isMobile: boolean };

      // Dynamic initial sizes based on device
      const initialWidth = isMobile ? 110 : 140;
      const initialHeight = isMobile ? 48 : 64;
      const initialRadius = isMobile ? 24 : 36;
      const expandedWidth = isMobile ? window.innerWidth - 48 : 260;

      // Set initial pill size
      gsap.set(menuContainerRef.current, { 
        width: initialWidth, 
        height: initialHeight, 
        borderRadius: initialRadius 
      });

      // Expand Timeline
      tl.current = gsap.timeline({ paused: true })
        .to(menuContainerRef.current, { 
           width: expandedWidth, 
           height: 320, 
           duration: 0.6, 
           borderRadius: 24,
           ease: 'power4.inOut' 
        })
        .to('.dots-icon', { 
           rotate: 90, 
           duration: 0.6, 
           ease: 'power4.inOut' 
        }, "<")
        .fromTo('.menu-links-container', 
          { autoAlpha: 0 }, 
          { autoAlpha: 1, duration: 0.3 },
          "-=0.3"
        )
        .fromTo('.menu-item-link', 
          { y: 20, opacity: 1 }, 
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' },
          "-=0.3"
        );

      if (isDesktop) {
        ScrollTrigger.create({
          start: 1500, 
          onEnter: () => {
            gsap.to('.inline-nav', { y: -20, opacity: 0, display: 'none', duration: 0.3, pointerEvents: 'none' });
            gsap.to('.pill-nav', { y: 0, opacity: 1, display: 'flex', duration: 0.3, pointerEvents: 'auto' });
          },
          onLeaveBack: () => {
            gsap.to('.pill-nav', { y: -20, opacity: 0, display: 'none', duration: 0.3, pointerEvents: 'none' });
            gsap.to('.inline-nav', { y: 0, opacity: 1, display: 'flex', duration: 0.3, pointerEvents: 'auto' });
          }
        });
      } else {
        gsap.set('.inline-nav', { display: 'none' });
        gsap.set('.pill-nav', { y: 0, opacity: 1, display: 'flex', pointerEvents: 'auto' });
      }
    });

    return () => mm.revert();
  }, []);

  const playAnim = () => {
    tl.current?.play();
    setIsExpanded(true);
  };

  const reverseAnim = () => {
    tl.current?.reverse();
    setIsExpanded(false);
  };

  const onMouseEnter = () => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (!isPinnedRef.current) playAnim();
  };

  const onMouseLeave = () => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (!isPinnedRef.current) reverseAnim();
  };

  const onClickToggle = () => {
    const lenis = (window as any).lenis;
    
    if (isExpanded) {
      isPinnedRef.current = false;
      setIsPinned(false);
      reverseAnim();
      if (lenis) lenis.start();
    } else {
      isPinnedRef.current = true;
      setIsPinned(true);
      playAnim();
      if (lenis) lenis.stop();
    }
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, target: string) => {
    e.preventDefault();
    const lenis = (window as any).lenis;

    isPinnedRef.current = false;
    setIsPinned(false);
    reverseAnim();
    if (lenis) lenis.start();

    if (lenis) {
      setTimeout(() => {
        lenis.scrollTo(target, { 
          duration: 1.5, 
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }, isExpanded ? 600 : 0); 
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <>
      <div className="global-nav-reveal opacity-0 fixed top-0 left-0 w-full p-6 md:p-10 flex justify-start items-start z-[10001] pointer-events-none mix-blend-difference">
        <div 
          className="font-display font-bold text-xl tracking-tighter cursor-pointer-custom pointer-events-auto mt-2 md:mt-0 text-white pt-2 md:pt-0" 
          onClick={(e) => handleScrollTo(e, 'top')}
          id="main-logo"
        >
          AETHER ©
        </div>
      </div>
      
      <nav className="global-nav-reveal opacity-0 fixed top-0 left-0 w-full p-6 md:p-10 flex justify-end items-start z-[10001] pointer-events-none" id="main-nav">
        
        {/* INLINE NAV */}
        <div className="inline-nav absolute top-6 md:top-10 right-6 md:right-10 hidden md:flex items-center gap-8 text-black mix-blend-difference pointer-events-auto font-medium text-base tracking-wide z-10 transition-opacity">
           {menuLinks.map((link) => (
             <a 
               key={`inline-${link.label}`}
               href={link.href}
               onClick={(e) => handleScrollTo(e, link.href)}
               className="hover:opacity-60 transition-opacity cursor-pointer-custom text-black"
             >
               {link.label}
             </a>
           ))}
        </div>

        {/* PILL NAV */}
        <div className="pill-nav absolute top-6 md:top-10 right-6 md:right-10 pointer-events-none opacity-0 -translate-y-5 z-20">
          <div className="flex items-start gap-8 text-sm font-medium tracking-wide pointer-events-auto">
            {/* Added responsive w/h classes to match initial GSAP state */}
            <div className="relative w-[110px] md:w-[140px] h-[48px] md:h-[64px] max-w-[calc(100vw-48px)]">
              <div 
                ref={menuContainerRef} 
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className="absolute top-0 right-0 bg-[#ff4d00] text-white overflow-hidden shadow-2xl"
              >
                <div className="menu-links-container invisible absolute top-0 left-0 w-full p-6 pt-8 flex flex-col gap-3 md:gap-2">
                  {menuLinks.map((link) => (
                    <a 
                      key={link.label} 
                      href={link.href} 
                      onClick={(e) => handleScrollTo(e, link.href)}
                      className="menu-item-link relative group w-fit font-palma-heavy text-4xl md:text-3xl font-bold uppercase tracking-tight text-white transition-opacity"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ))}
                </div>
                {/* Updated bottom bar height and text sizes */}
                <div 
                  className="absolute bottom-0 left-0 w-full h-[48px] md:h-[64px] flex items-center justify-between px-4 md:px-5 cursor-pointer-custom" 
                  onClick={onClickToggle}
                >
                  <span className="font-palma-heavy text-[14px] md:text-[18px] tracking-widest uppercase mt-1">
                    {isExpanded ? 'Close' : 'Menu'}
                  </span>
                  <div className="dots-icon grid grid-cols-2 gap-[2px] md:gap-[3px]">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </nav>
    </>
  );
}