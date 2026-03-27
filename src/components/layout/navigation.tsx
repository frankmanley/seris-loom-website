"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LEDIndicator } from "@/components/ui/led-indicator";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "backdrop-blur-sm",
        "px-4 md:px-8 lg:px-12 py-4 grid grid-cols-3 items-center",
        "transition-[border-color] duration-300",
        scrolled ? "border-b border-dark-border" : "border-b border-transparent"
      )}
      style={{
        backgroundImage: "linear-gradient(rgba(20, 18, 16, 0.92), rgba(20, 18, 16, 0.92)), url('/images/textures/console-wood.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left: logo */}
      <Link
        href="/"
        className="flex items-center gap-3 group"
      >
        <div
          className="w-5 h-5 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: "conic-gradient(from 180deg, #E13838, #E87B35, #E8D735, #35E870, #3588E8, #8835E8, #E13838)",
          }}
        />
        <span className="font-display font-thin text-lg tracking-display uppercase text-dark-text group-hover:text-accent-amber transition-colors duration-300">
          Seris Loom
        </span>
      </Link>

      {/* Center: nav links — hidden on mobile, visible md+ */}
      <div className="hidden md:flex items-center justify-center gap-8">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-2",
                "font-display font-normal text-[11px] tracking-label uppercase",
                "transition-colors duration-300",
                isActive
                  ? "text-dark-text after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-px after:bg-accent-amber after:shadow-[0_0_8px_#C86A1A]"
                  : "text-dark-text-muted hover:text-dark-text-dim hover:after:content-[''] hover:after:absolute hover:after:-bottom-2 hover:after:left-0 hover:after:w-full hover:after:h-px hover:after:bg-accent-green hover:after:shadow-[0_0_6px_#4A6A42] hover:after:opacity-60"
              )}
            >
              <LEDIndicator
                color="green"
                pulse={isActive}
                className={cn(
                  "transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                )}
              />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right: LED + date */}
      <div className="flex items-center justify-end gap-2 opacity-40">
        <span className="w-1 h-1 rounded-full bg-accent-green shadow-[0_0_3px_#4A6A42]" />
        <span className="font-mono text-[10px] text-accent-green tracking-mono">
          {new Date()
            .toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
            })
            .replace(/\//g, ".")}
        </span>
      </div>
    </nav>
  );
}
