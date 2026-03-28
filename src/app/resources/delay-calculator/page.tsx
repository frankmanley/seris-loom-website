"use client";

import { useState } from "react";
import { SectionDark } from "@/components/layout/section-dark";
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { GreenLine } from "@/components/ui/green-accents";
import { cn } from "@/lib/utils";

const DIVISIONS = [
  { label: "1/1", mult: 4 },
  { label: "1/2", mult: 2 },
  { label: "1/2d", mult: 3, dotted: true },
  { label: "1/2t", mult: 4 / 3, triplet: true },
  { label: "1/4", mult: 1 },
  { label: "1/4d", mult: 1.5, dotted: true },
  { label: "1/4t", mult: 2 / 3, triplet: true },
  { label: "1/8", mult: 0.5 },
  { label: "1/8d", mult: 0.75, dotted: true },
  { label: "1/8t", mult: 1 / 3, triplet: true },
  { label: "1/16", mult: 0.25 },
  { label: "1/16d", mult: 0.375, dotted: true },
  { label: "1/16t", mult: 1 / 6, triplet: true },
  { label: "1/32", mult: 0.125 },
  { label: "1/32d", mult: 0.1875, dotted: true },
  { label: "1/32t", mult: 1 / 12, triplet: true },
  { label: "1/64", mult: 0.0625 },
];

function bpmToMs(bpm: number, mult: number): number {
  return (60000 / bpm) * mult;
}

function msToHz(ms: number): number {
  return 1000 / ms;
}

function msToSamples(ms: number, sampleRate: number): number {
  return Math.round((ms / 1000) * sampleRate);
}

export default function DelayCalculatorPage() {
  const [bpm, setBpm] = useState(120);
  const [sampleRate, setSampleRate] = useState(44100);

  return (
    <>
      {/* Calculator widget */}
      <SectionDark className="pt-20 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* BPM input */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="font-display font-thin text-7xl md:text-8xl text-dark-text leading-none tabular-nums">
                {bpm}
              </div>
              <span className="font-pixel text-[10px] tracking-mono uppercase text-dark-text-muted">BPM</span>
            </div>
          </div>

          <div className="mb-6 px-8">
            <input
              type="range"
              min={20}
              max={300}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full h-px appearance-none bg-dark-border cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-green [&::-webkit-slider-thumb]:shadow-[0_0_8px_#4A6A42]"
            />
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[9px] text-dark-text-muted">20</span>
              <span className="font-mono text-[9px] text-dark-text-muted">300</span>
            </div>
          </div>

          {/* Sample rate selector */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[44100, 48000, 88200, 96000].map((sr) => (
              <button
                key={sr}
                onClick={() => setSampleRate(sr)}
                className={cn(
                  "font-mono text-[10px] px-3 py-1 rounded-[--radius-btn] border transition-colors",
                  sampleRate === sr
                    ? "border-accent-green text-accent-green bg-accent-green/10"
                    : "border-dark-border text-dark-text-muted hover:text-dark-text"
                )}
              >
                {(sr / 1000).toFixed(1)}k
              </button>
            ))}
          </div>

          {/* Results table */}
          <div className="border border-dark-border rounded-[--radius-card] overflow-hidden">
            <div className="grid grid-cols-5 gap-px bg-dark-border text-center">
              <div className="bg-dark-surface py-2 px-2">
                <span className="font-mono text-[9px] text-dark-text-muted uppercase">Division</span>
              </div>
              <div className="bg-dark-surface py-2 px-2">
                <span className="font-mono text-[9px] text-dark-text-muted uppercase">ms</span>
              </div>
              <div className="bg-dark-surface py-2 px-2">
                <span className="font-mono text-[9px] text-dark-text-muted uppercase">Hz</span>
              </div>
              <div className="bg-dark-surface py-2 px-2">
                <span className="font-mono text-[9px] text-dark-text-muted uppercase">Samples</span>
              </div>
              <div className="bg-dark-surface py-2 px-2">
                <span className="font-mono text-[9px] text-dark-text-muted uppercase">Type</span>
              </div>

              {DIVISIONS.map((div) => {
                const ms = bpmToMs(bpm, div.mult);
                const hz = msToHz(ms);
                const samples = msToSamples(ms, sampleRate);
                const isDotted = "dotted" in div;
                const isTriplet = "triplet" in div;

                return (
                  <div key={div.label} className="contents">
                    <div className="bg-dark-base py-2 px-2">
                      <span className="font-mono text-xs text-dark-text">{div.label}</span>
                    </div>
                    <div className="bg-dark-base py-2 px-2">
                      <span className="font-mono text-xs text-accent-green tabular-nums">{ms.toFixed(1)}</span>
                    </div>
                    <div className="bg-dark-base py-2 px-2">
                      <span className="font-mono text-xs text-dark-text-dim tabular-nums">{hz.toFixed(2)}</span>
                    </div>
                    <div className="bg-dark-base py-2 px-2">
                      <span className="font-mono text-xs text-dark-text-dim tabular-nums">{samples}</span>
                    </div>
                    <div className="bg-dark-base py-2 px-2">
                      <span className={cn(
                        "font-mono text-[9px] uppercase",
                        isDotted ? "text-accent-amber" : isTriplet ? "text-accent-amber/60" : "text-dark-text-muted"
                      )}>
                        {isDotted ? "dot" : isTriplet ? "trip" : "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionDark>

      <ChannelStrip label="DELAY CALC" activeLEDs={2} />

      {/* SEO content */}
      <SectionLight>
        <div className="max-w-2xl mx-auto">
          <p className="font-pixel text-[10px] tracking-label uppercase text-accent-green mb-3">
            Free Tool
          </p>
          <h1 className="font-display font-light text-3xl md:text-4xl tracking-heading uppercase text-light-text mb-6">
            Delay Time Calculator
          </h1>

          <GreenLine className="w-16 mb-8" />

          <div className="space-y-6 font-body font-light text-base text-light-text-dim leading-[1.8]">
            <p>
              Calculate delay times, reverb pre-delay, and LFO rates synced to any tempo. Enter your
              BPM and instantly see millisecond values for every note division — straight, dotted,
              and triplet. Essential for dialing in tempo-synced delays, sidechain compression, and
              modulation effects.
            </p>

            <h2 className="font-display font-light text-xl tracking-heading uppercase text-light-text pt-2">
              How to Use
            </h2>

            <p>
              Set your project tempo with the BPM slider. The table shows delay times in milliseconds,
              frequency in Hz, and sample count for your chosen sample rate. Copy the ms value into
              your delay plugin, reverb pre-delay, or LFO rate. Dotted values add 50% to the base
              time. Triplet values are 2/3 of the base time.
            </p>

            <h2 className="font-display font-light text-xl tracking-heading uppercase text-light-text pt-2">
              Why Tempo-Synced Delays Matter
            </h2>

            <p>
              Delays that are synced to your project tempo sit in the mix without creating rhythmic
              confusion. A 1/4 note delay at 120 BPM is exactly 500ms — the echo falls on the next
              beat. Dotted 1/8 delays are the classic U2/Edge sound. Triplet delays create a
              shuffle feel. When your delay times are mathematically locked to the grid, the echoes
              reinforce the groove instead of fighting it.
            </p>

            <p className="text-sm text-light-text-muted pt-4">
              Built by Seris Loom — utility-first audio tools for producers and engineers.
            </p>
          </div>
        </div>
      </SectionLight>

      <ChannelStrip activeLEDs={0} />
    </>
  );
}
