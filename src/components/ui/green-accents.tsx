"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Animated green line that draws itself when scrolled into view.
 * Use as a section divider or heading accent.
 */
export function GreenLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        className="h-px bg-accent-green"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

/**
 * Green dot pulse — decorative accent element.
 */
export function GreenDot({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "w-1 h-1", md: "w-1.5 h-1.5", lg: "w-2 h-2" };
  const glows = {
    sm: "shadow-[0_0_3px_#4A6A42]",
    md: "shadow-[0_0_6px_#4A6A42]",
    lg: "shadow-[0_0_10px_#4A6A42]",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-full bg-accent-green animate-led-pulse",
        sizes[size],
        glows[size],
        className
      )}
    />
  );
}

/**
 * Pine green text highlight — wraps a word or phrase in accent color.
 */
export function GreenText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-accent-green", className)}>{children}</span>
  );
}

/**
 * Animated green bar that fills to a target width when scrolled into view.
 * Good for stats, progress, feature highlights.
 */
export function GreenBar({
  width = "100%",
  className,
}: {
  width?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className={cn("h-px bg-dark-border relative overflow-hidden", className)}>
      <motion.div
        className="absolute left-0 top-0 h-full bg-accent-green"
        initial={{ width: 0 }}
        animate={isInView ? { width } : { width: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
    </div>
  );
}

/**
 * Green corner bracket — decorative L-shaped accent mark.
 */
export function GreenCorner({
  position = "top-left",
  className,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const styles = {
    "top-left": "top-0 left-0 border-t border-l",
    "top-right": "top-0 right-0 border-t border-r",
    "bottom-left": "bottom-0 left-0 border-b border-l",
    "bottom-right": "bottom-0 right-0 border-b border-r",
  };

  return (
    <div
      className={cn(
        "absolute w-4 h-4 border-accent-green/40 pointer-events-none",
        styles[position],
        className
      )}
    />
  );
}

/**
 * Vertical green accent line — sits to the left of content as a sidebar accent.
 */
export function GreenSidebar({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        className="w-px bg-accent-green"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "top", height: "100%" }}
      />
    </div>
  );
}
