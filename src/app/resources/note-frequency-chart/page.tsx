"use client";

import { useState } from "react";
import { SectionDark } from "@/components/layout/section-dark";
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { GreenLine } from "@/components/ui/green-accents";
import { cn } from "@/lib/utils";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function noteToMidi(note: string, octave: number): number {
  const idx = NOTE_NAMES.indexOf(note);
  return (octave + 1) * 12 + idx;
}

export default function NoteFrequencyChartPage() {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [selectedOctave, setSelectedOctave] = useState<number | null>(null);
  const [refPitch, setRefPitch] = useState(440);

  function getFreq(note: string, octave: number): number {
    const midi = noteToMidi(note, octave);
    return refPitch * Math.pow(2, (midi - 69) / 12);
  }

  const isHighlighted = (note: string, octave: number) => {
    if (selectedNote && selectedOctave !== null) return note === selectedNote && octave === selectedOctave;
    if (selectedNote) return note === selectedNote;
    if (selectedOctave !== null) return octave === selectedOctave;
    return false;
  };

  return (
    <>
      {/* Chart widget */}
      <SectionDark className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Reference pitch */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="font-mono text-[10px] text-dark-text-muted uppercase">A4 =</span>
            <input
              type="number"
              value={refPitch}
              onChange={(e) => setRefPitch(Number(e.target.value) || 440)}
              className="w-20 bg-dark-surface border border-dark-border rounded-[--radius-btn] px-2 py-1 font-mono text-sm text-dark-text text-center"
            />
            <span className="font-mono text-[10px] text-dark-text-muted">Hz</span>
            {refPitch !== 440 && (
              <button
                onClick={() => setRefPitch(440)}
                className="font-mono text-[9px] text-accent-amber hover:text-accent-amber/80"
              >
                Reset
              </button>
            )}
          </div>

          {/* Note filter */}
          <div className="flex items-center justify-center gap-1 mb-4">
            <button
              onClick={() => setSelectedNote(null)}
              className={cn(
                "font-mono text-[10px] px-2 py-1 rounded-[--radius-btn] border transition-colors",
                selectedNote === null
                  ? "border-accent-green text-accent-green bg-accent-green/10"
                  : "border-dark-border text-dark-text-muted hover:text-dark-text"
              )}
            >
              All
            </button>
            {NOTE_NAMES.map((note) => (
              <button
                key={note}
                onClick={() => setSelectedNote(selectedNote === note ? null : note)}
                className={cn(
                  "font-mono text-[10px] px-2 py-1 rounded-[--radius-btn] border transition-colors",
                  selectedNote === note
                    ? "border-accent-green text-accent-green bg-accent-green/10"
                    : note.includes("#")
                    ? "border-dark-border text-dark-text-muted/50 hover:text-dark-text"
                    : "border-dark-border text-dark-text-muted hover:text-dark-text"
                )}
              >
                {note}
              </button>
            ))}
          </div>

          {/* Octave filter */}
          <div className="flex items-center justify-center gap-1 mb-8">
            <button
              onClick={() => setSelectedOctave(null)}
              className={cn(
                "font-mono text-[10px] px-2 py-1 rounded-[--radius-btn] border transition-colors",
                selectedOctave === null
                  ? "border-accent-green text-accent-green bg-accent-green/10"
                  : "border-dark-border text-dark-text-muted hover:text-dark-text"
              )}
            >
              All
            </button>
            {OCTAVES.map((oct) => (
              <button
                key={oct}
                onClick={() => setSelectedOctave(selectedOctave === oct ? null : oct)}
                className={cn(
                  "font-mono text-[10px] px-2 py-1 rounded-[--radius-btn] border transition-colors",
                  selectedOctave === oct
                    ? "border-accent-green text-accent-green bg-accent-green/10"
                    : "border-dark-border text-dark-text-muted hover:text-dark-text"
                )}
              >
                Oct {oct}
              </button>
            ))}
          </div>

          {/* Frequency table */}
          <div className="border border-dark-border rounded-[--radius-card] overflow-auto max-h-[28rem]">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-dark-surface">
                  <th className="font-mono text-[9px] text-dark-text-muted uppercase py-2 px-3 text-left">Note</th>
                  <th className="font-mono text-[9px] text-dark-text-muted uppercase py-2 px-3 text-left">MIDI</th>
                  <th className="font-mono text-[9px] text-dark-text-muted uppercase py-2 px-3 text-right">Frequency</th>
                  <th className="font-mono text-[9px] text-dark-text-muted uppercase py-2 px-3 text-right hidden sm:table-cell">Period (ms)</th>
                  <th className="font-mono text-[9px] text-dark-text-muted uppercase py-2 px-3 text-right hidden md:table-cell">Wavelength</th>
                </tr>
              </thead>
              <tbody>
                {OCTAVES.map((octave) =>
                  NOTE_NAMES.map((note) => {
                    const midi = noteToMidi(note, octave);
                    if (midi < 0 || midi > 127) return null;
                    const freq = getFreq(note, octave);
                    const period = 1000 / freq;
                    const wavelength = 343 / freq; // speed of sound in m/s
                    const highlighted = isHighlighted(note, octave);
                    const isA4 = note === "A" && octave === 4;
                    const isNatural = !note.includes("#");

                    if (selectedNote && note !== selectedNote) return null;
                    if (selectedOctave !== null && octave !== selectedOctave) return null;

                    return (
                      <tr
                        key={`${note}${octave}`}
                        className={cn(
                          "border-t border-dark-border/30 transition-colors",
                          highlighted ? "bg-accent-green/5" : "",
                          isA4 ? "bg-accent-amber/5" : ""
                        )}
                      >
                        <td className="py-1.5 px-3">
                          <span className={cn(
                            "font-mono text-xs",
                            isA4 ? "text-accent-amber" : isNatural ? "text-dark-text" : "text-dark-text-dim"
                          )}>
                            {note}{octave}
                          </span>
                        </td>
                        <td className="py-1.5 px-3">
                          <span className="font-mono text-xs text-dark-text-muted tabular-nums">{midi}</span>
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <span className={cn(
                            "font-mono text-xs tabular-nums",
                            isA4 ? "text-accent-amber" : "text-accent-green"
                          )}>
                            {freq < 100 ? freq.toFixed(2) : freq < 1000 ? freq.toFixed(1) : freq.toFixed(0)} Hz
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-right hidden sm:table-cell">
                          <span className="font-mono text-xs text-dark-text-dim tabular-nums">
                            {period < 1 ? period.toFixed(3) : period.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-right hidden md:table-cell">
                          <span className="font-mono text-xs text-dark-text-dim tabular-nums">
                            {wavelength < 1 ? `${(wavelength * 100).toFixed(1)} cm` : `${wavelength.toFixed(2)} m`}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionDark>

      <ChannelStrip label="FREQ CHART" activeLEDs={3} />

      {/* SEO content */}
      <SectionLight>
        <div className="max-w-2xl mx-auto">
          <p className="font-pixel text-[10px] tracking-label uppercase text-accent-green mb-3">
            Free Tool
          </p>
          <h1 className="font-display font-light text-3xl md:text-4xl tracking-heading uppercase text-light-text mb-6">
            Note Frequency Chart
          </h1>

          <GreenLine className="w-16 mb-8" />

          <div className="space-y-6 font-body font-light text-base text-light-text-dim leading-[1.8]">
            <p>
              A complete reference chart showing the frequency of every musical note from C0 to B8.
              Filter by note name or octave, adjust the reference pitch (A4), and see MIDI numbers,
              period in milliseconds, and wavelength in meters — all calculated in real time.
            </p>

            <h2 className="font-display font-light text-xl tracking-heading uppercase text-light-text pt-2">
              How to Use
            </h2>

            <p>
              Use the note and octave filters to isolate specific pitches. The reference pitch
              defaults to A4 = 440 Hz (concert pitch) but can be adjusted for alternate tuning
              systems. Baroque pitch (A4 = 415 Hz), scientific pitch (A4 = 432 Hz), and other
              historical standards are supported by simply changing the number.
            </p>

            <h2 className="font-display font-light text-xl tracking-heading uppercase text-light-text pt-2">
              Why Frequency Knowledge Matters
            </h2>

            <p>
              Knowing note frequencies is essential for EQ work, sound design, and acoustic treatment.
              When you are cutting a resonance at 250 Hz, that is roughly B3. When you boost presence
              at 3 kHz, you are in the range of F#7. Understanding the relationship between musical
              notes and frequencies lets you make EQ decisions musically instead of guessing.
            </p>

            <p>
              The wavelength column helps with acoustic treatment. A 100 Hz wave is 3.43 meters long —
              which is why bass traps need to be physically large to be effective. Room modes, standing
              waves, and reflection patterns all relate directly to wavelength.
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
