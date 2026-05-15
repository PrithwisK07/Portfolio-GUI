"use client";
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

const servicesData = [
  {
    id: "01",
    title: "Digital Strategy",
    desc: "We decode complex market algorithms to position your brand precisely where it needs to be, architecting roadmaps that guarantee digital dominance.",
    deliverables: ["Market & Competitor Analysis", "Brand Positioning & Identity", "Growth Architecture", "Technical SEO Audits"],
    expandedText: "Our strategy phase isn't just about spreadsheets; it's about finding the white space in your industry. We map out user journeys that convert passive scrollers into brand evangelists.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "Immersive Design",
    desc: "Beyond mere aesthetics, we sculpt digital environments. Our interfaces are built on cognitive psychology to ensure every interaction feels inevitable.",
    deliverables: ["UI/UX Prototyping", "WebGL & 3D Interactions", "Motion Guidelines", "Design System Engineering"],
    expandedText: "We treat pixels like physical materials. By blending spatial design principles with interactive physics, we create interfaces that don't just look beautiful—they feel alive under the user's fingertips.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Creative Engineering",
    desc: "Ruthless optimization meets bleeding-edge tech. We write mathematical, un-breakable code utilizing custom WebGL pipelines and modern frameworks.",
    deliverables: ["Next.js & React Ecosystems", "Custom Shader Development", "Headless CMS Integration", "Performance Optimization"],
    expandedText: "Great design dies in poor execution. Our engineering team builds resilient, scalable architectures that deliver 60FPS animations without compromising load times or SEO performance.",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const expandedWrapperRef = useRef<HTMLDivElement>(null);
  const expandedCardRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const expandedCtx = useRef<gsap.Context | null>(null);

  const [activeService, setActiveService] = useState<{ index: number, data: typeof servicesData[0], rect: DOMRect } | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom top",
          toggleActions: "play reverse play reverse", 
        }
      });

      tl.fromTo(cardsRef.current,
        { y: 200, opacity: 0, rotationY: 15, rotationX: 10, scale: 0.9 },
        { y: 0, opacity: 1, rotationY: 0, rotationX: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: "back.out(1.2)" },
        "+=0.2"
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!activeService || !expandedCardRef.current || !backdropRef.current) return;

    expandedCtx.current = gsap.context(() => {
      const { rect } = activeService;

      gsap.set(expandedWrapperRef.current, { display: 'block' });
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });

      gsap.set(expandedCardRef.current, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        xPercent: 0,
        yPercent: 0,
        borderRadius: '1rem',
      });

      gsap.to(expandedCardRef.current, {
        top: '50%',
        left: '50%',
        width: '85vw', 
        height: '85vh',
        xPercent: -50,
        yPercent: -50,
        borderRadius: '2rem',
        duration: 0.8,
        ease: 'power4.inOut'
      });

      gsap.fromTo('.expanded-reveal', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.4 }
      );
      
      gsap.fromTo('.expanded-image-block',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 }
      );

    });

    return () => expandedCtx.current?.revert();
  }, [activeService]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (activeService) return; 

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

    gsap.to(card, { rotateX, rotateY, duration: 0.4, ease: 'power2.out', transformPerspective: 1000, transformOrigin: "center center" });
    
    const innerContent = card.querySelector('.inner-content');
    if (innerContent) gsap.to(innerContent, { x: rotateY * 1.5, y: -rotateX * 1.5, duration: 0.4, ease: 'power2.out' });
  };

  const handleMouseLeave = (index: number) => {
    if (activeService) return;
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    const innerContent = card.querySelector('.inner-content');
    if (innerContent) gsap.to(innerContent, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
  };

  const openCard = (index: number) => {
    if (activeService) return;
    
    if ((window as any).lenis) (window as any).lenis.stop();
    document.body.style.overflow = 'hidden';

    const card = cardsRef.current[index];
    if (!card) return;

    gsap.killTweensOf(card);
    gsap.set(card, { rotateX: 0, rotateY: 0 });
    
    const innerContent = card.querySelector('.inner-content');
    if (innerContent) {
      gsap.killTweensOf(innerContent);
      gsap.set(innerContent, { x: 0, y: 0 });
    }

    const rect = card.getBoundingClientRect();

    setActiveService({ index, data: servicesData[index], rect });
  };

  const closeCard = () => {
    if (!activeService || !expandedCardRef.current || !backdropRef.current) return;
    
    const { rect } = activeService;

    gsap.to('.expanded-reveal, .expanded-image-block', { y: 20, opacity: 0, duration: 0.3, ease: 'power2.in' });

    gsap.to(expandedCardRef.current, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      xPercent: 0,
      yPercent: 0,
      borderRadius: '1rem',
      duration: 0.8,
      ease: 'power4.inOut',
      delay: 0.1
    });

    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 0.4,
      onComplete: () => {
        gsap.set(expandedWrapperRef.current, { display: 'none' });
        setActiveService(null);
        
        if ((window as any).lenis) (window as any).lenis.start();
        document.body.style.overflow = '';
      }
    });
  };

  return (
    <>
      <section ref={containerRef} className="py-32 px-6 md:px-12 relative border-t border-white/10 z-10 bg-[#050505] perspective-[2000px]">
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
              onClick={() => openCard(idx)}
              className={`group relative h-[450px] p-10 rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden cursor-pointer transition-opacity duration-300 ${activeService?.index === idx ? 'opacity-0' : 'opacity-100'}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.06), transparent 40%)` }}
              />

              <div className="inner-content h-full flex flex-col justify-between relative z-10 pointer-events-none">
                <div className="flex justify-between items-start">
                  <span className="font-display text-5xl font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)] group-hover:text-white transition-colors duration-500">
                    {service.id}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white transition-colors duration-500">
                    <span className="text-white group-hover:text-[#050505] text-xl font-light transform group-hover:rotate-90 transition-transform duration-500">+</span>
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

      <div ref={expandedWrapperRef} className="fixed inset-0 z-[100] hidden">
        <div 
          ref={backdropRef} 
          className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md opacity-0"
          onClick={closeCard}
        />

        {activeService && (
          <div 
            ref={expandedCardRef} 
            className="absolute bg-[#111] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            {/* --- FIX: Added data-lenis-prevent="true" to allow scrolling inside this specific div --- */}
            <div 
               data-lenis-prevent="true"
               className="w-full md:w-1/2 p-8 md:p-16 flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              
              <div className="flex justify-between items-start mb-12">
                 <span className="expanded-reveal font-display text-accent text-xl tracking-widest uppercase">
                   {activeService.data.id}
                 </span>
                 <button 
                    onClick={closeCard}
                    onMouseEnter={handleHoverAdd}
                    onMouseLeave={handleHoverRemove}
                    className="md:hidden w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-dark transition-colors"
                 >✕</button>
              </div>

              <h2 className="expanded-reveal font-display text-4xl md:text-6xl tracking-tight mb-8">
                {activeService.data.title}
              </h2>
              
              <p className="expanded-reveal text-lg md:text-xl font-light text-white/80 leading-relaxed mb-12">
                {activeService.data.expandedText}
              </p>

              <div className="mt-auto">
                <h4 className="expanded-reveal text-sm uppercase tracking-widest text-white/40 mb-6">Core Deliverables</h4>
                <ul className="flex flex-col gap-4 pb-12 md:pb-0">
                  {activeService.data.deliverables.map((item, i) => (
                    <li key={i} className="expanded-reveal flex items-center gap-4 text-white/90 border-b border-white/10 pb-3">
                      <span className="w-2 h-2 rounded-full bg-accent"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="hidden md:block w-1/2 p-4 h-full">
              <div className="expanded-image-block w-full h-full rounded-xl overflow-hidden relative">
                 <img 
                   src={activeService.data.image} 
                   alt={activeService.data.title}
                   className="w-full h-full object-cover opacity-80"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 to-transparent"></div>
                 
                 <button 
                    onClick={closeCard}
                    onMouseEnter={handleHoverAdd}
                    onMouseLeave={handleHoverRemove}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#050505] transition-colors z-20"
                 >
                   ✕
                 </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}