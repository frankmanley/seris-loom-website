import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "dB Converter — dBFS, dBu, dBV, dB SPL, Volts, Watts",
  description: "Convert between dBFS, dBu, dBV, dB SPL, volts, and watts instantly. Essential for gain staging and interfacing analog and digital audio equipment.",
};

export default function DbConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
