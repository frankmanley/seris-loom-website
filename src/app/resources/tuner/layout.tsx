import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Chromatic Tuner",
  description: "Free browser-based chromatic tuner with real-time pitch detection. Works with guitar, bass, voice, and any instrument. No install required.",
};

export default function TunerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
