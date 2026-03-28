/**
 * Stable Tuner — state machine with hysteresis for pitch display
 * Behaves like a real chromatic tuner: holds note steady through vibrato,
 * only switches when new note is clearly established.
 */

import { Note } from "@tonaljs/tonal";

const PARAMS = {
  frameMs: 20,            // expected update interval
  smoothingAlpha: 0.22,   // EMA factor for pitch smoothing
  minConfidence: 0.75,    // pitchy clarity threshold (0.8 from detector, allow some through)
  minRmsThreshold: 0.005, // reject silence

  acquireMs: 60,          // 3 frames to first show a note
  invalidHoldMs: 150,     // keep note through brief bad frames

  holdCents: 45,          // stay locked inside this range
  switchCents: 55,        // start candidate only outside this
  switchDwellMs: 100,     // candidate must persist this long

  fastSwitchCents: 20,    // if strongly centered on new note...
  fastSwitchMs: 40,       // ...switch after this short time

  centsClamp: 50,         // clamp display to ±50 cents

  medianSize: 3,          // median filter size for outlier rejection
};

export interface StablePitchOutput {
  noteMidi: number | null;
  noteName: string | null;
  pitchClass: string | null;
  octave: number | null;
  cents: number | null;
  frequencyHz: number | null;
  stable: boolean;
  confidence: number;
}

export interface PitchFrame {
  frequency: number | null;
  confidence: number;
}

type TunerState = "NO_NOTE" | "LOCKED" | "CANDIDATE";

function hzToMidiFloat(hz: number): number {
  return 69 + 12 * Math.log2(hz / 440);
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

export class StableTuner {
  private state: TunerState = "NO_NOTE";
  private smoothedMidi: number | null = null;
  private lockedMidi: number | null = null;
  private candidateMidi: number | null = null;

  private validAccumMs = 0;
  private invalidAccumMs = 0;
  private candidateAccumMs = 0;
  private fastCandidateAccumMs = 0;

  // Median filter buffer
  private medianBuffer: number[] = [];

  update(frame: PitchFrame): StablePitchOutput {
    const valid =
      frame.frequency !== null &&
      frame.confidence >= PARAMS.minConfidence &&
      frame.frequency >= 70 &&
      frame.frequency <= 1200;

    if (valid && frame.frequency !== null) {
      const rawMidi = hzToMidiFloat(frame.frequency);

      // Median filter for outlier rejection
      this.medianBuffer.push(rawMidi);
      if (this.medianBuffer.length > PARAMS.medianSize) {
        this.medianBuffer.shift();
      }
      const medianMidi = this.getMedian();

      // EMA smoothing
      if (this.smoothedMidi === null) {
        this.smoothedMidi = medianMidi;
      } else {
        const a = PARAMS.smoothingAlpha;
        this.smoothedMidi = a * medianMidi + (1 - a) * this.smoothedMidi;
      }

      this.invalidAccumMs = 0;
    } else {
      this.invalidAccumMs += PARAMS.frameMs;
    }

    // State machine
    switch (this.state) {
      case "NO_NOTE":
        this.handleNoNote(valid);
        break;
      case "LOCKED":
        this.handleLocked(valid);
        break;
      case "CANDIDATE":
        this.handleCandidate(valid);
        break;
    }

    return this.makeOutput(frame.confidence);
  }

  private getMedian(): number {
    const sorted = [...this.medianBuffer].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private handleNoNote(valid: boolean) {
    if (!valid || this.smoothedMidi === null) {
      this.validAccumMs = 0;
      return;
    }
    this.validAccumMs += PARAMS.frameMs;
    if (this.validAccumMs >= PARAMS.acquireMs) {
      this.lockedMidi = Math.round(this.smoothedMidi);
      this.state = "LOCKED";
      this.validAccumMs = 0;
    }
  }

  private handleLocked(valid: boolean) {
    if (this.lockedMidi === null) return;

    if (!valid || this.smoothedMidi === null) {
      if (this.invalidAccumMs >= PARAMS.invalidHoldMs) {
        this.clearAll();
      }
      return;
    }

    const centsFromLocked = 100 * (this.smoothedMidi - this.lockedMidi);
    const nearestMidi = Math.round(this.smoothedMidi);

    // Stay locked if within hold zone
    if (Math.abs(centsFromLocked) <= PARAMS.holdCents || nearestMidi === this.lockedMidi) {
      return;
    }

    // Start candidate if outside switch zone
    if (Math.abs(centsFromLocked) >= PARAMS.switchCents && nearestMidi !== this.lockedMidi) {
      this.state = "CANDIDATE";
      this.candidateMidi = nearestMidi;
      this.candidateAccumMs = PARAMS.frameMs;
      this.fastCandidateAccumMs = this.isStronglyCentered(nearestMidi) ? PARAMS.frameMs : 0;
    }
  }

  private handleCandidate(valid: boolean) {
    if (this.lockedMidi === null) return;

    if (!valid || this.smoothedMidi === null) {
      if (this.invalidAccumMs >= PARAMS.invalidHoldMs) {
        this.clearAll();
      }
      return;
    }

    const nearestMidi = Math.round(this.smoothedMidi);
    const centsFromLocked = 100 * (this.smoothedMidi - this.lockedMidi);

    // Return to locked if back in hold zone
    if (Math.abs(centsFromLocked) <= PARAMS.holdCents || nearestMidi === this.lockedMidi) {
      this.state = "LOCKED";
      this.candidateMidi = null;
      this.candidateAccumMs = 0;
      this.fastCandidateAccumMs = 0;
      return;
    }

    // Candidate changed
    if (nearestMidi !== this.candidateMidi) {
      this.candidateMidi = nearestMidi;
      this.candidateAccumMs = PARAMS.frameMs;
      this.fastCandidateAccumMs = this.isStronglyCentered(nearestMidi) ? PARAMS.frameMs : 0;
      return;
    }

    // Accumulate time on candidate
    this.candidateAccumMs += PARAMS.frameMs;
    if (this.isStronglyCentered(nearestMidi)) {
      this.fastCandidateAccumMs += PARAMS.frameMs;
    } else {
      this.fastCandidateAccumMs = 0;
    }

    // Switch conditions
    if (
      this.fastCandidateAccumMs >= PARAMS.fastSwitchMs ||
      this.candidateAccumMs >= PARAMS.switchDwellMs
    ) {
      this.lockedMidi = this.candidateMidi;
      this.state = "LOCKED";
      this.candidateMidi = null;
      this.candidateAccumMs = 0;
      this.fastCandidateAccumMs = 0;
    }
  }

  private isStronglyCentered(candidateMidi: number): boolean {
    if (this.smoothedMidi === null) return false;
    return Math.abs(100 * (this.smoothedMidi - candidateMidi)) <= PARAMS.fastSwitchCents;
  }

  private makeOutput(confidence: number): StablePitchOutput {
    if (this.lockedMidi === null) {
      return { noteMidi: null, noteName: null, pitchClass: null, octave: null, cents: null, frequencyHz: null, stable: false, confidence };
    }

    const cents = this.smoothedMidi !== null
      ? clamp(100 * (this.smoothedMidi - this.lockedMidi), -PARAMS.centsClamp, PARAMS.centsClamp)
      : 0;

    const noteName = Note.fromMidi(this.lockedMidi) || "?";
    const pc = Note.pitchClass(noteName);
    const octave = Note.octave(noteName) || 4;
    const freqHz = 440 * Math.pow(2, (this.lockedMidi - 69) / 12);

    return {
      noteMidi: this.lockedMidi,
      noteName,
      pitchClass: pc,
      octave,
      cents: Math.round(cents),
      frequencyHz: Math.round(freqHz * 10) / 10,
      stable: this.state === "LOCKED",
      confidence,
    };
  }

  private clearAll() {
    this.state = "NO_NOTE";
    this.lockedMidi = null;
    this.candidateMidi = null;
    this.validAccumMs = 0;
    this.invalidAccumMs = 0;
    this.candidateAccumMs = 0;
    this.fastCandidateAccumMs = 0;
  }
}
