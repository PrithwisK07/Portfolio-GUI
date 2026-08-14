"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import "./Footer.css";

const PlaneButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isAnimating = useRef(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnimating.current || !buttonRef.current) return;
    isAnimating.current = true;

    const button = buttonRef.current;
    const getVar = (variable: string) =>
      getComputedStyle(button).getPropertyValue(variable).trim();

    // Plane geometry & flight path animation
    gsap.to(button, {
      keyframes: [
        {
          "--left-wing-first-x": 50,
          "--left-wing-first-y": 100,
          "--right-wing-second-x": 50,
          "--right-wing-second-y": 100,
          duration: 0.2,
          onComplete() {
            gsap.set(button, {
              "--left-wing-first-y": 0,
              "--left-wing-second-x": 40,
              "--left-wing-second-y": 100,
              "--left-wing-third-x": 0,
              "--left-wing-third-y": 100,
              "--left-body-third-x": 40,
              "--right-wing-first-x": 50,
              "--right-wing-first-y": 0,
              "--right-wing-second-x": 60,
              "--right-wing-second-y": 100,
              "--right-wing-third-x": 100,
              "--right-wing-third-y": 100,
              "--right-body-third-x": 60,
            });
          },
        },
        {
          "--left-wing-third-x": 20,
          "--left-wing-third-y": 90,
          "--left-wing-second-y": 90,
          "--left-body-third-y": 90,
          "--right-wing-third-x": 80,
          "--right-wing-third-y": 90,
          "--right-body-third-y": 90,
          "--right-wing-second-y": 90,
          duration: 0.2,
        },
        {
          "--rotate": 50,
          "--left-wing-third-y": 95,
          "--left-wing-third-x": 27,
          "--right-body-third-x": 45,
          "--right-wing-second-x": 45,
          "--right-wing-third-x": 60,
          "--right-wing-third-y": 83,
          duration: 0.25,
        },
        {
          "--rotate": 60,
          "--plane-x": -8,
          "--plane-y": 40,
          duration: 0.2,
        },
        {
          "--rotate": 40,
          "--plane-x": 45,
          "--plane-y": -300,
          "--plane-opacity": 0,
          duration: 0.375,
          onComplete() {
            setTimeout(() => {
              // Reset properties gracefully after flight
              gsap.set(button, { clearProps: "all" });
              gsap.fromTo(
                button,
                { opacity: 0, y: -8 },
                {
                  opacity: 1,
                  y: 0,
                  clearProps: "all",
                  duration: 0.3,
                  onComplete() {
                    isAnimating.current = false;
                  },
                }
              );
            }, 1800);
          },
        },
      ],
    });

    // Color shifting & success trail animation
    gsap.to(button, {
      keyframes: [
        {
          "--text-opacity": 0,
          "--border-radius": 0,
          "--left-wing-background": getVar("--primary-dark"),
          "--right-wing-background": getVar("--primary-dark"),
          duration: 0.11,
        },
        {
          "--left-wing-background": getVar("--primary"),
          "--right-wing-background": getVar("--primary"),
          duration: 0.14,
        },
        {
          "--left-body-background": getVar("--primary-dark"),
          "--right-body-background": getVar("--primary-darkest"),
          duration: 0.25,
          delay: 0.1,
        },
        {
          "--trails-stroke": 171,
          duration: 0.22,
          delay: 0.22,
        },
        {
          "--success-opacity": 1,
          "--success-x": 0,
          duration: 0.2,
          delay: 0.15,
        },
        {
          "--success-stroke": 0,
          duration: 0.15,
        },
      ],
    });
  };

  return (
    <button ref={buttonRef} onClick={handleClick} className="plane-btn">
      <span className="default">Send</span>
      <span className="success">
        <svg viewBox="0 0 16 16">
          <polyline points="3.75 9 7 12 13 5"></polyline>
        </svg>
        Sent
      </span>
      <svg className="trails" viewBox="0 0 33 64">
        <path d="M26,4 C28,13.3333333 29,22.6666667 29,32 C29,41.3333333 28,50.6666667 26,60"></path>
        <path d="M6,4 C8,13.3333333 9,22.6666667 9,32 C9,41.3333333 8,50.6666667 6,60"></path>
      </svg>
      <div className="plane">
        <div className="left"></div>
        <div className="right"></div>
      </div>
    </button>
  );
};

export default function Footer() {
  const btnRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isExpanded) return;
    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn || !text) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
    gsap.to(text, { x: x * 0.1, y: y * 0.1, duration: 0.4, ease: "power2.out" });
  };

  const handleMagneticLeave = () => {
    if (isExpanded) return;
    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn || !text) return;

    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    gsap.to(text, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
  };

  const handleExpand = () => {
    if (isExpanded) return;
    setIsExpanded(true);

    const btn = btnRef.current;
    const text = textRef.current;
    const content = contentRef.current;

    gsap.killTweensOf(btn);
    gsap.killTweensOf(text);

    const targetWidth = Math.min(window.innerWidth * 0.9, 800);
    const targetHeight = Math.max(window.innerHeight * 0.6, 400);

    const tl = gsap.timeline();

    tl.to(text, { opacity: 0, duration: 0.2 }, 0)
      .to(
        btn,
        {
          x: 0,
          y: 0,
          width: targetWidth,
          height: targetHeight,
          borderRadius: 32,
          rotation: 180, 
          backgroundColor: "#050505",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#ffffff",
          duration: 0.8,
          ease: "power4.inOut",
        },
        0
      )
      .fromTo(
        content,
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" },
        "-=0.3"
      );
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();

    const btn = btnRef.current;
    const text = textRef.current;
    const content = contentRef.current;

    const tl = gsap.timeline({
      onComplete: () => setIsExpanded(false),
    });

    tl.to(content, { autoAlpha: 0, scale: 0.95, duration: 0.3 }, 0)
      .to(
        btn,
        {
          width: 280,
          height: 88,
          borderRadius: 44,
          rotation: 0,
          backgroundColor: "#f4f4f5",
          border: "0px solid rgba(255, 255, 255, 0)",
          color: "#050505",
          duration: 0.8,
          ease: "power4.inOut",
          clearProps: "backgroundColor,color,border",
        },
        0
      )
      .to(text, { opacity: 1, duration: 0.3 }, "-=0.3");
  };

  return (
    <section id="contact" className="h-screen py-32 px-6 md:px-12 flex flex-col justify-center items-center text-center relative border-t border-white/10 overflow-hidden bg-[#201D1D]">
      <div
        className="absolute inset-0 pointer-events-none opacity-60 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)`,
          backgroundSize: "96px 96px",
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full font-display text-[20vw] font-black text-white/4 whitespace-nowrap pointer-events-none tracking-tighter z-0">
        HELLO
      </div>

      <h2 className="font-display text-4xl md:text-7xl mb-12 max-w-4xl tracking-tight relative z-10">
        Ready to create something extraordinary?
      </h2>

      <div
        ref={btnRef}
        onClick={handleExpand}
        className={`magnetic-btn font-display font-semibold text-xl flex flex-col items-center justify-center relative overflow-hidden z-20 shadow-2xl bg-[#f4f4f5] text-[#050505] border-0 border-transparent ${
          !isExpanded
            ? "hover:bg-accent transition-colors duration-300 cursor-pointer-custom"
            : "cursor-default"
        }`}
        style={{
          width: 280,
          height: 88,
          borderRadius: 44,
        }}
        onMouseLeave={() => {
          if (!isExpanded) handleMagneticLeave();
        }}
        onMouseMove={handleMagneticMove}
      >
        <span ref={textRef} className="block pointer-events-none absolute">
          Initiate Contact
        </span>

        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col justify-center items-center opacity-0 invisible p-8 w-full h-full rotate-180"
        >
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:bg-white hover:text-black hover:border-transparent transition-colors z-30 cursor-pointer-custom"
          >
            ✕
          </button>

          <h3 className="font-display text-lg md:text-xl text-white/40 mb-2 uppercase tracking-widest relative z-10">
            Drop us a line
          </h3>
          
          <a
            href="mailto:hello@aether.com"
            className="font-display text-2xl md:text-4xl text-white hover:text-accent transition-colors relative z-30 mb-8"
          >
            hello@aether.com
          </a>

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-30 w-full max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Or leave your email..." 
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/30 font-display" 
            />
            <PlaneButton />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 w-full flex justify-between px-6 md:px-12 text-xs uppercase tracking-widest text-white/40 z-10">
        <span>Based in the Void</span>
        <span>© Aether 2026</span>
      </div>
    </section>
  );
}