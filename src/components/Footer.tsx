"use client";
import gsap from 'gsap';
import { handleHoverAdd, handleHoverRemove } from './CustomCursor';

export default function Footer() {
  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const btnText = btn.querySelector('span');
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    gsap.to(btnText, { x: x * 0.1, y: y * 0.1, duration: 0.4, ease: 'power2.out' });
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const btnText = btn.querySelector('span');
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    gsap.to(btnText, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <section id="contact" className="h-screen py-32 px-6 md:px-12 flex flex-col justify-center items-center text-center relative border-t border-white/10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full font-display text-[20vw] font-black text-white/2 whitespace-nowrap pointer-events-none tracking-tighter">
        HELLO
      </div>
      <h2 className="font-display text-4xl md:text-7xl mb-12 max-w-4xl tracking-tight relative z-10">
        Ready to create something extraordinary?
      </h2>
      <a 
        href="#" 
        className="magnetic-btn font-display font-semibold text-xl inline-flex items-center justify-center py-8 px-16 rounded-full bg-light text-dark relative overflow-hidden transition-colors hover:bg-accent hover:text-light" 
        onMouseEnter={handleHoverAdd}
        onMouseLeave={(e) => { handleHoverRemove(); handleMagneticLeave(e); }}
        onMouseMove={handleMagneticMove}
      >
        <span className="block pointer-events-none">Initiate Contact</span>
      </a>
      <div className="absolute bottom-6 w-full flex justify-between px-6 md:px-12 text-xs uppercase tracking-widest text-white/40">
        <span>Based in the Void</span>
        <span>© Aether 2026</span>
      </div>
    </section>
  );
}