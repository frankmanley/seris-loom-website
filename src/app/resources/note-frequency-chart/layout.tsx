import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Note Frequency Chart — Hz Reference for Every Note",
  description: "Complete note frequency chart from C0 to B8. Shows frequency in Hz, MIDI number, period in milliseconds, and wavelength. Adjustable reference pitch.",
};

export default function FreqChartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
