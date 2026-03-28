"use client";

import { PineOrb } from "./pine-orb";
import { CometRings } from "./comet-rings";
import { ContainerScroll } from "@/components/ui/container-scroll";

export function Hero() {
  return (
    <section className="relative bg-dark-base overflow-hidden">
      {/* Pine orb — atmospheric background */}
      <PineOrb />

      {/* Comet rings — orbiting traces */}
      <CometRings />

      {/* Scroll-driven product reveal */}
      <div className="relative z-10">
        <ContainerScroll
          titleComponent={
            <>
              <p className="font-pixel text-[10px] tracking-label uppercase text-accent-green mb-3">
                Coming Soon
              </p>
              <h1 className="font-display font-thin text-4xl sm:text-5xl md:text-7xl tracking-display uppercase text-[#EDE7DB] leading-none mb-3">
                Byt
              </h1>
              <p className="font-display font-extralight text-sm sm:text-base md:text-lg text-dark-text-dim tracking-wide mb-6 max-w-md mx-auto">
                8-bit Game Boy DMG synth with VHS wobble and tape degradation
              </p>
              <p className="font-pixel text-[10px] tracking-mono uppercase text-accent-amber/70 mb-8">
                In Development
              </p>
            </>
          }
        >
          <iframe
            src="/byt-prototype/index.html"
            className="w-full h-full border-0"
            title="Seris Byt — 8-bit Synth Plugin"
            style={{ pointerEvents: "auto" }}
          />
        </ContainerScroll>
      </div>
    </section>
  );
}
