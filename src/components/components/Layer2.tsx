import { RefObject, MutableRefObject } from 'react';
import { handleHoverAdd, handleHoverRemove } from '../CustomCursor';
import { bubblesData } from './aboutData';

interface Layer2Props {
  lightLayerRef: RefObject<HTMLDivElement | null>;
  bubblesRef: MutableRefObject<(HTMLDivElement | null)[]>;
}

export default function Layer2({ lightLayerRef, bubblesRef }: Layer2Props) {
  return (
    <div 
      ref={lightLayerRef}
      className="absolute inset-0 flex items-center justify-center z-10 bg-[#F1F0E8] overflow-hidden"
    >
      <div className="layer-2-content relative z-20 text-center flex flex-col items-center pointer-events-auto px-4 translate-y-[4vh]">
        <span 
          className="group relative cursor-pointer text-[#FF3B00] text-4xl md:text-6xl mb-4 tracking-wide -rotate-10 font-brisa inline-block"
          onMouseEnter={handleHoverAdd}
          onMouseLeave={handleHoverRemove}
        >
          Introducing...
          <svg className="absolute left-0 -bottom-1 md:-bottom-2 w-full h-4 md:h-5" viewBox="0 0 200 20" preserveAspectRatio="none" fill="none">
            <path 
              d="M 2,15 Q 60,0 120,12 T 198,5" stroke="#FF3B00" strokeWidth="3.5" strokeLinecap="round" pathLength="1"
              className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-all duration-500 ease-out group-hover:[stroke-dashoffset:0]" 
            />
          </svg>
        </span>
        
        <h2 className="font-palma-heavy text-[15vw] md:text-[11vw] font-black tracking-normal leading-[0.5] uppercase text-[#1C1C1C] pointer-events-none">
          {['THE', 'BIGGEST', 'EVER'].map((word, wordIdx) => (
            <span key={wordIdx} className="block overflow-hidden">
              {word.split('').map((char, charIdx) => {
                const charCode = char.charCodeAt(0);
                const dummy1 = String.fromCharCode(((charCode + 5) % 26) + 65);
                const dummy2 = String.fromCharCode(((charCode + 11) % 26) + 65);
                const dummy3 = String.fromCharCode(((charCode + 17) % 26) + 65);
                const dummy4 = String.fromCharCode(((charCode + 23) % 26) + 65);

                return (
                  <span key={charIdx} className="relative inline-block h-[0.85em] overflow-hidden align-bottom">
                    <span className="invisible inline-flex h-[1em] items-center justify-center">{char}</span>
                    <span className="slot-reel absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center will-change-transform">
                      <span className="h-[0.7em] leading-none flex items-center justify-center">{dummy1}</span>
                      <span className="h-[1em] leading-none flex items-center justify-center">{dummy2}</span>
                      <span className="h-[1em] leading-none flex items-center justify-center">{dummy3}</span>
                      <span className="h-[1em] leading-none flex items-center justify-center">{dummy4}</span>
                      <span className="h-[1em] leading-none flex items-center justify-center">{char}</span>
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </h2>
        
        <p className="mt-8 md:mt-12 text-sm md:text-xl font-palma-medium max-w-md text-[#1C1C1C]/80 pointer-events-none">
          The DIGITAL FRONTIER is here. The WORLD&apos;s most immersive WEB experiences unfold across the BROWSER.
        </p>
      </div>

      {bubblesData.map((bubble, idx) => (
        <div
          key={bubble.id}
          ref={el => { bubblesRef.current[idx] = el; }}
          onMouseEnter={handleHoverAdd}
          onMouseLeave={handleHoverRemove}
          className="absolute z-30 rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer will-change-transform"
          style={{ backgroundColor: bubble.bgColor, width: bubble.size, height: bubble.size, left: bubble.left, top: '100%' }}
        >
          <span className="font-palma-heavy text-[80px] md:text-[150px] font-black leading-none text-white tracking-tighter">{bubble.value}</span>
          <span className="font-palma-heavy text-2xl md:text-5xl font-extrabold uppercase tracking-tight mt-2 md:mt-4" style={{ color: bubble.textColor }}>{bubble.label}</span>
        </div>
      ))}
    </div>
  );
}