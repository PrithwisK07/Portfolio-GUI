"use client";
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(menuOverlayRef.current, { yPercent: -100, autoAlpha: 0 });

      tl.current = gsap.timeline({ paused: true })
        .to(menuOverlayRef.current, { 
           yPercent: 0, 
           autoAlpha: 1, 
           duration: 0.8, 
           ease: 'power4.inOut' 
        })
        .fromTo('.menu-item-link', 
          { y: 120, opacity: 0, rotate: 5 }, 
          { y: 0, opacity: 1, rotate: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
          "-=0.4"
        )
        .fromTo('.menu-footer',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          "-=0.6"
        );
    });

    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    const lenis = (window as any).lenis;
    
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      tl.current?.play();
      if (lenis) lenis.stop();
    } else {
      setIsMenuOpen(false);
      tl.current?.reverse();
      if (lenis) lenis.start();
    }
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, target: string) => {
    e.preventDefault();
    
    if (isMenuOpen) {
      toggleMenu();
    }

    const lenis = (window as any).lenis;
    if (lenis) {
      setTimeout(() => {
        lenis.scrollTo(target, { 
          duration: 1.5, 
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }, isMenuOpen ? 800 : 0); 
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
    <>
      <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 mix-blend-difference" id="main-nav">
        <div 
          className="font-display font-bold text-xl tracking-tighter cursor-pointer" 
          onMouseEnter={handleHoverAdd} 
          onMouseLeave={handleHoverRemove}
          onClick={(e) => handleScrollTo(e, 'top')}
        >
          AETHER ©
        </div>
        
        <div className="flex items-center gap-8 text-sm font-medium tracking-wide">
          <a 
            href="#work" 
            onClick={(e) => handleScrollTo(e, '#work')}
            className="relative group hidden md:block" 
            onMouseEnter={handleHoverAdd} 
            onMouseLeave={handleHoverRemove}
          >
            WORK
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a 
            href="#about" 
            onClick={(e) => handleScrollTo(e, '#about')}
            className="relative group hidden md:block" 
            onMouseEnter={handleHoverAdd} 
            onMouseLeave={handleHoverRemove}
          >
            ABOUT
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
          <button 
            onClick={toggleMenu}
            className="uppercase tracking-widest text-xs border border-white/20 rounded-full px-5 py-2.5 hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer pointer-events-auto" 
            onMouseEnter={handleHoverAdd} 
            onMouseLeave={handleHoverRemove}
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      <div 
        ref={menuOverlayRef} 
        className="fixed inset-0 bg-[#050505] z-40 flex flex-col items-center justify-center overflow-hidden invisible"
      >
        <div className="flex flex-col items-center gap-2 md:gap-4 w-full mt-10">
          {menuLinks.map((link, idx) => (
            <div key={link.label} className="overflow-hidden w-full flex justify-center py-2 relative">
              <a 
                href={link.href} 
                onClick={(e) => handleScrollTo(e, link.href)}
                onMouseEnter={() => { handleHoverAdd(); setHoveredIndex(idx); }} 
                onMouseLeave={() => { handleHoverRemove(); setHoveredIndex(null); }}
                // Dynamic Outline (Stroke) effect + Italic shift
                className={`menu-item-link group relative flex items-center font-display text-6xl md:text-[8vw] leading-none tracking-tighter uppercase transition-all duration-500 ease-out
                  ${hoveredIndex !== null && hoveredIndex !== idx 
                      ? 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)] scale-95' 
                      : 'text-white scale-100'}
                  ${hoveredIndex === idx ? ' pl-8 md:pl-12' : 'pl-0'}
                `}
              >
                {/* Horizontal Accent Line that snaps in from the left */}
                <span className={`absolute left-0 w-4 md:w-8 h-[2px] bg-accent transition-all duration-500 ease-out 
                  ${hoveredIndex === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                ></span>
                {link.label}
              </a>
            </div>
          ))}
        </div>

        <div className="menu-footer absolute bottom-10 w-full flex justify-between px-6 md:px-12 text-xs uppercase tracking-widest text-white/40">
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors" onMouseEnter={handleHoverAdd} onMouseLeave={handleHoverRemove}>Twitter</a>
            <a href="#" className="hover:text-white transition-colors" onMouseEnter={handleHoverAdd} onMouseLeave={handleHoverRemove}>Instagram</a>
          </div>
          <span>Based in the Void</span>
        </div>
      </div>
    </>
  );
}