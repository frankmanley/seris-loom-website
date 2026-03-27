import { LEDIndicator } from "@/components/ui/led-indicator";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-dark-base border-t border-dark-border px-4 md:px-8 py-6">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between gap-4 text-center md:text-left">
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <div
            className="w-3.5 h-3.5 rounded-full shrink-0"
            style={{
              background: "conic-gradient(from 180deg, #E13838, #E87B35, #E8D735, #35E870, #3588E8, #8835E8, #E13838)",
            }}
          />
          <span className="font-display font-thin text-sm tracking-heading uppercase text-dark-text-dim group-hover:text-accent-amber transition-colors duration-300">
            Seris Loom
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LEDIndicator color="green" pulse size="sm" className="shadow-[0_0_6px_rgba(74,106,66,0.6)]" />
          <span className="font-mono text-[10px] text-dark-text-muted tracking-mono">
            SYS.ACTIVE
          </span>
        </div>

        <span className="font-mono text-[10px] text-dark-text-muted tracking-mono">
          &copy; {new Date().getFullYear()} SERIS LOOM
        </span>
      </div>
    </footer>
  );
}
