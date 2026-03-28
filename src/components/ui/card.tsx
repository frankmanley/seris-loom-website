import { cn } from "@/lib/utils";
import { CRTInset } from "./crt-inset";
import { LEDIndicator } from "./led-indicator";

interface CardProps {
  title: string;
  description: string;
  status?: "active" | "pending";
  image?: string;
  className?: string;
  onClick?: () => void;
}

export function Card({
  title,
  description,
  status = "pending",
  image,
  className,
  onClick,
}: CardProps) {
  const isActive = status === "active";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group border rounded-[--radius-card] p-4 transition-all duration-200",
        "bg-dark-surface border-dark-border",
        "hover:shadow-[0_2px_20px_rgba(74,106,66,0.08)]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {image && (
        <CRTInset
          className={cn(
            "mb-3 h-32 transition-all duration-300",
            "group-hover:shadow-[inset_0_0_20px_rgba(200,106,26,0.05)]"
          )}
          scanLine={isActive}
        >
          <img
            src={image}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isActive ? "opacity-80 group-hover:opacity-100" : "opacity-30"
            )}
          />
        </CRTInset>
      )}

      <div className="flex items-center gap-2 mb-1">
        <LEDIndicator
          color={isActive ? "green" : "amber"}
          pulse={isActive}
          className={cn(!isActive && "opacity-20 shadow-none")}
        />
        <h3 className="font-display font-normal text-xs tracking-label uppercase text-dark-text">
          {title}
        </h3>
      </div>
      <p className="font-pixel text-[10px] text-dark-text-muted tracking-mono">
        {description}
      </p>
    </div>
  );
}
