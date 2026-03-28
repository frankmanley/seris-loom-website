"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PineOrb } from "./pine-orb";
import { CometRings } from "./comet-rings";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pluginRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1200",
          pin: true,
          scrub: 1,
        },
      });

      // Plugin starts scaled down, rotated, and transparent
      tl.fromTo(
        pluginRef.current,
        {
          scale: 0.7,
          rotateX: 25,
          opacity: 0,
          y: 60,
        },
        {
          scale: 1,
          rotateX: 0,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        }
      );

      // Then text fades in and slides up
      tl.fromTo(
        textRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-dark-base overflow-hidden min-h-screen flex flex-col items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Pine orb — atmospheric background */}
      <PineOrb />

      {/* Comet rings — orbiting traces */}
      <CometRings />

      {/* Plugin — animated in by scroll */}
      <div
        ref={pluginRef}
        className="relative z-10 w-full max-w-3xl px-4 opacity-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <iframe
          src="/byt-prototype/index.html"
          className="w-full h-[280px] sm:h-[350px] md:h-[420px] border-0 rounded-[--radius-card]"
          title="Seris Byt — 8-bit Synth Plugin"
          style={{ pointerEvents: "auto" }}
        />
      </div>

      {/* Text — animated in after plugin */}
      <div
        ref={textRef}
        className="relative z-10 text-center mt-8 opacity-0"
      >
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
