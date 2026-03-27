"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useInView } from "motion/react";
import { ConsoleButton } from "./console-button";
import { LEDIndicator } from "./led-indicator";

interface ChannelStripProps {
  label?: string;
  activeLEDs?: number;
  totalLEDs?: number;
  className?: string;
}

export function ChannelStrip({
  label = "SERIS LOOM",
  activeLEDs = 3,
  totalLEDs = 6,
  className,
}: ChannelStripProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className={cn(
        "channel-strip-glow w-full border-y border-dark-border",
        "px-4 md:px-8 py-2 flex items-center justify-between",
        className
      )}
      style={{
        backgroundImage: "linear-gradient(rgba(30, 27, 24, 0.85), rgba(30, 27, 24, 0.85)), url('/images/textures/console-wood.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left: push buttons */}
      <div className="flex gap-2.5 items-center">
        <ConsoleButton active={false} />
        <ConsoleButton active={isInView} accentColor="green" />
        <ConsoleButton active={false} />
      </div>

      {/* Center: screw mounts + label */}
      <div className="flex items-center gap-4">
        <ScrewMount />
        <span className="font-display font-light text-[9px] text-dark-text-dim tracking-[0.3em] uppercase">
          {label}
        </span>
        <ScrewMount />
      </div>

      {/* Right: LED level dots — hidden below sm to prevent overflow */}
      <div className="hidden sm:flex gap-1 items-center">
        {Array.from({ length: totalLEDs }).map((_, i) => (
          <LEDIndicator
            key={i}
            color={i < activeLEDs && isInView ? (i >= totalLEDs - 1 ? "amber" : "green") : "green"}
            size="sm"
            className={cn(
              !(i < activeLEDs && isInView) && "opacity-20 shadow-none"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function ScrewMount() {
  return (
    <div
      className={cn(
        "w-[5px] h-[5px] rounded-full",
        "bg-gradient-to-br from-dark-border to-dark-base",
        "border border-dark-surface",
        "shadow-[inset_0_0_2px_rgba(0,0,0,0.8)]"
      )}
    />
  );
}
