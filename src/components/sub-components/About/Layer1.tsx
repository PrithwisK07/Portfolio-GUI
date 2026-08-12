import { textSideA } from './aboutData';

export default function Layer1() {
  return (
    <div className="absolute inset-0 flex items-center px-6 md:px-12 z-[1] bg-dark">
      <div className="w-full flex flex-col md:flex-row justify-between items-start">
        <div className="w-full md:w-1/4 mb-12 md:mb-0">
          <h3 className="font-display text-sm tracking-widest uppercase opacity-60">Manifesto</h3>
        </div>
        <div className="w-full md:w-3/4">
          <p className="font-display text-3xl md:text-5xl leading-tight tracking-tight">
            {textSideA.split(' ').map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-2 md:mr-3">
                <span className="about-word-span inline-block transform translate-y-full">
                  {word}
                </span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}