"use client";
import React, { RefObject } from "react";
import { Project } from "./types";

interface ProjectModalProps {
  activeProject: Project;
  modalRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export default function ProjectModal({ activeProject, modalRef, onClose }: ProjectModalProps) {
  return (
    <div
      ref={modalRef}
      data-lenis-prevent="true"
      className="fixed inset-0 z-100 pointer-events-none opacity-0 overflow-y-auto overflow-x-hidden text-white"
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 md:top-10 md:right-10 uppercase tracking-widest text-xs border border-white/20 rounded-full px-6 py-3 bg-black/20 backdrop-blur-md hover:bg-white hover:text-black transition-colors duration-300 z-50 mix-blend-normal hover:cursor-pointer-custom"
      >
        Close
      </button>
      
      <div className="w-full min-h-screen relative px-6 md:px-12 pb-32">
        
        {/* 
          FIX: Removed 'justify-end'. Added 'pt-[45vh]' for mobile and tablet. 
          This explicitly forces the main typography to begin exactly at the 45% 
          mark of the screen height, perfectly executing your "half the height" request.
        */}
        <div className="flex flex-col justify-start lg:justify-center pt-[45vh] lg:pt-0 pb-8 lg:pb-12 relative z-10 lg:min-h-[80vh]">
          <h2 className="modal-hero-animate font-display text-5xl md:text-7xl lg:text-[10vw] leading-[0.85] tracking-tighter uppercase mb-6 md:mb-8 mt-0">
            {activeProject.title}
          </h2>
          <div className="modal-hero-animate flex gap-8 md:gap-12 border-t border-white/20 pt-6 md:pt-8">
            <div>
              <span className="block text-[10px] md:text-xs uppercase tracking-widest text-white/50 mb-1 md:mb-2">
                Category
              </span>
              <span className="font-medium text-lg md:text-xl">{activeProject.category}</span>
            </div>
            <div>
              <span className="block text-[10px] md:text-xs uppercase tracking-widest text-white/50 mb-1 md:mb-2">
                Year
              </span>
              <span className="font-medium text-lg md:text-xl">{activeProject.year}</span>
            </div>
          </div>
        </div>

        <div className="py-16 md:py-24 lg:py-40 border-t border-white/20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="col-span-1 lg:col-span-4">
              <h3 className="modal-text-reveal font-display text-2xl uppercase tracking-tight mb-6">
                The Narrative
              </h3>
              <p className="modal-text-reveal text-base md:text-xl font-light text-white/80 leading-relaxed">
                {activeProject.desc}
              </p>
            </div>
            <div className="col-span-1 lg:col-span-8 flex flex-col gap-12 md:gap-16">
              <div>
                <h4 className="modal-text-reveal text-xs md:text-sm uppercase tracking-widest text-white/50 mb-4">
                  The Challenge
                </h4>
                <p className="modal-text-reveal text-xl md:text-3xl lg:text-4xl font-display leading-tight">
                  {activeProject.challenge}
                </p>
              </div>
              <div>
                <h4 className="modal-text-reveal text-xs md:text-sm uppercase tracking-widest text-white/50 mb-4">
                  The Solution
                </h4>
                <p className="modal-text-reveal text-xl md:text-3xl lg:text-4xl font-display leading-tight text-white/70 italic">
                  {activeProject.solution}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 md:mt-24 lg:mt-32 border-t border-white/10 pt-16">
            {activeProject.stats.map((stat, i) => (
              <div key={i} className="stat-container flex flex-col opacity-0">
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/50 mb-2">
                  {stat.label}
                </span>
                <span
                  className="stat-val font-display text-5xl md:text-6xl lg:text-7xl font-bold"
                  data-val={stat.val}
                  data-prefix={stat.prefix}
                  data-suffix={stat.suffix}
                  data-isfloat={stat.isFloat}
                  dangerouslySetInnerHTML={{ __html: `${stat.prefix}0${stat.suffix}` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="py-16 md:py-24 lg:py-32 relative z-10">
          <h3 className="modal-text-reveal font-display text-2xl uppercase tracking-tight mb-8 md:mb-12">
            Visual Exploration
          </h3>
          <div className="w-full flex flex-col gap-8 lg:gap-24">
            <div className="w-full h-[40vh] md:h-[60vh] lg:h-[80vh] overflow-hidden rounded-xl relative group">
              <img
                src={activeProject.images.gallery1}
                alt={`${activeProject.title} detail`}
                className="modal-parallax absolute -top-[15%] left-0 w-full h-[130%] object-cover"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 h-auto lg:h-[80vh]">
              <div className="h-[40vh] md:h-[60vh] lg:h-full overflow-hidden rounded-xl relative">
                <img
                  src={activeProject.images.gallery2}
                  alt={`${activeProject.title} detail 2`}
                  className="modal-parallax absolute -top-[15%] left-0 w-full h-[130%] object-cover"
                />
              </div>
              <div className="h-[40vh] md:h-[60vh] lg:h-full overflow-hidden rounded-xl relative mt-0 lg:mt-24">
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
          <h2 className="modal-text-reveal font-display text-3xl md:text-5xl lg:text-6xl mb-8">
            Next Project
          </h2>
          <button
            onClick={onClose}
            className="modal-text-reveal font-sans text-xs md:text-sm tracking-widest uppercase border-b border-white pb-1 hover:text-white/50 transition-colors hover:cursor-pointer-custom"
          >
            Return to Index
          </button>
        </div>
      </div>
    </div>
  );
}