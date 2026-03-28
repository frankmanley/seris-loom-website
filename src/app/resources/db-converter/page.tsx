"use client";

import { useState } from "react";
import { SectionDark } from "@/components/layout/section-dark";
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { GreenLine } from "@/components/ui/green-accents";
import { cn } from "@/lib/utils";

type DbUnit = "dBFS" | "dBu" | "dBV" | "dBSPL" | "voltage" | "watts";

const UNITS: { id: DbUnit; label: string; ref: string }[] = [
  { id: "dBFS", label: "dBFS", ref: "0 dBFS = digital full scale" },
  { id: "dBu", label: "dBu", ref: "0 dBu = 0.775 V RMS" },
  { id: "dBV", label: "dBV", ref: "0 dBV = 1.0 V RMS" },
  { id: "dBSPL", label: "dB SPL", ref: "0 dB SPL = 20 µPa" },
  { id: "voltage", label: "Volts", ref: "RMS voltage" },
  { id: "watts", label: "Watts", ref: "Power (into load)" },
];

// Reference values
const DBU_REF_V = 0.775;
const DBV_REF_V = 1.0;
const DBSPL_REF = 0.00002; // 20 µPa

function convert(value: number, from: DbUnit): Record<DbUnit, number> {
  // First convert everything to voltage (RMS)
  let volts: number;

  switch (from) {
    case "dBu":
      volts = DBU_REF_V * Math.pow(10, value / 20);
      break;
    case "dBV":
      volts = DBV_REF_V * Math.pow(10, value / 20);
      break;
    case "voltage":
      volts = value;
      break;
    case "dBFS":
      // Assume +4 dBu = -18 dBFS (common pro standard)
      volts = DBU_REF_V * Math.pow(10, (value + 22) / 20);
      break;
    case "dBSPL":
      // SPL is acoustic, approximate voltage mapping (1 Pa ≈ 94 dB SPL)
      volts = DBSPL_REF * Math.pow(10, value / 20);
      break;
    case "watts":
      // P = V²/R, assume 600 ohm load (standard)
      volts = Math.sqrt(Math.abs(value) * 600) * Math.sign(value);
      break;
    default:
      volts = 0;
  }

  const absVolts = Math.abs(volts);
  const safeVolts = absVolts > 0 ? absVolts : 1e-30;

  return {
    dBu: 20 * Math.log10(safeVolts / DBU_REF_V),
    dBV: 20 * Math.log10(safeVolts / DBV_REF_V),
    dBFS: 20 * Math.log10(safeVolts / (DBU_REF_V * Math.pow(10, 22 / 20))),
    dBSPL: 20 * Math.log10(safeVolts / DBSPL_REF),
    voltage: absVolts,
    watts: (absVolts * absVolts) / 600,
  };
}

function formatValue(val: number, unit: DbUnit): string {
  if (unit === "voltage") {
    if (val < 0.001) return `${(val * 1000000).toFixed(1)} µV`;
    if (val < 1) return `${(val * 1000).toFixed(2)} mV`;
    return `${val.toFixed(4)} V`;
  }
  if (unit === "watts") {
    if (val < 0.001) return `${(val * 1000000).toFixed(2)} µW`;
    if (val < 1) return `${(val * 1000).toFixed(3)} mW`;
    return `${val.toFixed(4)} W`;
  }
  return `${val.toFixed(2)} ${unit === "dBSPL" ? "dB SPL" : unit}`;
}

export default function DbConverterPage() {
  const [inputValue, setInputValue] = useState("0");
  const [inputUnit, setInputUnit] = useState<DbUnit>("dBu");

  const numValue = parseFloat(inputValue) || 0;
  const results = convert(numValue, inputUnit);

  return (
    <>
      {/* Converter widget */}
      <SectionDark className="pt-20 pb-12">
        <div className="max-w-lg mx-auto">
          {/* Input */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-32 bg-dark-surface border border-dark-border rounded-[--radius-btn] px-4 py-3 font-mono text-2xl text-dark-text text-center tabular-nums"
              step="0.1"
            />
            <select
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value as DbUnit)}
              className="bg-dark-surface border border-dark-border rounded-[--radius-btn] px-4 py-3 font-mono text-sm text-dark-text appearance-none cursor-pointer"
            >
              {UNITS.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>

          {/* Quick presets */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[
              { label: "+4 dBu", unit: "dBu" as DbUnit, val: "4" },
              { label: "-10 dBV", unit: "dBV" as DbUnit, val: "-10" },
              { label: "0 dBFS", unit: "dBFS" as DbUnit, val: "0" },
              { label: "-18 dBFS", unit: "dBFS" as DbUnit, val: "-18" },
              { label: "85 SPL", unit: "dBSPL" as DbUnit, val: "85" },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => { setInputValue(preset.val); setInputUnit(preset.unit); }}
                className="font-mono text-[9px] px-2 py-1 rounded-[--radius-btn] border border-dark-border text-dark-text-muted hover:text-dark-text hover:bg-dark-surface transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="border border-dark-border rounded-[--radius-card] overflow-hidden divide-y divide-dark-border">
            {UNITS.map((u) => {
              const isInput = u.id === inputUnit;
              return (
                <div
                  key={u.id}
                  className={cn(
                    "flex items-center justify-between px-4 py-3",
                    isInput ? "bg-accent-green/5" : "bg-dark-base"
                  )}
                >
                  <div>
                    <span className={cn(
                      "font-mono text-sm",
                      isInput ? "text-accent-green" : "text-dark-text"
                    )}>
                      {u.label}
                    </span>
                    <span className="font-mono text-[9px] text-dark-text-muted ml-2 hidden sm:inline">
                      {u.ref}
                    </span>
                  </div>
                  <span className={cn(
                    "font-mono text-sm tabular-nums",
                    isInput ? "text-accent-green" : "text-dark-text-dim"
                  )}>
                    {formatValue(results[u.id], u.id)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </SectionDark>

      <ChannelStrip label="dB CONVERT" activeLEDs={2} />

      {/* SEO content */}
      <SectionLight>
        <div className="max-w-2xl mx-auto">
          <p className="font-pixel text-[10px] tracking-label uppercase text-accent-green mb-3">
            Free Tool
          </p>
          <h1 className="font-display font-light text-3xl md:text-4xl tracking-heading uppercase text-light-text mb-6">
            dB Converter
          </h1>

          <GreenLine className="w-16 mb-8" />

          <div className="space-y-6 font-body font-light text-base text-light-text-dim leading-[1.8]">
            <p>
              Convert between dBFS, dBu, dBV, dB SPL, volts, and watts instantly. Enter a value
              in any unit and see the equivalent in every other scale. Essential for gain staging,
              interfacing analog and digital gear, and understanding signal levels across different
              standards.
            </p>

            <h2 className="font-display font-light text-xl tracking-heading uppercase text-light-text pt-2">
              Common Reference Levels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Pro line level</span>
                <span className="font-mono text-light-text-muted">+4 dBu</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Consumer line level</span>
                <span className="font-mono text-light-text-muted">-10 dBV</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Digital full scale</span>
                <span className="font-mono text-light-text-muted">0 dBFS</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Pro headroom ref</span>
                <span className="font-mono text-light-text-muted">-18 dBFS</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Comfortable listening</span>
                <span className="font-mono text-light-text-muted">70-80 dB SPL</span>
              </div>
              <div className="flex justify-between border-b border-light-border pb-1">
                <span className="text-light-text">Studio monitoring</span>
                <span className="font-mono text-light-text-muted">83-85 dB SPL</span>
              </div>
            </div>

            <h2 className="font-display font-light text-xl tracking-heading uppercase text-light-text pt-2">
              Understanding dB Scales
            </h2>

            <p>
              Different dB scales exist because different fields need different reference points.
              <strong className="text-light-text"> dBu</strong> references 0.775 volts (the voltage that produces 1 mW into
              600 ohms) and is the standard for professional analog audio equipment.
              <strong className="text-light-text"> dBV</strong> references 1.0 volt and is common in consumer electronics.
              <strong className="text-light-text"> dBFS</strong> is the digital scale where 0 is the absolute maximum — every
              signal in your DAW is measured in dBFS.
            </p>

            <p>
              The relationship between +4 dBu (pro analog) and 0 dBFS (digital ceiling) depends on
              your interface calibration. Most pro interfaces align +4 dBu with -18 dBFS, giving you
              18 dB of headroom above nominal level before digital clipping. This converter assumes
              that standard alignment.
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
