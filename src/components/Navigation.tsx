"use client";
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 mix-blend-difference" id="main-nav">
      <div className="font-display font-bold text-xl tracking-tighter" onMouseEnter={handleHoverAdd} onMouseLeave={handleHoverRemove}>AETHER ©</div>
      <div className="flex gap-8 text-sm font-medium tracking-wide">
        <a href="#work" className="relative group hidden md:block" onMouseEnter={handleHoverAdd} onMouseLeave={handleHoverRemove}>
          WORK
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#about" className="relative group hidden md:block" onMouseEnter={handleHoverAdd} onMouseLeave={handleHoverRemove}>
          ABOUT
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
        </a>
        <button className="uppercase tracking-widest text-xs border border-white/20 rounded-full px-4 py-2 hover:bg-white hover:text-dark transition-colors duration-300" onMouseEnter={handleHoverAdd} onMouseLeave={handleHoverRemove}>Menu</button>
      </div>
    </nav>
  );
}