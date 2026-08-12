"use client";
import React from "react";
import { Project } from "./types";
import { handleHoverAdd, handleHoverRemove } from "../../CustomCursor";

interface ProjectItemProps {
  project: Project;
  indexStr: string;
  onEnter: (e: React.MouseEvent, project: Project, indexStr: string) => void;
  onLeave: () => void;
  onMove: (e: React.MouseEvent, project: Project, rect: DOMRect) => void;
  onClick: (project: Project) => void;
}

export default function ProjectItem({ project, indexStr, onEnter, onLeave, onMove, onClick }: ProjectItemProps) {
  return (
    <div
      className="project-item group w-full py-12 px-6 md:px-12 flex justify-between items-center cursor-pointer relative overflow-hidden"
      onMouseEnter={(e) => {
        handleHoverAdd();
        onEnter(e, project, indexStr);
      }}
      onMouseLeave={() => {
        handleHoverRemove();
        onLeave();
      }}
      onMouseMove={(e) => onMove(e, project, e.currentTarget.getBoundingClientRect())}
      onClick={() => onClick(project)}
    >
      {/* 
        THE SHUTTER BACKGROUND 
        An absolute div pinned to the bottom that grows upward on hover. 
        -z-10 keeps it behind the text, but inside the row.
      */}
      <div className="absolute bottom-0 left-0 w-full h-0 bg-white transition-all duration-700 ease-out group-hover:h-full z-0" />

      {/* 
        LEFT CONTENT 
        Added 'relative z-10' to ensure it sits on top of the white shutter background 
      */}
      <div className="flex items-center gap-4 transition-transform duration-700 ease-out group-hover:translate-x-20 relative px-5 py-1 z-10">
        
        {/* INDEX */}
        <span className="font-palma-heavy text-3xl md:text-6xl text-white group-hover:text-[#201D1D] transition-colors duration-700 ease-out">
          {indexStr}
        </span>
        
        {/* ARROW */}
        <span className="opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 font-display text-3xl text-accent transition-all duration-700 ease-out">
          →
        </span>
        
        {/* TITLE */}
        <h3 className="font-display text-4xl md:text-6xl tracking-tight pointer-events-none text-white group-hover:text-[#201D1D] transition-colors duration-700 ease-out">
          {project.title}
        </h3>
        
      </div>
      
      {/* 
        RIGHT CONTENT 
        Added 'relative z-10' to ensure it sits on top of the white shutter background 
      */}
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