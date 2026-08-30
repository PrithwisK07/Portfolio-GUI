"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { projectsData } from "./sub-components/Projects/projectsData";
import { Project } from "./sub-components/Projects/types";
import ProjectItem from "./sub-components/Projects/ProjectItem";
import ProjectModal from "./sub-components/Projects/ProjectsModal";

export default function Projects() {
  const hoverImageRef = useRef<HTMLDivElement>(null);
  const projectModalRef = useRef<HTMLDivElement>(null);
  const modalScrollCtx = useRef<gsap.Context | null>(null);
  const isModalOpen = useRef(false);
  const isHoveringProject = useRef(false);
  const anchorPos = useRef({ x: 0, y: 0 });

  const [activeProject, setActiveProject] = useState<Project>(projectsData[0]);
  const [hoveredData, setHoveredData] = useState<{ project: Project; indexStr: string } | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (hoverImageRef.current) {
      gsap.set(hoverImageRef.current, {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "50% 0%",
      });
    }
  }, []);

  useEffect(() => {
    if (hoveredData) {
      gsap.fromTo(
        ".hover-card-slot",
        { y: "0em" },
        {
          y: "-2em",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          overwrite: "auto"
        }
      );
    }
  }, [hoveredData]);

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
          }
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
          }
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
            const currentVal = isFloat ? obj.val.toFixed(1) : Math.ceil(obj.val);
            valEl.innerHTML = `${prefix}${currentVal}${suffix}`;
          },
        });
      });
    }, projectModalRef);
  };

  const handleProjectEnter = (e: React.MouseEvent, project: Project, indexStr: string) => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (isModalOpen.current) return;

    isHoveringProject.current = true;
    setHoveredData({ project, indexStr });

    if (hoverImageRef.current) {
      const currentOpacity = Number(gsap.getProperty(hoverImageRef.current, "opacity"));
      anchorPos.current = { x: e.clientX, y: e.clientY };

      if (currentOpacity < 0.05) {
        gsap.set(hoverImageRef.current, {
          left: anchorPos.current.x,
          top: anchorPos.current.y,
          scaleY: 1.5,
          scaleX: 1,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0
        });
      } else {
        gsap.set(hoverImageRef.current, { scaleY: 1.15, scaleX: 1 });
      }

      gsap.to(hoverImageRef.current, {
        opacity: 1,
        scaleY: 1,
        scaleX: 1,
        backgroundColor: project.color,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  const handleProjectLeave = () => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (isModalOpen.current) return;
    
    isHoveringProject.current = false;
    
    if (hoverImageRef.current) {
      gsap.to(hoverImageRef.current, {
        opacity: 0,
        scaleY: 1.1,
        scaleX: 1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  const handleProjectMove = (e: React.MouseEvent, project: Project, indexStr: string, rect: DOMRect) => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (isModalOpen.current) return;

    if (!isHoveringProject.current) {
      handleProjectEnter(e, project, indexStr);
    }

    if (hoverImageRef.current) {
      const dampening = 0.15;
      const deltaX = e.clientX - anchorPos.current.x;
      const deltaY = e.clientY - anchorPos.current.y;
      const targetX = anchorPos.current.x + deltaX * dampening;
      const targetY = anchorPos.current.y + deltaY * dampening;

      const maxTilt = 20;
      const rotY = gsap.utils.clamp(-maxTilt, maxTilt, deltaX * 0.08);

      gsap.to(hoverImageRef.current, {
        left: targetX,
        top: targetY,
        rotationX: 0,
        rotationY: rotY,
        rotationZ: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  const handleProjectClick = (project: Project, indexStr: string) => {
    if (isModalOpen.current) return;
    isModalOpen.current = true;
    setActiveProject(project);
    setHoveredData({ project, indexStr });

    const isTouch = window.matchMedia("(hover: none)").matches;

    if (hoverImageRef.current) {
      if (isTouch) {
        gsap.set(hoverImageRef.current, {
          opacity: 1,
          backgroundColor: project.color,
          left: "50vw",
          top: "150vh",
          width: "100vw",
          height: "100vh",
          borderRadius: "2rem 2rem 0 0",
          scaleY: 1, scaleX: 1, rotationX: 0, rotationY: 0, rotationZ: 0
        });

        gsap.to(hoverImageRef.current, {
          top: "50vh",
          borderRadius: "0",
          duration: 0.8,
          ease: "power4.inOut",
          zIndex: 90,
        });
      } else {
        gsap.set(hoverImageRef.current, {
          opacity: 1,
          backgroundColor: project.color
        });
        gsap.to(hoverImageRef.current, {
          left: "50vw",
          top: "50vh",
          width: "100vw",
          height: "100vh",
          borderRadius: "0",
          scaleY: 1,
          scaleX: 1,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          duration: 0.8,
          ease: "power4.inOut",
          zIndex: 90,
        });
      }
    }

    if ((window as any).lenis) (window as any).lenis.stop();
    document.body.style.overflow = "hidden";

    gsap.to("#main-nav", { opacity: 0, duration: 0.3, pointerEvents: "none" });
    gsap.to("#main-nav", { display: "none", delay: 0.3});
    gsap.to("#main-logo", { opacity: 0, duration: 0.3, pointerEvents: "none" });
    gsap.to("#main-logo", { display: "none", delay: 0.3});

    gsap.to(projectModalRef.current, {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.1,
      delay: 0.4,
      onComplete: () => {
        initModalScrollAnimations();
      }
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
      }
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

    const isTouch = window.matchMedia("(hover: none)").matches;

    gsap.to(hoverImageRef.current, {
      top: isTouch ? "150vh" : hoverImageRef.current?.style.top,
      width: isTouch ? "100vw" : "300px",
      height: isTouch ? "100vh" : "400px",
      borderRadius: isTouch ? "2rem 2rem 0 0" : "8px",
      opacity: 0,
      scaleY: 1.1,
      scaleX: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      duration: 0.8,
      ease: "power4.inOut",
      delay: 0.3,
      onComplete: () => {
        isModalOpen.current = false;
        isHoveringProject.current = false;
        if ((window as any).lenis) (window as any).lenis.start();
        document.body.style.overflow = "";
        gsap.set(hoverImageRef.current, { zIndex: 10 });

        gsap.to("#main-nav", { opacity: 1, duration: 0.3});
        gsap.to("#main-nav", { display: "flex", delay: 0.3});
        gsap.to("#main-logo", { opacity: 1, delay: 0.3});
        gsap.to("#main-logo", { display: "flex", delay: 0.3});
      },
    });
  };

  return (
    <>
      {/* FIX: Removed bottom padding on mobile/tablet so the last row hits the absolute bottom cleanly */}
      <section id="work" className="min-h-[100dvh] flex flex-col justify-start pt-24 pb-0 lg:py-32 bg-[#201D1D] relative z-10">
        <div className="px-6 md:px-12 mb-8 md:mb-10 lg:mb-16 shrink-0">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter text-white">
            Selected Works
          </h2>
        </div>

        <div
          className="w-full flex-1 flex flex-col border-t border-white/10"
          onMouseLeave={() => {
            handleProjectLeave();
          }}
        >
          {projectsData.map((project, idx) => {
            const indexStr = String(idx + 1).padStart(2, "0");
            return (
              <ProjectItem
                key={project.id}
                project={project}
                indexStr={indexStr}
                onEnter={handleProjectEnter}
                onLeave={handleProjectLeave}
                onMove={handleProjectMove}
                onClick={handleProjectClick}
              />
            );
          })}
        </div>
      </section>

      <div
        ref={hoverImageRef}
        className="fixed top-0 left-0 w-[300px] h-[400px] rounded-lg pointer-events-none opacity-0 z-10 overflow-hidden flex justify-center items-center !bg-none"
        style={{ backgroundImage: 'none' }}
      >
        {hoveredData && (
          <>
            <div className="absolute w-[80%] top-6 left-6 md:top-10 md:left-10 text-white font-brisa text-3xl md:text-5xl lg:text-7xl z-20 pointer-events-none block">
              {hoveredData.project.title}
            </div>
            
            <div className="absolute -bottom-4 -right-2 md:-bottom-8 md:-right-4 text-white/20 font-palma-heavy text-[8rem] md:text-[10rem] lg:text-[12rem] font-bold z-0 leading-none pointer-events-none flex h-[1em] overflow-hidden">
              {hoveredData.indexStr.split('').map((char, i) => {
                const dummy1 = (parseInt(char) + 3) % 10;
                const dummy2 = (parseInt(char) + 7) % 10;
                return (
                  <span
                    key={`${hoveredData.project.id}-${i}`}
                    className="hover-card-slot flex flex-col -translate-y-[2em]"
                  >
                    <span className="h-[1em] flex items-center">{dummy1}</span>
                    <span className="h-[1em] flex items-center">{dummy2}</span>
                    <span className="h-[1em] flex items-center">{char}</span>
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>

      <ProjectModal
        activeProject={activeProject}
        modalRef={projectModalRef}
        onClose={closeProjectModal}
      />
    </>
  );
}