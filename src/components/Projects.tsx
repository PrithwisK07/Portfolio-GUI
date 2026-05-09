"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { handleHoverAdd, handleHoverRemove } from "./CustomCursor";

const projectsData = [
  {
    id: "lumina",
    color: "#ff4d00",
    title: "Lumina",
    year: "2026",
    category: "E-Commerce",
    desc: "A revolutionary e-commerce experience blending spatial design with seamless purchasing flows.",
    challenge:
      "Physical retail provides tactile feedback that digital spaces inherently lack. The challenge was to bridge this gap, ensuring users feel the texture, scale, and volume of products without physical touch.",
    solution:
      "We engineered a custom WebGL pipeline to render 3D product models with real-time lighting constraints. Combined with fluid micro-interactions and a bespoke checkout flow, we reduced user friction significantly.",
    stats: [
      {
        label: "Conversion",
        prefix: "+",
        val: 42,
        suffix: "%",
        isFloat: false,
      },
      { label: "Engagement", prefix: "", val: 2.4, suffix: "x", isFloat: true },
      { label: "Load Time", prefix: "<", val: 1.2, suffix: "s", isFloat: true },
    ],
    images: {
      gallery1:
        "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2000&auto=format&fit=crop",
      gallery2:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
      gallery3:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    },
  },
  {
    id: "aura",
    color: "#4d00ff",
    title: "Aura Platform",
    year: "2025",
    category: "Web App",
    desc: "Aura is a next-generation web application designed for creative professionals.",
    challenge:
      "Creative tools often suffer from UI clutter, breaking the flow state of professionals. We needed to design a robust platform that felt invisible when not actively interacted with.",
    solution:
      "Aura utilizes spatial UI principles. Tools only manifest contextually based on cursor velocity and selection intent, maintaining a distraction-free canvas emphasizing kinetic typography and deep focus.",
    stats: [
      {
        label: "Active Users",
        prefix: "",
        val: 120,
        suffix: "K+",
        isFloat: false,
      },
      { label: "Retention", prefix: "", val: 88, suffix: "%", isFloat: false },
      { label: "Awards", prefix: "", val: 3, suffix: " FWA", isFloat: false },
    ],
    images: {
      gallery1:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop",
      gallery2:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop",
      gallery3:
        "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop",
    },
  },
  {
    id: "nexus",
    color: "#00ffaa",
    title: "Nexus Void",
    year: "2024",
    category: "Immersive",
    desc: "An experimental digital art installation exploring the concept of digital nothingness.",
    challenge:
      "How do you visualize the absence of data? The objective was to create a meditative digital landscape that paradoxically felt full of life while representing emptiness.",
    solution:
      "Using complex shader mathematics and fluid dynamics simulations, we created an interactive particle system that responds to webcam depth data, allowing users to physically push through the 'void'.",
    stats: [
      { label: "Exhibitions", prefix: "0", val: 4, suffix: "", isFloat: false },
      {
        label: "Interactions",
        prefix: "",
        val: 2.1,
        suffix: "M+",
        isFloat: true,
      },
      { label: "Render", prefix: "", val: 60, suffix: "FPS", isFloat: false },
    ],
    images: {
      gallery1:
        "https://images.unsplash.com/photo-1770462988092-f8c614308a81?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gallery2:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
      gallery3:
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop",
    },
  },
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
      gsap.set(hoverImageRef.current, {
        xPercent: -50,
        yPercent: -50,
        scale: 0.8,
      });
    }
  }, []);

  const handleProjectEnter = (
    e: React.MouseEvent,
    project: (typeof projectsData)[0],
  ) => {
    if (isModalOpen.current) return;
    isHoveringProject.current = true;

    if (hoverImageRef.current && viewBadgeRef.current) {
      gsap.set(hoverImageRef.current, { left: e.clientX, top: e.clientY });

      // Dynamic Solid Color Background
      hoverImageRef.current.style.backgroundColor = project.color;

      gsap.to(hoverImageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.5)",
      });
      gsap.to(viewBadgeRef.current, { opacity: 1, duration: 0.3, delay: 0.1 });
    }
  };

  const handleProjectLeave = () => {
    if (isModalOpen.current) return;
    isHoveringProject.current = false;

    if (hoverImageRef.current && viewBadgeRef.current) {
      gsap.to(viewBadgeRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(hoverImageRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  };

  const handleProjectMove = (
    e: React.MouseEvent,
    project: (typeof projectsData)[0],
    rect: DOMRect,
  ) => {
    if (isModalOpen.current) return;

    if (!isHoveringProject.current) {
      isHoveringProject.current = true;
      if (hoverImageRef.current && viewBadgeRef.current) {
        hoverImageRef.current.style.backgroundColor = project.color;
        gsap.to(hoverImageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(viewBadgeRef.current, {
          opacity: 1,
          duration: 0.3,
          delay: 0.1,
        });
      }
    }

    if (hoverImageRef.current && viewBadgeRef.current) {
      gsap.to(hoverImageRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.8,
        ease: "power3.out",
      });

      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(viewBadgeRef.current, {
        x: relX * 40,
        y: relY * 40,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const initModalScrollAnimations = () => {
    modalScrollCtx.current = gsap.context(() => {
      gsap.utils.toArray(".modal-text-reveal").forEach((el: any) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              scroller: projectModalRef.current,
              start: "top 85%",
            },
          },
        );
      });

      gsap.utils.toArray(".modal-parallax").forEach((el: any) => {
        gsap.to(el, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            scroller: projectModalRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray(".stat-container").forEach((container: any) => {
        const valEl = container.querySelector(".stat-val");
        const targetVal = parseFloat(valEl.dataset.val);
        const prefix = valEl.dataset.prefix;
        const suffix = valEl.dataset.suffix;
        const isFloat = valEl.dataset.isfloat === "true";

        const obj = { val: 0 };

        gsap.fromTo(
          container,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              scroller: projectModalRef.current,
              start: "top 90%",
            },
          },
        );

        gsap.to(obj, {
          val: targetVal,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            scroller: projectModalRef.current,
            start: "top 90%",
          },
          onUpdate: () => {
            const currentVal = isFloat
              ? obj.val.toFixed(1)
              : Math.ceil(obj.val);
            // Safely update innerHTML (React ignores this due to dangerouslySetInnerHTML)
            valEl.innerHTML = `${prefix}${currentVal}${suffix}`;
          },
        });
      });
    }, projectModalRef);
  };

  const handleProjectClick = (project: (typeof projectsData)[0]) => {
    if (isModalOpen.current) return;
    isModalOpen.current = true;
    setActiveProject(project);

    if ((window as any).lenis) (window as any).lenis.stop();
    document.body.style.overflow = "hidden";

    gsap.to(viewBadgeRef.current, { opacity: 0, duration: 0.2 });

    gsap.to(hoverImageRef.current, {
      left: "50vw",
      top: "50vh",
      width: "100vw",
      height: "100vh",
      borderRadius: "0",
      scale: 1,
      duration: 0.8,
      ease: "power4.inOut",
      zIndex: 90,
    });

    gsap.to("#main-nav", { opacity: 0, duration: 0.3, pointerEvents: "none" });

    gsap.to(projectModalRef.current, {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.1,
      delay: 0.4,
      onComplete: () => {
        initModalScrollAnimations();
      },
    });

    gsap.fromTo(
      ".modal-hero-animate",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.5,
      },
    );
  };

  const closeProjectModal = () => {
    if (modalScrollCtx.current) modalScrollCtx.current.revert();

    gsap.to(".modal-hero-animate", {
      y: 30,
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
    });

    gsap.to(projectModalRef.current, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.3,
      delay: 0.2,
      onComplete: () => {
        if (projectModalRef.current) projectModalRef.current.scrollTop = 0;
      },
    });

    gsap.to(hoverImageRef.current, {
      width: "300px",
      height: "400px",
      borderRadius: "8px",
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "power4.inOut",
      delay: 0.3,
      onComplete: () => {
        isModalOpen.current = false;
        isHoveringProject.current = false;

        if ((window as any).lenis) (window as any).lenis.start();
        document.body.style.overflow = "";

        gsap.set(hoverImageRef.current, { zIndex: 10 });
        gsap.to("#main-nav", {
          opacity: 1,
          duration: 0.3,
          pointerEvents: "auto",
        });
      },
    });
  };

  return (
    <>
      <section id="work" className="py-32">
        <div className="px-6 md:px-12 mb-16">
          <h2 className="font-display text-6xl md:text-8xl tracking-tighter">
            Selected Works
          </h2>
        </div>
        <div className="w-full flex flex-col border-t border-white/10">
          {projectsData.map((project, idx) => (
            <div
              key={idx}
              className="project-item group w-full py-12 px-6 md:px-12 flex justify-between items-center cursor-pointer relative overflow-hidden"
              onMouseEnter={(e) => {
                handleHoverAdd();
                handleProjectEnter(e, project);
              }}
              onMouseLeave={() => {
                handleHoverRemove();
                handleProjectLeave();
              }}
              onMouseMove={(e) =>
                handleProjectMove(
                  e,
                  project,
                  e.currentTarget.getBoundingClientRect(),
                )
              }
              onClick={() => handleProjectClick(project)}
            >
              <div className="flex items-center gap-6 transition-transform duration-500 group-hover:translate-x-6">
                <span className="opacity-0 -translate-x-10 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 font-display text-accent text-3xl">
                  →
                </span>
                <h3 className="font-display text-4xl md:text-6xl tracking-tight pointer-events-none">
                  {project.title}
                </h3>
              </div>
              <div className="text-right transition-transform duration-500 group-hover:-translate-x-6 pointer-events-none">
                <span className="block text-sm uppercase tracking-widest text-white/50">
                  {project.year}
                </span>
                <span className="block font-medium">{project.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOVER PREVIEW --- */}
      <div
        ref={hoverImageRef}
        className="project-image-preview fixed top-0 left-0 w-75 h-100 rounded-lg pointer-events-none opacity-0 z-10 overflow-hidden flex justify-center items-center"
      >
        <div
          ref={viewBadgeRef}
          className="px-6 py-3 bg-black/40 backdrop-blur-md rounded-full text-white font-display text-xs tracking-widest uppercase opacity-0 border border-white/20 z-20"
        >
          View Case
        </div>
      </div>

      {/* --- SCROLLABLE MODAL --- */}
      <div
        ref={projectModalRef}
        data-lenis-prevent="true"
        className="fixed inset-0 z-100 pointer-events-none opacity-0 overflow-y-auto overflow-x-hidden text-white modal-scroll"
      >
        <button
          onClick={closeProjectModal}
          onMouseEnter={handleHoverAdd}
          onMouseLeave={handleHoverRemove}
          className="fixed top-6 right-6 md:top-10 md:right-10 uppercase tracking-widest text-xs border border-white/20 rounded-full px-6 py-3 bg-black/20 backdrop-blur-md hover:bg-white hover:text-black transition-colors duration-300 z-50 mix-blend-normal"
        >
          Close
        </button>

        <div className="w-full min-h-screen relative px-6 md:px-12 pb-32">
          <div className="h-screen flex flex-col justify-end pb-12 relative z-10">
            <h2 className="modal-hero-animate font-display text-6xl md:text-[10vw] leading-[0.85] tracking-tighter uppercase mb-8">
              {activeProject.title}
            </h2>
            <div className="modal-hero-animate flex gap-12 border-t border-white/20 pt-8">
              <div>
                <span className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                  Category
                </span>
                <span className="font-medium text-xl">
                  {activeProject.category}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                  Year
                </span>
                <span className="font-medium text-xl">
                  {activeProject.year}
                </span>
              </div>
            </div>
          </div>

          <div className="py-24 md:py-40 border-t border-white/20 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="col-span-1 md:col-span-4">
                <h3 className="modal-text-reveal font-display text-2xl uppercase tracking-tight mb-6">
                  The Narrative
                </h3>
                <p className="modal-text-reveal text-lg md:text-xl font-light text-white/80 leading-relaxed">
                  {activeProject.desc}
                </p>
              </div>
              <div className="col-span-1 md:col-span-8 flex flex-col gap-16">
                <div>
                  <h4 className="modal-text-reveal text-sm uppercase tracking-widest text-white/50 mb-4">
                    The Challenge
                  </h4>
                  <p className="modal-text-reveal text-2xl md:text-4xl font-display leading-tight">
                    {activeProject.challenge}
                  </p>
                </div>
                <div>
                  <h4 className="modal-text-reveal text-sm uppercase tracking-widest text-white/50 mb-4">
                    The Solution
                  </h4>
                  <p className="modal-text-reveal text-2xl md:text-4xl font-display leading-tight text-white/70 italic">
                    {activeProject.solution}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 border-t border-white/10 pt-16">
              {activeProject.stats.map((stat, i) => (
                <div key={i} className="stat-container flex flex-col opacity-0">
                  <span className="text-xs uppercase tracking-widest text-white/50 mb-2">
                    {stat.label}
                  </span>
                  {/* FIX: dangerouslySetInnerHTML prevents React from crashing when GSAP overwrites the text node */}
                  <span
                    className="stat-val font-display text-5xl md:text-7xl font-bold"
                    data-val={stat.val}
                    data-prefix={stat.prefix}
                    data-suffix={stat.suffix}
                    data-isfloat={stat.isFloat}
                    dangerouslySetInnerHTML={{
                      __html: `${stat.prefix}0${stat.suffix}`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="py-24 md:py-32 relative z-10">
            <h3 className="modal-text-reveal font-display text-2xl uppercase tracking-tight mb-12">
              Visual Exploration
            </h3>
            <div className="w-full flex flex-col gap-12 md:gap-24">
              <div
                className="w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-xl relative group"
                onMouseEnter={handleHoverAdd}
                onMouseLeave={handleHoverRemove}
              >
                <img
                  src={activeProject.images.gallery1}
                  alt={`${activeProject.title} detail`}
                  className="modal-parallax absolute -top-[15%] left-0 w-full h-[130%] object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-auto md:h-[80vh]">
                <div className="h-[50vh] md:h-full overflow-hidden rounded-xl relative">
                  <img
                    src={activeProject.images.gallery2}
                    alt={`${activeProject.title} detail 2`}
                    className="modal-parallax absolute -top-[15%] left-0 w-full h-[130%] object-cover"
                  />
                </div>
                <div className="h-[50vh] md:h-full overflow-hidden rounded-xl relative mt-0 md:mt-24">
                  <img
                    src={activeProject.images.gallery3}
                    alt={`${activeProject.title} detail 3`}
                    className="modal-parallax absolute -top-[15%] left-0 w-full h-[130%] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="py-24 border-t border-white/20 flex flex-col items-center justify-center text-center relative z-10">
            <h2 className="modal-text-reveal font-display text-4xl md:text-6xl mb-8">
              Next Project
            </h2>
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
