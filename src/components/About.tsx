/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

const textSideA = "We are a digital atelier crafting immersive experiences that live at the intersection of design, technology, and human emotion. We don't just build websites; we engineer digital atmospheres.";

const floatingImages = [
  { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", top: "15%", left: "10%", width: "25vw", speed: 0.05, floatOffset: 20 },
  { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800", top: "60%", left: "20%", width: "18vw", speed: 0.08, floatOffset: -15 },
  { src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800", top: "20%", left: "65%", width: "22vw", speed: 0.03, floatOffset: 25 },
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800", top: "55%", left: "70%", width: "20vw", speed: 0.06, floatOffset: -20 },
];

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const lightLayerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      
      // 1. Text Reveal for Dark Side
      gsap.fromTo('.about-word-span', 
        { y: '100%' },
        { 
          y: '0%', 
          duration: 1, 
          stagger: 0.02, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%", 
          }
        }
      );

      // 2. Continuous Autonomous Levitation
      imagesRef.current.forEach((img, i) => {
        if (!img) return;
        const floater = img.querySelector('.floater');
        gsap.to(floater, {
          y: floatingImages[i].floatOffset,
          duration: 2 + Math.random(),
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: Math.random() 
        });
      });

      // 3. The Master Scroll Sequence
      const animState = { x: 150 }; 
      
      const updateClipPath = () => {
         if(lightLayerRef.current) {
             const topLeft = animState.x + 80; 
             const bottomLeft = animState.x;
             const topRight = animState.x + 280; 
             const bottomRight = animState.x + 200; 
             
             lightLayerRef.current.style.clipPath = `polygon(${topLeft}vw 0%, ${topRight}vw 0%, ${bottomRight}vw 100%, ${bottomLeft}vw 100%)`;
         }
      };
      updateClipPath(); 

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", 
          end: "+=300%", 
          pin: true,        
          scrub: 1,         
          anticipatePin: 1
        }
      });

      // --- SEQUENCE START ---

      // Step A: Diagonal Wipe covers the screen (Moves Right to Left)
      tl.to(animState, {
         x: -100, 
         duration: 1.5,
         ease: 'none',
         onUpdate: updateClipPath
      })
      
      // Step B: Text appears
      .fromTo('.light-title-reveal', 
         { autoAlpha: 0, y: 30 }, 
         { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }
      )
      
      // Step C: Images pop in
      .fromTo(imagesRef.current, 
         { autoAlpha: 0, scale: 0.7 }, 
         { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)" },
         "-=0.2" 
      )
      
      // Step D: Hold the layout so user can see it
      .to({}, { duration: 1.5 }) 

      // --- REVERSE SEQUENCE ---

      // Step E: Images pop out in reverse order
      .to(imagesRef.current, { 
         autoAlpha: 0, 
         scale: 0.7, 
         duration: 0.6, 
         stagger: -0.1, 
         ease: "back.in(1.5)" 
      })

      // Step F: Text fades and slides up
      .to('.light-title-reveal', { 
         autoAlpha: 0, 
         y: -30, 
         duration: 0.5, 
         stagger: -0.1 
      }, "-=0.3")

      // Step G: Diagonal Wipe CONTINUES off the screen to the left 
      // (This was previously 150, breaking the continuous sweep. Now it continues to -350)
      .to(animState, {
         x: -350, 
         duration: 1.5,
         ease: 'none',
         onUpdate: updateClipPath
      });

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const x = (e.clientX - window.innerWidth / 2);
    const y = (e.clientY - window.innerHeight / 2);

    imagesRef.current.forEach((img, index) => {
      if (!img) return;
      const speed = floatingImages[index].speed;
      
      gsap.to(img, {
        x: -x * speed,
        y: -y * speed,
        duration: 1,
        ease: "power2.out"
      });
    });
  };

  return (
    <section 
      ref={containerRef} 
      id="about" 
      onMouseMove={handleMouseMove}
      className="h-screen w-full relative border-t border-white/10 overflow-hidden"
    >
      
      {/* --- LAYER 1: SIDE A (DARK THEME) --- */}
      <div className="absolute inset-0 flex items-center px-6 md:px-12 z-0 bg-dark">
        <div className="w-full flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-1/4 mb-12 md:mb-0">
            <h3 className="font-display text-sm tracking-widest uppercase opacity-60">Manifesto</h3>
          </div>
          <div className="w-full md:w-3/4">
            <p className="font-display text-3xl md:text-5xl leading-tight tracking-tight">
              {textSideA.split(' ').map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-2 md:mr-3">
                  <span className="about-word-span inline-block transform translate-y-full">
                    {word}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* --- LAYER 2: SIDE B (INTERACTIVE LIGHT THEME) --- */}
      <div 
        ref={lightLayerRef}
        className="absolute inset-0 flex items-center justify-center z-10 bg-white text-dark"
      >
        <div className="relative z-20 text-center pointer-events-none">
          <h3 className="light-title-reveal font-display text-sm tracking-widest uppercase opacity-40 mb-4 invisible">The Reality</h3>
          <h2 className="light-title-reveal font-display text-5xl md:text-7xl font-bold tracking-tighter invisible">
            Visualizing<br/>The Unseen.
          </h2>
        </div>

        {floatingImages.map((img, idx) => (
          <div
            key={idx}
            ref={el => { imagesRef.current[idx] = el; }}
            className="absolute invisible opacity-0 z-10"
            style={{
              top: img.top,
              left: img.left,
              width: img.width,
              aspectRatio: '4/5', 
            }}
          >
            <div 
              className="floater w-full h-full rounded-xl overflow-hidden shadow-2xl cursor-pointer will-change-transform"
              onMouseEnter={(e) => {
                handleHoverAdd();
                gsap.to(e.currentTarget, { scale: 1.05, duration: 0.4, ease: "power2.out" });
                gsap.set(e.currentTarget.parentElement, { zIndex: 30 });
              }}
              onMouseLeave={(e) => {
                handleHoverRemove();
                gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: "power2.out" });
                gsap.set(e.currentTarget.parentElement, { zIndex: 10 });
              }}
            >
              <img 
                src={img.src} 
                alt="Visual Exploration" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}