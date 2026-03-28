import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delay Time Calculator",
  description: "Calculate tempo-synced delay times in milliseconds, Hz, and samples. Supports straight, dotted, and triplet note divisions from 20 to 300 BPM.",
};

export default function DelayCalcLayout({ children }: { children: React.ReactNode }) {
  return children;
}
