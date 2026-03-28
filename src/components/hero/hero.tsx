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
                Res
              </h1>
              <p className="font-display font-extralight text-sm sm:text-base md:text-lg text-dark-text-dim tracking-wide mb-6 max-w-md mx-auto">
                Resonance extraction for the space between intention and sound
              </p>
              <p className="font-pixel text-[10px] tracking-mono uppercase text-accent-amber/70 mb-8">
                In Development
              </p>
            </>
          }
        >
          <img
            src="/images/res-screenshot.png"
            alt="Seris Res — Resonance Extractor VST3 Plugin"
            className="w-full h-full object-contain"
          />
        </ContainerScroll>
      </div>
    </section>
  );
}
