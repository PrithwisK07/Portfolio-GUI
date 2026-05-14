"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

const servicesData = [
  {
    id: "01",
    title: "Digital Strategy",
    desc: "We decode complex market algorithms to position your brand precisely where it needs to be, architecting roadmaps that guarantee digital dominance."
  },
  {
    id: "02",
    title: "Immersive Design",
    desc: "Beyond mere aesthetics, we sculpt digital environments. Our interfaces are built on cognitive psychology to ensure every interaction feels inevitable."
  },
  {
    id: "03",
    title: "Creative Engineering",
    desc: "Ruthless optimization meets bleeding-edge tech. We write mathematical, un-breakable code utilizing custom WebGL pipelines and modern frameworks."
  }
];

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Create a timeline to cleanly handle delays and toggle actions
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",   // Plays when the top of the section enters 80% of the screen
          end: "bottom top",  // Reverses when the bottom of the section hits the top of the screen
          toggleActions: "play reverse play reverse", 
        }
      });

      // The "+=0.3" parameter at the end adds the requested delay before the entrance begins
      tl.fromTo(cardsRef.current,
        { 
          y: 200, 
          opacity: 0, 
          rotationY: 15, 
          rotationX: 10,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "back.out(1.2)"
        },
        "+=0.4" // <-- The entry delay
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000,
      transformOrigin: "center center"
    });
    
    const innerContent = card.querySelector('.inner-content');
    if (innerContent) {
      gsap.to(innerContent, {
        x: rotateY * 1.5,
        y: -rotateX * 1.5,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    });

    const innerContent = card.querySelector('.inner-content');
    if (innerContent) {
      gsap.to(innerContent, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    }
  };

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 relative border-t border-white/10 z-10 bg-dark perspective-[2000px]">
      
      <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
        <h2 className="font-display text-6xl md:text-8xl tracking-tighter">Capabilities</h2>
        <p className="max-w-md text-white/50 text-sm uppercase tracking-widest leading-relaxed">
          We operate at the bleeding edge of the digital frontier, delivering solutions that defy standard conventions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {servicesData.map((service, idx) => (
          <div 
            key={service.id}
            ref={el => { cardsRef.current[idx] = el; }}
            onMouseMove={(e) => handleMouseMove(e, idx)}
            onMouseLeave={() => { handleMouseLeave(idx); handleHoverRemove(); }}
            onMouseEnter={handleHoverAdd}
            className="group relative h-112.5 p-10 rounded-2xl bg-white/2 border border-white/10 overflow-hidden cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.06), transparent 40%)`
              }}
            />

            <div className="inner-content h-full flex flex-col justify-between relative z-10 pointer-events-none">
              <div className="flex justify-between items-start">
                <span className="font-display text-5xl font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)] group-hover:text-white transition-colors duration-500">
                  {service.id}
                </span>
                
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-transparent transition-colors duration-500">
                  <span className="text-white group-hover:text-dark text-xl font-light transform group-hover:rotate-90 transition-transform duration-500">+</span>
                </div>
              </div>

              <div>
                <h3 className="font-display text-3xl mb-4 group-hover:-translate-y-2 transition-transform duration-500">{service.title}</h3>
                <p className="font-sans font-light text-white/60 leading-relaxed group-hover:-translate-y-2 transition-transform duration-500 delay-75">
                  {service.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}