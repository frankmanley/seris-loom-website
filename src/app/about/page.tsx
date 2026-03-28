import type { Metadata } from "next";
import { SectionDark } from "@/components/layout/section-dark";

export const metadata: Metadata = {
  title: "About",
  description: "Seris Loom builds utility-first audio tools for producers, engineers, and musicians who value precision over spectacle.",
};
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { RetroGrid } from "@/components/ui/retro-grid";
import { TextureOverlay } from "@/components/ui/texture-overlay";
import { GreenLine, GreenText, GreenDot, GreenSidebar } from "@/components/ui/green-accents";

export default function AboutPage() {
  return (
    <>
      <SectionDark className="pt-24 relative overflow-hidden">
        <RetroGrid
          angle={65}
          cellSize={40}
          opacity={0.12}
          darkLineColor="#4A6A42"
          lightLineColor="#4A6A42"
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <GreenDot size="lg" />
            <h1 className="font-display font-thin text-4xl md:text-5xl tracking-display uppercase text-dark-text">
              About
            </h1>
          </div>
          <p className="font-display font-extralight text-lg text-dark-text-dim tracking-wide max-w-2xl">
            Seris Loom builds utility-first audio tools for producers, engineers,
            and musicians who value <GreenText>precision over spectacle</GreenText>.
          </p>
          <GreenLine className="w-24 mt-8" />
        </div>
      </SectionDark>

      <ChannelStrip label="PHILOSOPHY" activeLEDs={3} />

      <SectionLight className="relative overflow-hidden">
        <TextureOverlay texture="crosshatch" opacity={0.025} className="mix-blend-overlay" />
        <div className="max-w-2xl mx-auto flex gap-6">
          <GreenSidebar className="shrink-0 hidden md:block" />
          <div className="space-y-6">
            <p className="font-body font-light text-base text-light-text leading-[1.8]">
              Between the signal and the silence, there is a thread. Every plugin
              in the Seris line follows this thread — amplifying what matters,
              attenuating what doesn&apos;t, and staying out of your way while doing it.
            </p>
            <p className="font-body font-light text-base text-light-text-dim leading-[1.8]">
              We design tools that disappear into the workflow. No gimmicks, no
              novelty naming, no decoration for its own sake. Information density
              is valued. <GreenText className="text-light-text">Utility over ornament, always.</GreenText>
            </p>
          </div>
        </div>
      </SectionLight>

      <ChannelStrip label="APPROACH" activeLEDs={2} />

      <SectionDark>
        <div className="max-w-2xl mx-auto flex gap-6">
          <GreenSidebar className="shrink-0 hidden md:block" />
          <div className="space-y-6">
            <p className="font-body font-light text-base text-dark-text-dim leading-[1.8]">
              Each Seris plugin begins with a single question: what does the
              producer need that they can&apos;t find? We build from the DSP up —
              core algorithm first, then the minimal interface required to control
              it. The signature sound isn&apos;t a marketing choice. It&apos;s a polynomial
              waveshaper baked into every plugin at <GreenText>~0.1% THD</GreenText>, always <GreenText>2x
              oversampled</GreenText>.
            </p>
            <p className="font-body font-light text-base text-dark-text-dim leading-[1.8]">
              The aesthetic draws from the equipment we grew up with — the warmth
              of analog consoles, the precision of digital signal processing, the
              feeling of turning a real knob on a real machine. Built with JUCE,
              designed for Ableton Live, tested in the real world.
            </p>
          </div>
        </div>
      </SectionDark>

      <ChannelStrip activeLEDs={0} />
    </>
  );
}
