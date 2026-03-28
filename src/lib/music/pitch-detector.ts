/**
 * Real-time pitch detection using pitchy (McLeod Pitch Method)
 * Much more accurate than naive autocorrelation, especially for voice
 */

import { Note } from "@tonaljs/tonal";

export interface PitchResult {
  frequency: number;
  note: string;
  pitchClass: string;
  octave: number;
  midi: number;
  centsOff: number;
  confidence: number; // 0-1, called "clarity" in pitchy
}

/**
 * Manages the microphone stream and continuous pitch detection using pitchy
 */
export class PitchDetectorStream {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private running = false;
  private onPitch: (result: PitchResult | null) => void;
  private animFrame = 0;
  // pitchy loaded dynamically (ESM module)
  private pitchDetector: any = null;
  private inputBuffer: Float32Array | null = null;

  constructor(onPitch: (result: PitchResult | null) => void) {
    this.onPitch = onPitch;
  }

  async start() {
    try {
      // Dynamically import pitchy (ESM)
      const pitchyModule = await import("pitchy");

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,  // don't mess with the signal
          noiseSuppression: false,  // we want raw audio
          autoGainControl: false,   // consistent levels
        },
      });

      this.audioCtx = new AudioContext();
      const source = this.audioCtx.createMediaStreamSource(this.stream);

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;

      source.connect(this.analyser);

      // Create pitchy detector
      this.pitchDetector = pitchyModule.PitchDetector.forFloat32Array(this.analyser.fftSize);
      this.inputBuffer = new Float32Array(this.analyser.fftSize);

      this.running = true;
      this.detect();
    } catch (err) {
      console.error("Microphone access denied:", err);
      throw err;
    }
  }

  private detect = () => {
    if (!this.running || !this.analyser || !this.inputBuffer || !this.pitchDetector || !this.audioCtx) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.analyser as any).getFloatTimeDomainData(this.inputBuffer);

    const [pitch, clarity] = this.pitchDetector.findPitch(
      this.inputBuffer,
      this.audioCtx.sampleRate,
    );

    // Only report if we have enough clarity and a reasonable frequency
    if (clarity > 0.8 && pitch >= 60 && pitch <= 1500) {
      const midi = Math.round(69 + 12 * Math.log2(pitch / 440));
      const exactMidi = 69 + 12 * Math.log2(pitch / 440);
      const centsOff = Math.round((exactMidi - midi) * 100);
      const noteName = Note.fromMidi(midi) || "?";
      const pc = Note.pitchClass(noteName);
      const octave = Note.octave(noteName) || 4;

      this.onPitch({
        frequency: Math.round(pitch * 10) / 10,
        note: noteName,
        pitchClass: pc,
        octave,
        midi,
        centsOff,
        confidence: clarity,
      });
    } else {
      this.onPitch(null);
    }

    this.animFrame = requestAnimationFrame(this.detect);
  };

  stop() {
    this.running = false;
    cancelAnimationFrame(this.animFrame);
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
    }
    if (this.audioCtx) {
      this.audioCtx.close();
    }
    this.audioCtx = null;
    this.analyser = null;
    this.stream = null;
    this.pitchDetector = null;
    this.inputBuffer = null;
  }
}
