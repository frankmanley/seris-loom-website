"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SectionDark } from "@/components/layout/section-dark";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { cn } from "@/lib/utils";

const TIME_SIGNATURES = [
  { label: "4/4", beats: 4 },
  { label: "3/4", beats: 3 },
  { label: "6/8", beats: 6 },
  { label: "5/4", beats: 5 },
  { label: "7/8", beats: 7 },
];

const MIN_BPM = 20;
const MAX_BPM = 300;

export default function MetronomePage() {
  const [bpm, setBpm] = useState(120);
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [timeSig, setTimeSig] = useState(0);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const beatRef = useRef(0);

  const beats = TIME_SIGNATURES[timeSig].beats;

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback(
    (accent: boolean) => {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = accent ? 1000 : 700;
      osc.type = "sine";

      gain.gain.setValueAtTime(accent ? 0.6 : 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    },
    [getAudioContext]
  );

  const startMetronome = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();

    beatRef.current = 0;
    setCurrentBeat(0);
    playClick(true);

    const intervalMs = (60 / bpm) * 1000;

    intervalRef.current = window.setInterval(() => {
      beatRef.current = (beatRef.current + 1) % beats;
      setCurrentBeat(beatRef.current);
      playClick(beatRef.current === 0);
    }, intervalMs);

    setPlaying(true);
  }, [bpm, beats, playClick, getAudioContext]);

  const stopMetronome = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPlaying(false);
    setCurrentBeat(-1);
  }, []);

  // Restart if bpm or time sig changes while playing
  useEffect(() => {
    if (playing) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm, timeSig]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleTap = () => {
    const now = Date.now();
    const newTaps = [...tapTimes, now].filter((t) => now - t < 3000);
    setTapTimes(newTaps);

    if (newTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const tappedBpm = Math.round(60000 / avg);
      setBpm(Math.max(MIN_BPM, Math.min(MAX_BPM, tappedBpm)));
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        playing ? stopMetronome() : startMetronome();
      }
      if (e.code === "KeyT") {
        handleTap();
      }
      if (e.code === "ArrowUp") {
        e.preventDefault();
        setBpm((b) => Math.min(MAX_BPM, b + 1));
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        setBpm((b) => Math.max(MIN_BPM, b - 1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playing, startMetronome, stopMetronome]);

  return (
    <>
      <SectionDark className="pt-24 pb-8">
        <p className="font-pixel text-[10px] tracking-label uppercase text-accent-green mb-3">
          Free Tool
        </p>
        <h1 className="font-display font-thin text-4xl md:text-5xl tracking-display uppercase text-dark-text mb-4">
          Metronome
        </h1>
        <p className="font-display font-extralight text-base text-dark-text-dim tracking-wide">
          Precision click track — tap tempo, time signatures, keyboard shortcuts
        </p>
      </SectionDark>

      <ChannelStrip label="METRONOME" activeLEDs={playing ? 4 : 0} />

      <SectionDark className="pb-20">
        <div className="max-w-md mx-auto">
          {/* Beat indicators */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {Array.from({ length: beats }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-75",
                  currentBeat === i
                    ? i === 0
                      ? "bg-accent-green shadow-[0_0_12px_#4A6A42] scale-125"
                      : "bg-accent-amber shadow-[0_0_8px_#C86A1A] scale-110"
                    : "bg-dark-border"
                )}
              />
            ))}
          </div>

          {/* BPM display */}
          <div className="text-center mb-8">
            <div className="font-display font-thin text-8xl md:text-9xl text-dark-text leading-none tabular-nums">
              {bpm}
            </div>
            <span className="font-pixel text-[10px] tracking-mono uppercase text-dark-text-muted">
              BPM
            </span>
          </div>

          {/* BPM slider */}
          <div className="mb-8 px-4">
            <input
              type="range"
              min={MIN_BPM}
              max={MAX_BPM}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full h-px appearance-none bg-dark-border cursor-pointer accent-accent-green [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-green [&::-webkit-slider-thumb]:shadow-[0_0_8px_#4A6A42]"
            />
            <div className="flex justify-between mt-2">
              <span className="font-mono text-[9px] text-dark-text-muted">{MIN_BPM}</span>
              <span className="font-mono text-[9px] text-dark-text-muted">{MAX_BPM}</span>
            </div>
          </div>

          {/* BPM fine controls */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[-10, -5, -1].map((delta) => (
              <button
                key={delta}
                onClick={() => setBpm((b) => Math.max(MIN_BPM, b + delta))}
                className="font-mono text-xs text-dark-text-muted border border-dark-border rounded-[--radius-btn] px-3 py-1.5 hover:bg-dark-surface hover:text-dark-text transition-colors"
              >
                {delta}
              </button>
            ))}
            {[1, 5, 10].map((delta) => (
              <button
                key={delta}
                onClick={() => setBpm((b) => Math.min(MAX_BPM, b + delta))}
                className="font-mono text-xs text-dark-text-muted border border-dark-border rounded-[--radius-btn] px-3 py-1.5 hover:bg-dark-surface hover:text-dark-text transition-colors"
              >
                +{delta}
              </button>
            ))}
          </div>

          {/* Time signature */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {TIME_SIGNATURES.map((ts, i) => (
              <button
                key={ts.label}
                onClick={() => setTimeSig(i)}
                className={cn(
                  "font-mono text-xs px-3 py-1.5 rounded-[--radius-btn] border transition-colors",
                  timeSig === i
                    ? "border-accent-green text-accent-green bg-accent-green/10"
                    : "border-dark-border text-dark-text-muted hover:text-dark-text hover:bg-dark-surface"
                )}
              >
                {ts.label}
              </button>
            ))}
          </div>

          {/* Play / Tap buttons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={playing ? stopMetronome : startMetronome}
              className={cn(
                "font-display font-light text-sm tracking-label uppercase px-8 py-3 rounded-[--radius-btn] border transition-all duration-200",
                playing
                  ? "border-accent-red text-accent-red hover:bg-accent-red/10"
                  : "border-accent-green text-accent-green hover:bg-accent-green/10"
              )}
            >
              {playing ? "Stop" : "Start"}
            </button>
            <button
              onClick={handleTap}
              className="font-display font-light text-sm tracking-label uppercase px-8 py-3 rounded-[--radius-btn] border border-dark-border text-dark-text-muted hover:text-dark-text hover:bg-dark-surface transition-all duration-200"
            >
              Tap
            </button>
          </div>

          {/* Keyboard shortcuts */}
          <div className="text-center space-y-1">
            <p className="font-mono text-[9px] text-dark-text-muted tracking-mono">
              SPACE: play/stop &nbsp; T: tap tempo &nbsp; ↑↓: adjust BPM
            </p>
          </div>
        </div>
      </SectionDark>
    </>
  );
}
