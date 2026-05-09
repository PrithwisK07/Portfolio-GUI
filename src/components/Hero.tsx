"use client";
import MeteorShower from "./MeteorShower";

export default function Hero() {
  return (
    <section className="h-screen w-full flex flex-col justify-center px-6 md:px-12 pt-20 relative overflow-hidden">
      
      {/* The falling stars background */}
      <MeteorShower />

      <div className="max-w-[90vw] relative z-10">
        <h1 className="font-display text-[12vw] md:text-[8vw] leading-[0.85] tracking-tighter uppercase mb-6 hero-title">
          <div className="reveal-text-wrapper"><span className="reveal-text">Designing</span></div><br/>
          <div className="reveal-text-wrapper"><span className="reveal-text">The Unseen</span></div><br/>
          <div className="reveal-text-wrapper"><span className="reveal-text text-white/40 italic">Digital Realities.</span></div>
        </h1>
      </div>
      
      <div className="absolute bottom-10 left-6 md:left-12 flex items-center gap-4 text-xs tracking-widest uppercase opacity-0 hero-meta z-10">
        <div className="w-10 h-px bg-white/50"></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}