"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

const textSideA = "We are a digital atelier crafting immersive experiences that live at the intersection of design, technology, and human emotion. We don't just build websites; we engineer digital atmospheres.";

// Premium abstract placeholders for the floating gallery
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
      
      // 1. Text Reveal Animation for the Dark Side
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

      // 2. Continuous Levitation for Floating Images
      imagesRef.current.forEach((img, i) => {
        if (!img) return;
        gsap.to(img, {
          y: floatingImages[i].floatOffset,
          duration: 2 + Math.random(), // Randomize duration slightly for organic feel
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: Math.random() // Stagger starts
        });
      });

      // 3. The Continuous Diagonal Sweep Animation
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
          end: "+=200%", 
          pin: true,        
          scrub: 1,         
          anticipatePin: 1
        }
      });

      tl.to(animState, {
         x: -100, 
         duration: 1,
         ease: 'none',
         onUpdate: updateClipPath
      })
      .to({}, { duration: 0.5 }) // Pause in the middle to interact with images
      .to(animState, {
         x: -350, 
         duration: 1,
         ease: 'none',
         onUpdate: updateClipPath
      });

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  // --- Mouse Parallax Handler ---
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Calculate mouse position relative to the center of the screen
    const x = (e.clientX - window.innerWidth / 2);
    const y = (e.clientY - window.innerHeight / 2);

    imagesRef.current.forEach((img, index) => {
      if (!img) return;
      const speed = floatingImages[index].speed;
      
      // Move images in opposite directions with different depths based on speed
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

      {/* --- LAYER 2: SIDE B (INTERACTIVE FLOATING GALLERY) --- */}
      <div 
        ref={lightLayerRef}
        className="absolute inset-0 flex items-center justify-center z-10 bg-white text-dark"
      >
        {/* Central Title */}
        <div className="relative z-20 text-center pointer-events-none">
          <h3 className="font-display text-sm tracking-widest uppercase opacity-40 mb-4">The Reality</h3>
          <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tighter">
            Visualizing<br/>The Unseen.
          </h2>
        </div>

        {/* Floating Images Container */}
        {floatingImages.map((img, idx) => (
          <div
            key={idx}
            ref={el => { imagesRef.current[idx] = el; }}
            onMouseEnter={(e) => {
              handleHoverAdd();
              // Scale up and bring to front on hover
              gsap.to(e.currentTarget, { scale: 1.05, zIndex: 30, duration: 0.4, ease: "power2.out" });
            }}
            onMouseLeave={(e) => {
              handleHoverRemove();
              // Reset scale and z-index
              gsap.to(e.currentTarget, { scale: 1, zIndex: 10, duration: 0.4, ease: "power2.out" });
            }}
            className="absolute rounded-xl overflow-hidden shadow-2xl cursor-pointer will-change-transform z-10"
            style={{
              top: img.top,
              left: img.left,
              width: img.width,
              // Use a generous aspect ratio
              aspectRatio: '4/5', 
            }}
          >
            <img 
              src={img.src} 
              alt="Visual Exploration" 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

    </section>
  );
}