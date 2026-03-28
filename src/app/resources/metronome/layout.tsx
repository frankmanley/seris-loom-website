import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Metronome",
  description: "Free browser-based metronome with tap tempo, time signatures (4/4, 3/4, 6/8, 5/4, 7/8), and keyboard shortcuts. No install required.",
};

export default function MetronomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
