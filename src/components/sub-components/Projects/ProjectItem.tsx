"use client";
import React from "react";
import { Project } from "./types";

interface ProjectItemProps {
  project: Project;
  indexStr: string;
  onEnter: (e: React.MouseEvent, project: Project, indexStr: string) => void;
  onLeave: () => void;
  onMove: (e: React.MouseEvent, project: Project, indexStr: string, rect: DOMRect) => void;
  onClick: (project: Project, indexStr: string) => void;
}

export default function ProjectItem({ project, indexStr, onEnter, onLeave, onMove, onClick }: ProjectItemProps) {
  return (
    <div
      // FIX: Changed 'md:flex-none' to 'lg:flex-none' so tablet AND mobile both dynamically stretch to fill the height
      className="project-item group w-full flex-1 lg:flex-none py-6 md:py-8 lg:py-12 px-4 md:px-8 lg:px-12 flex justify-between items-center cursor-pointer-custom relative overflow-hidden active:bg-white/5 lg:active:bg-transparent transition-colors"
      onMouseEnter={(e) => {
        onEnter(e, project, indexStr);
      }}
      onMouseLeave={() => {
        onLeave();
      }}
      onMouseMove={(e) => onMove(e, project, indexStr, e.currentTarget.getBoundingClientRect())}
      onClick={() => onClick(project, indexStr)}
    >
      <div className="absolute bottom-0 left-0 w-full h-0 bg-white transition-all duration-700 ease-out hidden lg:block lg:group-hover:h-full z-0" />
      
      <div className="flex items-center gap-4 md:gap-6 transition-transform duration-700 ease-out lg:group-hover:translate-x-20 relative z-10">
        
        <span className="font-palma-heavy text-3xl md:text-5xl lg:text-6xl inline-flex h-[1em] overflow-hidden leading-none relative z-10 tracking-tighter">
          {indexStr.split('').map((char, i) => {
            const dummy = (parseInt(char) + 5) % 10;
            return (
              <span
                key={i}
                className="flex flex-col transition-transform duration-700 ease-out lg:group-hover:-translate-y-[2em]"
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <span className="h-[1em] flex items-center text-white">{char}</span>
                <span className="h-[1em] flex items-center text-[#201D1D]">{dummy}</span>
                <span className="h-[1em] flex items-center text-[#201D1D]">{char}</span>
              </span>
            );
          })}
        </span>
        
        <span className="hidden lg:inline-block lg:opacity-0 lg:-translate-x-10 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 font-display text-4xl text-red-600 transition-all duration-700 ease-out">
          →
        </span>
        
        <h3 className="font-display text-3xl md:text-5xl lg:text-6xl tracking-tight pointer-events-none text-white lg:group-hover:text-[#201D1D] transition-colors duration-700 ease-out">
          {project.title}
        </h3>
        
      </div>

      <div className="text-right transition-transform duration-700 ease-out lg:group-hover:-translate-x-12 pointer-events-none relative z-10 flex flex-col md:block">
        <span className="block text-[10px] md:text-xs lg:text-sm uppercase tracking-widest text-white/50 lg:group-hover:text-[#201D1D]/70 transition-colors duration-700 ease-out mb-1 md:mb-0">
          {project.year}
        </span>
        <span className="block text-sm md:text-base font-medium text-white/80 lg:group-hover:text-[#201D1D] transition-colors duration-700 ease-out">
          {project.category}
        </span>
      </div>
    </div>
  );
}