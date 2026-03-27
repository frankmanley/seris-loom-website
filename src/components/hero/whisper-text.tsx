"use client";

import { useMemo } from "react";

interface WhisperTextProps {
  text: string;
  containerWidth: number;
  containerHeight: number;
}

export function useWhisperTargets({
  text,
  containerWidth,
  containerHeight,
}: WhisperTextProps): { x: number; y: number }[] {
  return useMemo(() => {
    if (containerWidth === 0 || containerHeight === 0) return [];

    const targets: { x: number; y: number }[] = [];
    const chars = text.split("");
    const charSpacing = 10;
    const totalWidth = chars.length * charSpacing;
    const startX = (containerWidth - totalWidth) / 2;
    const centerY = containerHeight / 2;

    chars.forEach((char, i) => {
      if (char === " ") return;
      const baseX = startX + i * charSpacing;
      targets.push({ x: baseX + 2, y: centerY - 4 });
      targets.push({ x: baseX + 4, y: centerY });
      targets.push({ x: baseX + 2, y: centerY + 4 });
    });

    return targets;
  }, [text, containerWidth, containerHeight]);
}
