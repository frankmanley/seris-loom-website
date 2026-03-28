"use client";

import { PineOrb } from "./pine-orb";
import { CometRings } from "./comet-rings";

export function Hero() {
  return (
    <section className="relative bg-dark-base overflow-hidden min-h-screen flex flex-col items-center justify-center px-4">
      <PineOrb />
      <CometRings />

      {/* Plugin */}
      <div className="relative z-10 w-full max-w-3xl">
        <iframe
          src="/byt-prototype/index.html"
          className="w-full h-[280px] sm:h-[350px] md:h-[420px] border-0 rounded-[--radius-card]"
          title="Seris Byt — 8-bit Synth Plugin"
        />
      </div>

      {/* Text */}
      <div className="relative z-10 text-center mt-8">
        <p className="font-pixel text-[10px] tracking-label uppercase text-accent-green mb-3">
          Coming Soon
        </p>
        <h1 className="font-display font-thin text-4xl sm:text-5xl md:text-7xl tracking-display uppercase text-[#EDE7DB] leading-none mb-3">
          Byt
        </h1>
        <p className="font-display font-extralight text-sm sm:text-base md:text-lg text-dark-text-dim tracking-wide mb-6 max-w-md mx-auto">
          8-bit Game Boy DMG synth with VHS wobble and tape degradation
        </p>
        <p className="font-pixel text-[10px] tracking-mono uppercase text-accent-amber/70">
          In Development
        </p>
      </div>
    </section>
  );
}
