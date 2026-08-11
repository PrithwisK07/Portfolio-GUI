"use client";
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

export default function Navigation() {
  const [isPinned, setIsPinned] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isPinnedRef = useRef(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial pill size
      gsap.set(menuContainerRef.current, { width: 140, height: 64, borderRadius: 36 });

      tl.current = gsap.timeline({ paused: true })
        .to(menuContainerRef.current, { 
           width: 260, 
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
    });

    return () => ctx.revert();
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
    if (!isPinnedRef.current) {
      playAnim();
    }
  };

  const onMouseLeave = () => {
    if (!isPinnedRef.current) {
      reverseAnim();
    }
  };

  const onClickToggle = () => {
    const lenis = (window as any).lenis;
    
    if (isPinnedRef.current) {
      // Unpin and close
      isPinnedRef.current = false;
      setIsPinned(false);
      reverseAnim();
      if (lenis) lenis.start();
    } else {
      // Pin and lock open
      isPinnedRef.current = true;
      setIsPinned(true);
      playAnim();
      if (lenis) lenis.stop();
    }
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, target: string) => {
    e.preventDefault();
    
    const lenis = (window as any).lenis;

    // Reset menu state and close upon clicking a link
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
      }, isExpanded ? 800 : 0); 
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuLinks = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-[9999] pointer-events-none" id="main-nav">
      
      <div 
        className="font-display font-bold text-xl tracking-tighter cursor-pointer pointer-events-auto mt-2 text-current" 
        onMouseEnter={handleHoverAdd} 
        onMouseLeave={handleHoverRemove}
        onClick={(e) => handleScrollTo(e, 'top')}
      >
        AETHER ©
      </div>
      
      <div className="flex items-start gap-8 text-sm font-medium tracking-wide pointer-events-auto text-current">

        {/* Expanding Pill Menu */}
        <div className="relative w-[140px] h-[64px]">
          <div 
            ref={menuContainerRef} 
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="absolute top-0 right-0 bg-[#ff4d00] text-white overflow-hidden shadow-lg"
          >
            
            {/* Links Container */}
            <div className="menu-links-container invisible absolute top-0 left-0 w-full p-6 pt-8 flex flex-col gap-2">
              {menuLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  onClick={(e) => handleScrollTo(e, link.href)}
                  onMouseEnter={handleHoverAdd} 
                  onMouseLeave={handleHoverRemove}
                  className="menu-item-link relative group w-fit font-palma-heavy text-3xl font-bold uppercase tracking-tight text-white transition-opacity"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Toggle Button Area */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[64px] flex items-center justify-between px-5 cursor-pointer" 
              onClick={onClickToggle}
              onMouseEnter={handleHoverAdd} 
              onMouseLeave={handleHoverRemove}
            >
              <span className="font-palma-heavy text-[18px] tracking-widest uppercase">
                {isExpanded ? 'Close' : 'Menu'}
              </span>
              
              {/* 4 Dots Icon */}
              <div className="dots-icon grid grid-cols-2 gap-[3px]">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </nav>
  );
}