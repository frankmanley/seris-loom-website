"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LEDIndicator } from "@/components/ui/led-indicator";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "backdrop-blur-sm",
          "px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between",
          "border-b border-[#3A342C] shadow-[0_2px_0_0_rgba(60,54,44,0.6),0_3px_0_0_rgba(10,8,6,0.8),0_4px_8px_0_rgba(0,0,0,0.4)]"
        )}
        style={{
          backgroundImage: "linear-gradient(rgba(20, 18, 16, 0.75), rgba(20, 18, 16, 0.75)), url('/images/textures/console-wood.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Left: logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <img src="/logo-mark.svg" alt="" className="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display font-bold text-lg tracking-[0.08em] uppercase text-dark-text group-hover:text-accent-amber transition-colors duration-300">
            Seris Loom
          </span>
        </Link>

        {/* Center: nav links — desktop only */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Right: date (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 opacity-40">
            <span className="w-1 h-1 rounded-full bg-accent-green shadow-[0_0_3px_#4A6A42]" />
            <span className="font-pixel text-[10px] text-accent-green tracking-mono">
              {new Date()
                .toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "2-digit",
                })
                .replace(/\//g, ".")}
            </span>
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={cn(
                "block w-5 h-px bg-dark-text transition-all duration-300",
                menuOpen && "translate-y-[6px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block w-5 h-px bg-dark-text transition-all duration-300",
                menuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block w-5 h-px bg-dark-text transition-all duration-300",
                menuOpen && "-translate-y-[6px] -rotate-45"
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-dark-base/90 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu content */}
        <div
          className={cn(
            "absolute top-16 left-0 right-0 p-6 flex flex-col gap-6 transition-transform duration-300",
            menuOpen ? "translate-y-0" : "-translate-y-4"
          )}
          style={{
            backgroundImage: "linear-gradient(rgba(20, 18, 16, 0.95), rgba(20, 18, 16, 0.95)), url('/images/textures/console-wood.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 py-2 border-b border-dark-border/30",
                  "font-display font-light text-base tracking-label uppercase",
                  isActive ? "text-dark-text" : "text-dark-text-muted"
                )}
              >
                <LEDIndicator
                  color={isActive ? "green" : "amber"}
                  size="sm"
                  className={cn(!isActive && "opacity-20")}
                />
                {label}
              </Link>
            );
          })}

          {/* Mobile date */}
          <div className="flex items-center gap-2 opacity-30 pt-2">
            <span className="w-1 h-1 rounded-full bg-accent-green shadow-[0_0_3px_#4A6A42]" />
            <span className="font-pixel text-[10px] text-accent-green tracking-mono">
              {new Date()
                .toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "2-digit",
                })
                .replace(/\//g, ".")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
