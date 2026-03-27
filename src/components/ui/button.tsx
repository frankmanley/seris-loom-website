import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-accent-amber text-dark-base",
    "hover:shadow-[0_0_20px_rgba(74,106,66,0.25),0_0_8px_rgba(200,106,26,0.2)]",
    "active:translate-y-[1px]",
  ].join(" "),
  secondary: [
    "bg-transparent border border-dark-border text-dark-text",
    "hover:border-accent-green hover:shadow-[0_0_8px_rgba(74,106,66,0.12)]",
  ].join(" "),
  ghost: [
    "bg-transparent text-dark-text-dim",
    "hover:text-dark-text hover:underline underline-offset-4",
  ].join(" "),
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        "font-display font-normal text-xs tracking-label uppercase",
        "px-5 py-2.5 rounded-[--radius-btn]",
        "transition-all duration-150",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
