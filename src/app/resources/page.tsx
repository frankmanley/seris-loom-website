import { SectionDark } from "@/components/layout/section-dark";
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";
import Link from "next/link";

const tools = [
  {
    name: "Metronome",
    href: "/resources/metronome",
    description: "Precision click track with tap tempo, time signatures, and accent patterns",
    status: "LIVE",
  },
  {
    name: "Pitch Tuner",
    href: "/resources/tuner",
    description: "Chromatic tuner with real-time pitch detection via your microphone",
    status: "LIVE",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <SectionDark className="pt-24">
        <h1 className="font-display font-thin text-4xl md:text-5xl tracking-display uppercase text-dark-text mb-4">
          Resources
        </h1>
        <p className="font-display font-extralight text-base text-dark-text-dim tracking-wide">
          Free tools for producers and engineers
        </p>
      </SectionDark>

      <ChannelStrip label="TOOLS" activeLEDs={tools.length} totalLEDs={4} />

      <SectionLight>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <div className="group border border-dark-border rounded-[--radius-card] p-6 bg-dark-surface hover:shadow-[0_2px_20px_rgba(74,106,66,0.08)] transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-light text-lg tracking-label uppercase text-dark-text">
                    {tool.name}
                  </h3>
                  <span className="font-pixel text-[9px] tracking-label uppercase px-1.5 py-0.5 rounded-sm bg-accent-green/20 text-accent-green">
                    {tool.status}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-dark-text-muted tracking-mono">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SectionLight>
    </>
  );
}
