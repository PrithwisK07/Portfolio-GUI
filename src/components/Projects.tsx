"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { handleHoverRemove } from "./CustomCursor";

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

  const handleProjectEnter = (e: React.MouseEvent, project: Project, indexStr: string) => {
    if (isModalOpen.current) return;
    isHoveringProject.current = true;
    
    setHoveredData({ project, indexStr });

    if (hoverImageRef.current) {
      anchorPos.current = { x: e.clientX, y: e.clientY };

      // ALWAYS start fully elongated, regardless of whether it's jumping between rows
      gsap.set(hoverImageRef.current, { 
        left: anchorPos.current.x, 
        top: anchorPos.current.y,
        scaleY: 1.5, // Consistent downward elongation
        scaleX: 1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0
      });

      // Smooth shrink-up to original bottom
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
    if (isModalOpen.current) return;
    isHoveringProject.current = false;

    if (hoverImageRef.current) {
      // Elongate slightly back down while fading out
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

  const handleProjectMove = (e: React.MouseEvent, project: Project, rect: DOMRect) => {
    if (isModalOpen.current) return;

    if (hoverImageRef.current) {
      const dampening = 0.15;
      const deltaX = e.clientX - anchorPos.current.x;
      const deltaY = e.clientY - anchorPos.current.y;

      const targetX = anchorPos.current.x + deltaX * dampening;
      const targetY = anchorPos.current.y + deltaY * dampening;

      // Rotation for left/right tilt (CSS rotationY handles left/right pivoting)
      const maxTilt = 20; 
      const rotY = gsap.utils.clamp(-maxTilt, maxTilt, deltaX * 0.08);

      gsap.to(hoverImageRef.current, {
        left: targetX,
        top: targetY,
        rotationX: 0,
        rotationY: rotY,
        rotationZ: 0, // Strict constraints on X and Z
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  const handleProjectClick = (project: Project) => {
    if (isModalOpen.current) return;
    isModalOpen.current = true;
    setActiveProject(project);

    if ((window as any).lenis) (window as any).lenis.stop();
    document.body.style.overflow = "hidden";

    // Expand to full screen, ensuring scales and tilt are zeroed out
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

    gsap.to("#main-nav", { opacity: 0, duration: 0.3, pointerEvents: "none" });

    gsap.to(projectModalRef.current, {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.1,
      delay: 0.4,
    });
  };

  const closeProjectModal = () => {
    gsap.to(projectModalRef.current, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.3,
      delay: 0.2,
    });

    gsap.to(hoverImageRef.current, {
      width: "300px",
      height: "400px",
      borderRadius: "8px",
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
        gsap.to("#main-nav", { opacity: 1, duration: 0.3, pointerEvents: "auto" });
      },
    });
  };

  return (
    <>
      <section id="work" className="py-32 bg-[#201D1D]">
        <div className="px-6 md:px-12 mb-16">
          <h2 className="font-display text-6xl md:text-8xl tracking-tighter">
            Selected Works
          </h2>
        </div>

        <div
          className="w-full flex flex-col border-t border-white/10"
          onMouseLeave={() => {
            handleHoverRemove();
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
        className="fixed top-0 left-0 w-[300px] h-[400px] rounded-lg pointer-events-none opacity-0 z-10 overflow-hidden flex justify-center items-center"
      >
        {hoveredData && (
          <>
            <div className="absolute w-1/2 top-6 left-6 text-white font-brisa text-8xl z-20 pointer-events-none">
              {hoveredData.project.title}
            </div>
            <div className="absolute -bottom-8 right-0 text-white/20 font-palma-medium text-[12rem] font-bold z-0 leading-none pointer-events-none">
              {hoveredData.indexStr}
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