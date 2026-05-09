"use client";
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

// Expanded Data Structure for Case Studies
const projectsData = [
  { 
    color: "#ff4d00", 
    title: "Lumina", 
    year: "2026", 
    category: "E-Commerce", 
    desc: "A revolutionary e-commerce experience blending spatial design with seamless purchasing flows.",
    challenge: "Physical retail provides tactile feedback that digital spaces inherently lack. The challenge was to bridge this gap, ensuring users feel the texture, scale, and volume of products without physical touch.",
    solution: "We engineered a custom WebGL pipeline to render 3D product models with real-time lighting constraints. Combined with fluid micro-interactions and a bespoke checkout flow, we reduced user friction significantly.",
    stats: [{ label: "Conversion", val: "+42%" }, { label: "Engagement", val: "2.4x" }, { label: "Load Time", val: "<1.2s" }]
  },
  { 
    color: "#4d00ff", 
    title: "Aura Platform", 
    year: "2025", 
    category: "Web App", 
    desc: "Aura is a next-generation web application designed for creative professionals.",
    challenge: "Creative tools often suffer from UI clutter, breaking the flow state of professionals. We needed to design a robust platform that felt invisible when not actively interacted with.",
    solution: "Aura utilizes spatial UI principles. Tools only manifest contextually based on cursor velocity and selection intent, maintaining a distraction-free canvas emphasizing kinetic typography and deep focus.",
    stats: [{ label: "Active Users", val: "120K+" }, { label: "Retention", val: "88%" }, { label: "Awards", val: "FWA" }]
  },
  { 
    color: "#00ffaa", 
    title: "Nexus Void", 
    year: "2024", 
    category: "Immersive", 
    desc: "An experimental digital art installation exploring the concept of digital nothingness.",
    challenge: "How do you visualize the absence of data? The objective was to create a meditative digital landscape that paradoxically felt full of life while representing emptiness.",
    solution: "Using complex shader mathematics and fluid dynamics simulations, we created an interactive particle system that responds to webcam depth data, allowing users to physically push through the 'void'.",
    stats: [{ label: "Exhibitions", val: "04" }, { label: "Interactions", val: "2M+" }, { label: "Render", val: "60FPS" }]
  }
];

export default function Projects() {
  const hoverImageRef = useRef<HTMLDivElement>(null);
  const viewBadgeRef = useRef<HTMLDivElement>(null);
  const projectModalRef = useRef<HTMLDivElement>(null);
  const modalScrollCtx = useRef<gsap.Context | null>(null);
  
  const isModalOpen = useRef(false);
  const isHoveringProject = useRef(false);
  const [activeProject, setActiveProject] = useState(projectsData[0]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (hoverImageRef.current) {
      gsap.set(hoverImageRef.current, { xPercent: -50, yPercent: -50, scale: 0.8 });
    }
  }, []);

  const handleProjectEnter = (e: React.MouseEvent, color: string) => {
    if (isModalOpen.current) return;
    isHoveringProject.current = true;
    
    if (hoverImageRef.current && viewBadgeRef.current) {
      gsap.set(hoverImageRef.current, { left: e.clientX, top: e.clientY });
      hoverImageRef.current.style.backgroundColor = color;
      gsap.to(hoverImageRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
      gsap.to(viewBadgeRef.current, { opacity: 1, duration: 0.3, delay: 0.1 });
    }
  };

  const handleProjectLeave = () => {
    if (isModalOpen.current) return;
    isHoveringProject.current = false;
    
    if (hoverImageRef.current && viewBadgeRef.current) {
      gsap.to(viewBadgeRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(hoverImageRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power3.out' });
    }
  };

  const handleProjectMove = (e: React.MouseEvent, color: string, rect: DOMRect) => {
    if (isModalOpen.current) return;

    if (!isHoveringProject.current) {
      isHoveringProject.current = true;
      if (hoverImageRef.current && viewBadgeRef.current) {
        hoverImageRef.current.style.backgroundColor = color;
        gsap.to(hoverImageRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
        gsap.to(viewBadgeRef.current, { opacity: 1, duration: 0.3, delay: 0.1 });
      }
    }

    if (hoverImageRef.current && viewBadgeRef.current) {
      gsap.to(hoverImageRef.current, { left: e.clientX, top: e.clientY, duration: 0.8, ease: 'power3.out' });
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(viewBadgeRef.current, { x: relX * 40, y: relY * 40, duration: 0.5, ease: 'power2.out' });
    }
  };

  const initModalScrollAnimations = () => {
    modalScrollCtx.current = gsap.context(() => {
      gsap.utils.toArray('.modal-text-reveal').forEach((el: any) => {
        gsap.fromTo(el, 
          { y: 50, opacity: 0 }, 
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              scroller: projectModalRef.current,
              start: 'top 85%'
            }
          }
        );
      });

      gsap.utils.toArray('.modal-parallax').forEach((el: any) => {
        gsap.to(el, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            scroller: projectModalRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      gsap.utils.toArray('.stat-val').forEach((el: any) => {
        gsap.fromTo(el, 
          { y: 20, opacity: 0 }, 
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: el,
              scroller: projectModalRef.current,
              start: 'top 90%'
            }
          }
        );
      });

    }, projectModalRef);
  };

  const handleProjectClick = (project: typeof projectsData[0]) => {
    if (isModalOpen.current) return;
    isModalOpen.current = true;
    setActiveProject(project);
    
    // --- SCROLL LOCK: Stop main site scroll ---
    if ((window as any).lenis) (window as any).lenis.stop();
    document.body.style.overflow = 'hidden'; 
    
    gsap.to(viewBadgeRef.current, { opacity: 0, duration: 0.2 });
    
    gsap.to(hoverImageRef.current, {
      left: '50vw', top: '50vh', width: '100vw', height: '100vh',
      borderRadius: '0', scale: 1, duration: 0.8, ease: 'power4.inOut', zIndex: 90
    });
    
    gsap.to('#main-nav', { opacity: 0, duration: 0.3, pointerEvents: 'none' });
    
    gsap.to(projectModalRef.current, { 
      opacity: 1, pointerEvents: 'auto', duration: 0.1, delay: 0.4,
      onComplete: () => {
        initModalScrollAnimations();
      }
    });

    gsap.fromTo('.modal-hero-animate', 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.5 }
    );
  };

  const closeProjectModal = () => {
    if (modalScrollCtx.current) modalScrollCtx.current.revert();
    
    gsap.to('.modal-hero-animate', { y: 30, opacity: 0, duration: 0.4, ease: 'power3.in' });
    
    gsap.to(projectModalRef.current, { 
      opacity: 0, pointerEvents: 'none', duration: 0.3, delay: 0.2,
      onComplete: () => {
        if (projectModalRef.current) projectModalRef.current.scrollTop = 0;
      }
    });
    
    gsap.to(hoverImageRef.current, {
      width: '300px', height: '400px', borderRadius: '8px',
      opacity: 0, scale: 0.8, duration: 0.8, ease: 'power4.inOut', delay: 0.3,
      onComplete: () => {
        isModalOpen.current = false;
        isHoveringProject.current = false;
        
        // --- SCROLL UNLOCK: Resume main site scroll ---
        if ((window as any).lenis) (window as any).lenis.start();
        document.body.style.overflow = '';
        
        gsap.set(hoverImageRef.current, { zIndex: 10 });
        gsap.to('#main-nav', { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
      }
    });
  };

  return (
    <>
      <section id="work" className="py-32">
        <div className="px-6 md:px-12 mb-16">
          <h2 className="font-display text-6xl md:text-8xl tracking-tighter">Selected Works</h2>
        </div>
        <div className="w-full flex flex-col border-t border-white/10">
          {projectsData.map((project, idx) => (
            <div 
              key={idx} 
              className="project-item group w-full py-12 px-6 md:px-12 flex justify-between items-center cursor-pointer"
              onMouseEnter={(e) => { handleHoverAdd(); handleProjectEnter(e, project.color); }}
              onMouseLeave={() => { handleHoverRemove(); handleProjectLeave(); }}
              onMouseMove={(e) => handleProjectMove(e, project.color, e.currentTarget.getBoundingClientRect())}
              onClick={() => handleProjectClick(project)}
            >
              <h3 className="font-display text-4xl md:text-6xl tracking-tight transition-transform duration-500 group-hover:-translate-y-2 pointer-events-none">{project.title}</h3>
              <div className="text-right transition-transform duration-500 group-hover:translate-y-2 pointer-events-none">
                <span className="block text-sm uppercase tracking-widest text-white/50">{project.year}</span>
                <span className="block font-medium">{project.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div ref={hoverImageRef} className="project-image-preview fixed top-0 left-0 w-[300px] h-[400px] rounded-lg pointer-events-none opacity-0 z-10 overflow-hidden flex justify-center items-center">
        <div ref={viewBadgeRef} className="px-6 py-3 bg-black/40 backdrop-blur-md rounded-full text-white font-display text-xs tracking-widest uppercase opacity-0 border border-white/20">View Case</div>
      </div>

      <div 
        ref={projectModalRef} 
        data-lenis-prevent="true"
        className="fixed inset-0 z-[100] pointer-events-none opacity-0 overflow-y-auto overflow-x-hidden text-white modal-scroll"
      >
        <button 
          onClick={closeProjectModal} 
          onMouseEnter={handleHoverAdd} 
          onMouseLeave={handleHoverRemove} 
          className="fixed top-6 right-6 md:top-10 md:right-10 uppercase tracking-widest text-xs border border-white/20 rounded-full px-6 py-3 bg-black/20 backdrop-blur-md hover:bg-white hover:text-black transition-colors duration-300 pointer-events-auto z-50 mix-blend-normal"
        >
          Close
        </button>

        <div className="w-full min-h-screen relative px-6 md:px-12 pb-32">
          <div className="h-screen flex flex-col justify-end pb-12">
            <h2 className="modal-hero-animate font-display text-6xl md:text-[10vw] leading-[0.85] tracking-tighter uppercase mb-8">
              {activeProject.title}
            </h2>
            <div className="modal-hero-animate flex gap-12 border-t border-white/20 pt-8">
              <div>
                <span className="block text-xs uppercase tracking-widest text-white/50 mb-2">Category</span>
                <span className="font-medium text-xl">{activeProject.category}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-white/50 mb-2">Year</span>
                <span className="font-medium text-xl">{activeProject.year}</span>
              </div>
            </div>
          </div>

          <div className="py-24 md:py-40 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="col-span-1 md:col-span-4">
                <h3 className="modal-text-reveal font-display text-2xl uppercase tracking-tight mb-6">The Narrative</h3>
                <p className="modal-text-reveal text-lg md:text-xl font-light text-white/80 leading-relaxed">
                  {activeProject.desc}
                </p>
              </div>
              <div className="col-span-1 md:col-span-8 flex flex-col gap-16">
                <div>
                  <h4 className="modal-text-reveal text-sm uppercase tracking-widest text-white/50 mb-4">The Challenge</h4>
                  <p className="modal-text-reveal text-2xl md:text-4xl font-display leading-tight">
                    {activeProject.challenge}
                  </p>
                </div>
                <div>
                  <h4 className="modal-text-reveal text-sm uppercase tracking-widest text-white/50 mb-4">The Solution</h4>
                  <p className="modal-text-reveal text-2xl md:text-4xl font-display leading-tight text-white/70 italic">
                    {activeProject.solution}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 border-t border-white/10 pt-16">
              {activeProject.stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="modal-text-reveal text-xs uppercase tracking-widest text-white/50 mb-2">{stat.label}</span>
                  <span className="stat-val font-display text-5xl md:text-7xl font-bold">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="py-24 md:py-32">
            <h3 className="modal-text-reveal font-display text-2xl uppercase tracking-tight mb-12">Visual Exploration</h3>
            <div className="w-full flex flex-col gap-12 md:gap-24">
              
              <div className="w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-xl border border-white/10 relative group" onMouseEnter={handleHoverAdd} onMouseLeave={handleHoverRemove}>
                <div className="modal-parallax absolute -top-10 left-0 w-full h-[calc(100%+80px)] bg-white/5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-display text-[15vw] text-white/5 font-bold mix-blend-overlay uppercase tracking-tighter">Render 01</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-[80vh]">
                <div className="h-full overflow-hidden rounded-xl border border-white/10 relative">
                  <div className="modal-parallax absolute -top-10 left-0 w-full h-[calc(100%+80px)] bg-black/20 flex items-center justify-center">
                     <div className="w-32 h-32 rounded-full border border-white/20"></div>
                  </div>
                </div>
                <div className="h-full overflow-hidden rounded-xl border border-white/10 relative mt-12 md:mt-24">
                  <div className="modal-parallax absolute -top-10 left-0 w-full h-[calc(100%+80px)] bg-white/10 backdrop-blur-md"></div>
                </div>
              </div>

            </div>
          </div>

          <div className="py-24 border-t border-white/20 flex flex-col items-center justify-center text-center">
             <h2 className="modal-text-reveal font-display text-4xl md:text-6xl mb-8">Next Project</h2>
             <button 
                onClick={closeProjectModal}
                className="modal-text-reveal font-sans text-sm tracking-widest uppercase border-b border-white pb-1 hover:text-white/50 transition-colors"
                onMouseEnter={handleHoverAdd} 
                onMouseLeave={handleHoverRemove}
             >
               Return to Index
             </button>
          </div>

        </div>
      </div>
    </>
  );
}