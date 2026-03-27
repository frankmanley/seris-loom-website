"use client";

import { cn } from "@/lib/utils";

interface ConsoleButtonProps {
  active?: boolean;
  accentColor?: "amber" | "green";
  className?: string;
  onClick?: () => void;
}

const accentMap = {
  amber: {
    bg: "bg-accent-amber",
    glow: "shadow-[0_0_4px_rgba(200,106,26,0.3)]",
    border: "border-accent-amber/50",
  },
  green: {
    bg: "bg-accent-green",
    glow: "shadow-[0_0_4px_rgba(74,106,66,0.3)]",
    border: "border-accent-green/50",
  },
};

export function ConsoleButton({
  active = false,
  accentColor = "green",
  className,
  onClick,
}: ConsoleButtonProps) {
  const accent = accentMap[accentColor];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-[18px] h-[12px] rounded-[2px] border transition-all duration-150",
        active
          ? cn(accent.bg, accent.glow, accent.border)
          : "bg-gradient-to-b from-dark-surface to-dark-base border-dark-border shadow-[inset_0_1px_2px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.03)]",
        "active:translate-y-[1px] active:shadow-none",
        className
      )}
    />
  );
}
