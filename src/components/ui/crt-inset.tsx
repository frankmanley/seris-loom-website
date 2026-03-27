"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useInView } from "motion/react";

interface CRTInsetProps {
  children: React.ReactNode;
  className?: string;
  scanLine?: boolean;
}

export function CRTInset({
  children,
  className,
  scanLine = true,
}: CRTInsetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [scanComplete, setScanComplete] = useState(false);

  return (
    <div
      ref={ref}
      className={cn(
        "relative bg-screen-black border border-dark-border rounded-[--radius-card] overflow-hidden",
        "shadow-[inset_0_0_30px_rgba(0,0,0,0.8),0_0_20px_rgba(74,106,66,0.03)]",
        className
      )}
    >
      {/* Scan lines texture */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,106,26,0.015) 2px, rgba(200,106,26,0.015) 4px)",
        }}
      />

      {/* CRT init scan line animation */}
      {scanLine && isInView && !scanComplete && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px] bg-accent-amber/20 animate-scan-line"
          onAnimationEnd={() => setScanComplete(true)}
        />
      )}

      {/* Content */}
      <div className="relative z-0">{children}</div>
    </div>
  );
}
