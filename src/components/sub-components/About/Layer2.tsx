import { RefObject, MutableRefObject } from 'react';
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
          className="group relative cursor-pointer-custom text-[#FF3B00] text-3xl md:text-5xl lg:text-6xl mb-4 lg:mb-4 tracking-wide -rotate-10 font-brisa inline-block"
        >
          Introducing...
          <svg className="absolute left-0 -bottom-1 lg:-bottom-2 w-full h-3 lg:h-5" viewBox="0 0 200 20" preserveAspectRatio="none" fill="none">
            <path
              d="M 2,15 Q 60,0 120,12 T 198,5" stroke="#FF3B00" strokeWidth="3.5" strokeLinecap="round" pathLength="1"
              className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-all duration-500 ease-out group-hover:[stroke-dashoffset:0]"
            />
          </svg>
        </span>
        
        <h2 className="font-palma-heavy text-[13.5vw] lg:text-[11vw] font-black tracking-normal leading-[0.8] lg:leading-[0.5] uppercase text-[#1C1C1C] pointer-events-none">
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
        
        <p className="mt-6 lg:mt-12 text-sm md:text-lg lg:text-xl font-palma-medium max-w-xs md:max-w-sm lg:max-w-md text-[#1C1C1C]/80 pointer-events-none">
          The DIGITAL FRONTIER is here. The WORLD's most immersive WEB experiences unfold across the BROWSER.
        </p>
      </div>

      {bubblesData.map((bubble, idx) => {
        const mobileLeft = ['35%', '65%', '20%', '78%', '50%'][idx];
        
        const tabletLeft = ['30%', '85%', '65%', '15%', '50%'][idx];
        
        const desktopLeft = ['15%', '85%', '30%', '75%', '50%'][idx];
        
        return (
          <div
            key={bubble.id}
            ref={el => { bubblesRef.current[idx] = el; }}
            className="absolute z-30 rounded-full flex flex-col items-center justify-center shadow-2xl will-change-transform
                       w-[clamp(260px,70vw,350px)] h-[clamp(260px,70vw,350px)] 
                       md:w-[clamp(350px,50vw,500px)] md:h-[clamp(350px,50vw,500px)] 
                       lg:w-[var(--desktop-size)] lg:h-[var(--desktop-size)]
                       left-[var(--mobile-left)] md:left-[var(--tablet-left)] lg:left-[var(--desktop-left)]"
            style={{ 
              backgroundColor: bubble.bgColor, 
              '--desktop-size': bubble.size,
              '--desktop-left': desktopLeft,
              '--tablet-left': tabletLeft,
              '--mobile-left': mobileLeft,
              top: '100%' 
            } as React.CSSProperties}
          >
            <span className="font-palma-heavy text-[80px] md:text-[110px] lg:text-[150px] font-black leading-none text-white tracking-tighter">{bubble.value}</span>
            <span className="font-palma-heavy text-2xl md:text-3xl lg:text-5xl font-extrabold uppercase tracking-tight mt-1 lg:mt-4" style={{ color: bubble.textColor }}>{bubble.label}</span>
          </div>
        );
      })}
    </div>
  );
}