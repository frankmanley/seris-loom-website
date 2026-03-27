import { cn } from "@/lib/utils";

type LEDColor = "green" | "amber" | "red";

interface LEDIndicatorProps {
  color?: LEDColor;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const colorMap: Record<LEDColor, { bg: string; glow: string }> = {
  green: { bg: "bg-accent-green", glow: "shadow-[0_0_4px_#4A6A42]" },
  amber: { bg: "bg-accent-amber", glow: "shadow-[0_0_4px_#C86A1A]" },
  red: { bg: "bg-accent-red", glow: "shadow-[0_0_4px_#8A2A2A]" },
};

const sizeMap: Record<"sm" | "md", string> = {
  sm: "w-1 h-1",
  md: "w-1.5 h-1.5",
};

export function LEDIndicator({
  color = "green",
  pulse = false,
  size = "sm",
  className,
}: LEDIndicatorProps) {
  const { bg, glow } = colorMap[color];

  return (
    <span
      className={cn(
        "inline-block rounded-full",
        bg,
        glow,
        sizeMap[size],
        pulse && "animate-led-pulse",
        className
      )}
    />
  );
}
