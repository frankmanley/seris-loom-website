"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

type MarginValue = `${number}${"px" | "%"}`;
type MarginType =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

export function useScrollReveal(margin: MarginType = "-80px") {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin });

  return { ref, isInView };
}
