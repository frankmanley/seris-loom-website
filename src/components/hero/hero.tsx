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
    // Set initial states
    gsap.set(pluginRef.current, {
      scale: 0.85,
      rotateX: 15,
      opacity: 0,
      y: 30,
    });
    gsap.set(textRef.current, {
      opacity: 0,
      y: 20,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=2000",
        pin: true,
        scrub: 3,
        anticipatePin: 1,
      },
    });

    // Blank hold at start so pin settles
    tl.to({}, { duration: 0.2 });

    // Plugin eases in
    tl.to(pluginRef.current, {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "none",
    });

    // Text fades in
    tl.to(
      textRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "none",
      },
      "-=0.4"
    );

    // Hold at end so it feels complete before unpinning
    tl.to({}, { duration: 0.4 });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-dark-base overflow-hidden min-h-screen flex flex-col items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Pine orb */}
      <PineOrb />

      {/* Comet rings */}
      <CometRings />

      {/* Plugin */}
      <div
        ref={pluginRef}
        className="relative z-10 w-full max-w-3xl px-4"
        style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
      >
        <iframe
          src="/byt-prototype/index.html"
          className="w-full h-[280px] sm:h-[350px] md:h-[420px] border-0 rounded-[--radius-card]"
          title="Seris Byt — 8-bit Synth Plugin"
          style={{ pointerEvents: "auto" }}
        />
      </div>

      {/* Text */}
      <div
        ref={textRef}
        className="relative z-10 text-center mt-8"
        style={{ willChange: "transform, opacity" }}
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
