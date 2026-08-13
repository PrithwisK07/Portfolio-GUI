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
      className="project-item group w-full py-12 px-6 md:px-12 flex justify-between items-center cursor-pointer relative overflow-hidden"
      onMouseEnter={(e) => {
        onEnter(e, project, indexStr);
      }}
      onMouseLeave={() => {
        onLeave();
      }}
      onMouseMove={(e) => onMove(e, project, indexStr, e.currentTarget.getBoundingClientRect())}
      onClick={() => onClick(project, indexStr)}
    >
      {/* SHUTTER BACKGROUND */}
      <div className="absolute bottom-0 left-0 w-full h-0 bg-white transition-all duration-700 ease-out group-hover:h-full z-0" />

      {/* LEFT CONTENT */}
      <div className="flex items-center gap-6 transition-transform duration-700 ease-out group-hover:translate-x-20 relative z-10">
        
        {/* SLOT MACHINE INDEX */}
        <span className="font-palma-heavy text-4xl md:text-6xl inline-flex h-[1em] overflow-hidden leading-none relative z-10 tracking-tighter">
          {indexStr.split('').map((char, i) => {
            const dummy = (parseInt(char) + 5) % 10;
            return (
              <span 
                key={i} 
                className="flex flex-col transition-transform duration-700 ease-out group-hover:-translate-y-[2em]"
                style={{ transitionDelay: `${i * 75}ms` }} 
              >
                <span className="h-[1em] flex items-center text-white">{char}</span>
                <span className="h-[1em] flex items-center text-[#201D1D]">{dummy}</span>
                <span className="h-[1em] flex items-center text-[#201D1D]">{char}</span>
              </span>
            );
          })}
        </span>
        
        {/* ARROW */}
        <span className="opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 font-display text-3xl md:text-4xl text-red-600 transition-all duration-700 ease-out">
          →
        </span>
        
        {/* TITLE */}
        <h3 className="font-display text-4xl md:text-6xl tracking-tight pointer-events-none text-white group-hover:text-[#201D1D] transition-colors duration-700 ease-out">
          {project.title}
        </h3>
        
      </div>
      
      {/* RIGHT CONTENT */}
      <div className="text-right transition-transform duration-700 ease-out group-hover:-translate-x-12 pointer-events-none relative z-10">
        
        {/* YEAR */}
        <span className="block text-sm uppercase tracking-widest text-white/50 group-hover:text-[#201D1D]/70 transition-colors duration-700 ease-out">
          {project.year}
        </span>
        
        {/* CATEGORY */}
        <span className="block font-medium text-white/80 group-hover:text-[#201D1D] transition-colors duration-700 ease-out">
          {project.category}
        </span>
        
      </div>
    </div>
  );
}