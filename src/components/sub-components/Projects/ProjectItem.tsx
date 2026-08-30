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
      className="project-item group w-full py-8 md:py-12 px-4 md:px-12 flex justify-between items-center cursor-pointer-custom relative overflow-hidden active:bg-white/5 md:active:bg-transparent transition-colors"
      onMouseEnter={(e) => {
        onEnter(e, project, indexStr);
      }}
      onMouseLeave={() => {
        onLeave();
      }}
      onMouseMove={(e) => onMove(e, project, indexStr, e.currentTarget.getBoundingClientRect())}
      onClick={() => onClick(project, indexStr)}
    >
      {/* SHUTTER BACKGROUND (Desktop only via md:group-hover) */}
      <div className="absolute bottom-0 left-0 w-full h-0 bg-white transition-all duration-700 ease-out hidden md:block md:group-hover:h-full z-0" />
      
      {/* LEFT CONTENT */}
      <div className="flex items-center gap-3 md:gap-6 transition-transform duration-700 ease-out md:group-hover:translate-x-20 relative z-10">
        
        {/* SLOT MACHINE INDEX */}
        <span className="font-palma-heavy text-2xl md:text-6xl inline-flex h-[1em] overflow-hidden leading-none relative z-10 tracking-tighter">
          {indexStr.split('').map((char, i) => {
            const dummy = (parseInt(char) + 5) % 10;
            return (
              <span
                key={i}
                className="flex flex-col transition-transform duration-700 ease-out md:group-hover:-translate-y-[2em]"
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <span className="h-[1em] flex items-center text-white">{char}</span>
                <span className="h-[1em] flex items-center text-[#201D1D]">{dummy}</span>
                <span className="h-[1em] flex items-center text-[#201D1D]">{char}</span>
              </span>
            );
          })}
        </span>
        
        {/* ARROW: Always visible on mobile, hover-only on desktop */}
        <span className="opacity-100 translate-x-0 md:opacity-0 md:-translate-x-10 md:group-hover:opacity-100 md:group-hover:translate-x-0 font-display text-xl md:text-4xl text-red-600 transition-all duration-700 ease-out">
          →
        </span>
        
        {/* TITLE */}
        <h3 className="font-display text-2xl md:text-6xl tracking-tight pointer-events-none text-white md:group-hover:text-[#201D1D] transition-colors duration-700 ease-out">
          {project.title}
        </h3>
        
      </div>

      {/* RIGHT CONTENT */}
      <div className="text-right transition-transform duration-700 ease-out md:group-hover:-translate-x-12 pointer-events-none relative z-10 flex flex-col md:block">
        
        {/* YEAR */}
        <span className="block text-[10px] md:text-sm uppercase tracking-widest text-white/50 md:group-hover:text-[#201D1D]/70 transition-colors duration-700 ease-out mb-1 md:mb-0">
          {project.year}
        </span>
        
        {/* CATEGORY */}
        <span className="block text-xs md:text-base font-medium text-white/80 md:group-hover:text-[#201D1D] transition-colors duration-700 ease-out">
          {project.category}
        </span>
        
      </div>
    </div>
  );
}