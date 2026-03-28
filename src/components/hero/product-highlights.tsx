import { cn } from "@/lib/utils";
import { products } from "@/data/products";
import { LEDIndicator } from "@/components/ui/led-indicator";
import Link from "next/link";

export function ProductHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
      {products.map((product, i) => {
        const isActive = product.status === "active";
        return (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className={cn(
              "group p-6 border-l border-accent-green/20",
              "bg-dark-base/50 backdrop-blur-sm",
              "transition-all duration-500",
              "hover:bg-dark-surface/70 hover:border-accent-green/40"
            )}
          >
            <span className="font-mono text-[9px] text-accent-green tracking-[0.2em] block mb-3">
              MODULE_{String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display font-extralight text-base tracking-label uppercase text-[#EDE7DB] mb-2">
              {product.name}
            </h3>
            <p className="font-mono text-[10px] text-dark-text-muted tracking-mono leading-relaxed mb-4">
              {product.tagline}
            </p>
            <div className="flex justify-between items-center">
              <span className={cn("font-mono text-[9px] tracking-mono", isActive ? "text-accent-amber" : "text-dark-text-muted")}>
                v{product.version || "0.0"}
              </span>
              <LEDIndicator
                color={isActive ? "green" : "amber"}
                pulse={isActive}
                className={cn(!isActive && "opacity-20 shadow-none")}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
