import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionLight({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("bg-light-base text-light-text", className)}
    >
      <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-20 md:py-28">{children}</div>
    </section>
  );
}
