"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PitchDetectorStream, type PitchResult } from "@/lib/music/pitch-detector";
import { StableTuner, type StablePitchOutput } from "@/lib/music/stable-tuner";
import { SectionDark } from "@/components/layout/section-dark";
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { GreenLine } from "@/components/ui/green-accents";
import { cn } from "@/lib/utils";

export default function TunerPage() {
  const [listening, setListening] = useState(false);
  const [stableNote, setStableNote] = useState<StablePitchOutput | null>(null);
  const [error, setError] = useState("");
  const detectorRef = useRef<PitchDetectorStream | null>(null);
  const tunerRef = useRef<StableTuner>(new StableTuner());

  const handlePitch = useCallback((result: PitchResult | null) => {
    const output = tunerRef.current.update({
      frequency: result?.frequency ?? null,
      confidence: result?.confidence ?? 0,
    });
    setStableNote(output.noteMidi !== null ? output : null);
  }, []);

  async function toggleListening() {
    if (listening) {
      detectorRef.current?.stop();
      detectorRef.current = null;
      setListening(false);
      setStableNote(null);
      tunerRef.current = new StableTuner();
    } else {
      setError("");
      try {
        const detector = new PitchDetectorStream(handlePitch);
        await detector.start();
        detectorRef.current = detector;
        setListening(true);
      } catch {
        setError("Microphone access denied. Check browser permissions.");
      }
    }
  }

  useEffect(() => {
    return () => { detectorRef.current?.stop(); };
  }, []);

  const cents = stableNote?.cents ?? 0;
  const needlePosition = (cents / 50) * 100;
  const isInTune = stableNote && Math.abs(cents) <= 5;
  const isClose = stableNote && Math.abs(cents) <= 15;

  return (
    <>
      {/* Tuner widget — first thing below nav */}
      <SectionDark className="pt-20 pb-12">
        <div className="max-w-lg mx-auto">
          {/* Note display */}
          <div className="text-center mb-8">
            {stableNote ? (
              <>
                <div
                  className={cn(
                    "font-display font-thin text-8xl md:text-9xl leading-none transition-colors duration-150",
                    isInTune ? "text-accent-green" : isClose ? "text-accent-amber" : "text-accent-red"
                  )}
                >
                  {stableNote.pitchClass}
                  <span className="text-4xl md:text-5xl text-dark-text-muted">{stableNote.octave}</span>
                </div>
                <div className="font-mono text-sm text-dark-text-muted mt-2">
                  {stableNote.frequencyHz} Hz
                </div>
              </>
            ) : (
              <>
                <div className="font-display font-thin text-8xl md:text-9xl text-dark-border leading-none">
                  ---
                </div>
                <div className="font-mono text-sm text-dark-text-muted mt-2">
                  {listening ? "Listening..." : "-- Hz"}
                </div>
              </>
            )}
          </div>

          {/* Tuner needle bar */}
          <div className="mb-8 px-4">
            <div className="relative h-12 bg-dark-surface rounded-[--radius-card] overflow-hidden border border-dark-border">
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-accent-green/40" />

              {/* Flat / Sharp labels */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-dark-text-muted">&#9837;</div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-dark-text-muted">&#9839;</div>

              {/* Tick marks */}
              {[-40, -20, 0, 20, 40].map((c) => (
                <div
                  key={c}
                  className={cn(
                    "absolute top-0 bottom-0 w-px",
                    c === 0 ? "bg-dark-text-muted/30" : "bg-dark-border"
                  )}
                  style={{ left: `${50 + c}%` }}
                />
              ))}

              {/* Needle */}
              {stableNote && (
                <div
                  className="absolute top-1.5 bottom-1.5 w-2 rounded-full transition-all duration-100"
                  style={{
                    left: `${50 + needlePosition / 2}%`,
                    transform: "translateX(-50%)",
                    backgroundColor: isInTune ? "#4A6A42" : isClose ? "#C86A1A" : "#8A2A2A",
                    boxShadow: isInTune
                      ? "0 0 10px rgba(74,106,66,0.6)"
                      : isClose
                      ? "0 0 8px rgba(200,106,26,0.4)"
                      : "0 0 6px rgba(138,42,42,0.4)",
                  }}
                />
              )}
            </div>

            {/* Cents readout */}
            <div className="flex justify-between mt-2">
              <span className="font-mono text-[9px] text-dark-text-muted">-50&#162;</span>
              <span
                className={cn(
                  "font-pixel text-[10px] tracking-mono",
                  stableNote
                    ? isInTune ? "text-accent-green" : "text-dark-text-dim"
                    : "text-dark-text-muted"
                )}
              >
                {stableNote ? `${cents > 0 ? "+" : ""}${cents}¢` : "0¢"}
              </span>
              <span className="font-mono text-[9px] text-dark-text-muted">+50&#162;</span>
            </div>
          </div>

          {/* Start / Stop button */}
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={toggleListening}
              className={cn(
                "font-display font-light text-sm tracking-label uppercase px-10 py-3 rounded-[--radius-btn] border transition-all duration-200",
                listening
                  ? "border-accent-red text-accent-red hover:bg-accent-red/10"
                  : "border-accent-green text-accent-green hover:bg-accent-green/10"
              )}
            >
              {listening ? "Stop" : "Start Listening"}
            </button>
          </div>

          {error && (
            <p className="text-center font-mono text-xs text-accent-red">{error}</p>
          )}

          {/* In-tune indicator */}
          {stableNote && isInTune && (
            <div className="text-center">
              <span className="font-pixel text-[10px] tracking-mono uppercase text-accent-green">
                IN TUNE
              </span>
            </div>
          )}
        </div>
      </SectionDark>

      <ChannelStrip label="TUNER" activeLEDs={listening ? 4 : 0} />

      {/* SEO content */}
      <SectionLight>
        <div className="max-w-2xl mx-auto">
          <p className="font-pixel text-[10px] tracking-label uppercase text-accent-green mb-3">
            Free Tool
          </p>
          <h1 className="font-display font-light text-3xl md:text-4xl tracking-heading uppercase text-light-text mb-6">
            Free Online Pitch Tuner
          </h1>

          <GreenLine className="w-16 mb-8" />

          <div className="space-y-6 font-body font-light text-base text-light-text-dim leading-[1.8]">
            <p>
              A free, browser-based chromatic tuner that listens through your microphone and shows
              you the exact pitch you are playing or singing. Uses the McLeod Pitch Method for
              accurate detection of voice, guitar, bass, piano, and any other instrument.
            </p>

            <h2 className="font-display font-light text-xl tracking-heading uppercase text-light-text pt-2">
              Features
            </h2>

            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-accent-green mt-2 shrink-0" />
                <span><strong className="text-light-text">Real-time pitch detection</strong> — uses the McLeod Pitch Method (via pitchy) for accurate, low-latency frequency analysis directly in your browser.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-accent-green mt-2 shrink-0" />
                <span><strong className="text-light-text">Stable note display</strong> — a state-machine tuner with hysteresis holds the note steady through vibrato and only switches when a new note is clearly established.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-accent-green mt-2 shrink-0" />
                <span><strong className="text-light-text">Cents deviation meter</strong> — see exactly how many cents sharp or flat you are. Green means in tune (within 5 cents), amber means close (within 15 cents).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-accent-green mt-2 shrink-0" />
                <span><strong className="text-light-text">Works with any instrument</strong> — voice, guitar, bass, ukulele, violin, saxophone, trumpet, or any pitched instrument. Detection range covers 70 Hz to 1200 Hz.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-accent-green mt-2 shrink-0" />
                <span><strong className="text-light-text">No install, no account</strong> — works instantly in Chrome, Safari, Firefox, and Edge. All processing happens locally in your browser. No data is sent anywhere.</span>
              </li>
            </ul>

            <h2 className="font-display font-light text-xl tracking-heading uppercase text-light-text pt-2">
              How It Works
            </h2>

            <p>
              When you click "Start Listening," the tuner requests microphone access and begins
              analyzing the audio in real time. The pitch detection algorithm (McLeod Pitch Method)
              identifies the fundamental frequency of whatever you are playing. A stability filter
              smooths the reading so the display does not flicker between notes during vibrato or
              transitions.
            </p>

            <p>
              The cents meter shows how far you are from the nearest note in the chromatic scale.
              One cent is 1/100th of a semitone. Most tuners consider anything within plus or minus
              5 cents to be "in tune." The color-coded needle gives you instant visual feedback:
              green for in tune, amber for close, red for significantly off.
            </p>

            <h2 className="font-display font-light text-xl tracking-heading uppercase text-light-text pt-2">
              Standard Tuning Reference
            </h2>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Guitar E2</span>
                <span className="font-mono text-light-text-muted">82.4 Hz</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Guitar A2</span>
                <span className="font-mono text-light-text-muted">110.0 Hz</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Guitar D3</span>
                <span className="font-mono text-light-text-muted">146.8 Hz</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Guitar G3</span>
                <span className="font-mono text-light-text-muted">196.0 Hz</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Guitar B3</span>
                <span className="font-mono text-light-text-muted">246.9 Hz</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Guitar E4</span>
                <span className="font-mono text-light-text-muted">329.6 Hz</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Concert A</span>
                <span className="font-mono text-light-text-muted">440.0 Hz</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Bass E1</span>
                <span className="font-mono text-light-text-muted">41.2 Hz</span>
              </div>
            </div>

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
