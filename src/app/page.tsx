"use client";

import { Hero } from "@/components/hero/hero";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { SectionLight } from "@/components/layout/section-light";
import { SectionDark } from "@/components/layout/section-dark";
import { CRTInset } from "@/components/ui/crt-inset";
import { Button } from "@/components/ui/button";
import { LightBoard } from "@/components/ui/lightboard";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { TextureOverlay } from "@/components/ui/texture-overlay";
import { GreenLine, GreenText, GreenBar, GreenCorner, GreenDot } from "@/components/ui/green-accents";
import { products } from "@/data/products";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import Link from "next/link";

function RevealWrapper({ children }: { children: React.ReactNode }) {
  const { ref, isInView } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isInView ? 1 : 0.15,
        filter: isInView ? "brightness(1)" : "brightness(0.6)",
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const featured = products.find((p) => p.status === "active");

  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. LightBoard Ticker */}
      <div className="bg-screen-black border-y border-dark-border py-2">
        <LightBoard
          text="SERIS LOOM // UTILITY FIRST AUDIO TOOLS // RES COMP SIGNAL CULL"
          rows={7}
          gap={1}
          lightSize={3}
          font="default"
          colors={{
            background: "rgba(10, 10, 8, 0.4)",
            textDim: "rgba(74, 106, 66, 0.3)",
            textBright: "rgba(74, 106, 66, 0.85)",
            drawLine: "rgba(200, 106, 26, 0.6)",
          }}
        />
      </div>

      {/* 3. Philosophy */}
      <SectionLight className="relative overflow-hidden">
        <TextureOverlay texture="grid" opacity={0.04} className="mix-blend-overlay" />
        <RevealWrapper>
          <GreenLine className="w-16 mx-auto mb-8" />
          <p className="font-display font-light text-xl md:text-2xl text-light-text text-center max-w-2xl mx-auto leading-relaxed">
            Utility-first audio tools designed for the space between <GreenText>intention</GreenText>
            {" "}and <GreenText>sound</GreenText>. Each plugin in the Seris line is built to disappear into
            your workflow.
          </p>
          <GreenLine className="w-16 mx-auto mt-8" />
        </RevealWrapper>
      </SectionLight>

      {/* 4. Channel Strip */}
      <ChannelStrip label="PRODUCTS" activeLEDs={3} />

      {/* 5. Featured Product */}
      {featured && (
        <SectionDark>
          <RevealWrapper>
            {/* Above: label + heading + CTA row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-xs tracking-label uppercase text-accent-green mb-2">
                  NOW MONITORING
                </p>
                <div className="flex items-center gap-3">
                  <GreenDot size="lg" />
                  <h2 className="font-display font-extralight text-3xl md:text-4xl tracking-heading uppercase text-dark-text">
                    {featured.name}
                  </h2>
                </div>
              </div>
              <Link href={`/products/${featured.slug}`}>
                <Button variant="primary">Learn More</Button>
              </Link>
            </div>

            {/* Main 12-column grid */}
            <div className="relative grid grid-cols-12 gap-px bg-dark-border rounded-[--radius-card] overflow-hidden">
              <BorderBeam
                size={120}
                duration={10}
                colorFrom="#4A6A42"
                colorTo="#C86A1A"
                borderWidth={1}
              />
              {/* Left: CRT display (8 cols) */}
              <div className="col-span-12 lg:col-span-8">
                <CRTInset className="h-80 lg:h-96 rounded-none">
                  {/* Flickering grid background */}
                  <FlickeringGrid
                    className="absolute inset-0 z-0"
                    squareSize={2}
                    gridGap={3}
                    color="rgb(74, 106, 66)"
                    maxOpacity={0.08}
                    flickerChance={0.02}
                  />
                  {/* Plugin screenshot */}
                  {featured.image && (
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                  {/* Overlay: top-left status */}
                  <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-mono text-accent-green/80">
                      SIGNAL: ACTIVE
                    </span>
                    <span className="font-mono text-[10px] tracking-mono text-accent-amber/70">
                      FREQ: 44.1 KHZ
                    </span>
                  </div>
                  {/* Overlay: bottom-right timestamp */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <span className="font-mono text-[10px] tracking-mono text-dark-text-muted/60">
                      {`v${featured.version} // RES-01`}
                    </span>
                  </div>
                  {/* Overlay: corner accents */}
                  <div className="absolute top-2 right-2 z-20 w-4 h-4 border-t border-r border-accent-amber/30" />
                  <div className="absolute bottom-2 left-2 z-20 w-4 h-4 border-b border-l border-accent-amber/30" />
                </CRTInset>
              </div>

              {/* Right: Specs panel (4 cols) */}
              <div className="col-span-12 lg:col-span-4 bg-dark-surface p-5 flex flex-col gap-4">
                <p className="font-mono text-[10px] tracking-label uppercase text-dark-text-muted">
                  TECHNICAL SPECIFICATIONS
                </p>
                <div className="flex flex-col divide-y divide-dark-border">
                  {[
                    { label: "TYPE", value: "Resonance Extractor" },
                    { label: "FORMAT", value: "VST3 / AU" },
                    { label: "LATENCY", value: "0 Samples" },
                    { label: "OS", value: "macOS / Win" },
                    { label: "OVERSAMPLE", value: "2x Always" },
                    { label: "VERSION", value: `v${featured.version}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2">
                      <span className="font-mono text-[10px] tracking-mono uppercase text-dark-text-muted">
                        {label}
                      </span>
                      <span className="font-mono text-[10px] tracking-mono text-dark-text">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="font-body font-light text-xs text-dark-text-dim leading-relaxed mt-auto">
                  {featured.tagline}
                </p>
              </div>
            </div>
          </RevealWrapper>
        </SectionDark>
      )}

      {/* 6. Channel Strip */}
      <ChannelStrip label="PIPELINE" activeLEDs={2} totalLEDs={6} />

      {/* 7. Pipeline / R&D */}
      <SectionLight className="relative overflow-hidden">
        <TextureOverlay texture="dots" opacity={0.03} className="mix-blend-overlay" />
        <RevealWrapper>
          {/* Heading */}
          <div className="text-center mb-8">
            <GreenLine className="w-12 mx-auto mb-6" />
            <h2 className="font-display font-extralight text-2xl tracking-heading uppercase text-light-text mb-2">
              Research &amp; Development
            </h2>
            <p className="font-mono text-xs tracking-label text-light-text-muted uppercase">
              Active pipeline — <GreenText>{products.length} projects</GreenText> registered
            </p>
          </div>

          {/* R&D grid: 1px gap border effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-light-border rounded-[--radius-card] overflow-hidden">
            {products.map((product, index) => {
              const projectNum = String(index + 1).padStart(3, "0");
              const isActive = product.status === "active";
              const isBeta = !isActive && (product.progress ?? 0) > 20;
              const badgeLabel = isActive ? "ACTIVE" : isBeta ? "BETA" : "CONCEPT";
              const badgeClass = isActive
                ? "bg-accent-green/20 text-accent-green"
                : isBeta
                ? "bg-accent-amber/20 text-accent-amber"
                : "bg-light-surface text-light-text-muted";

              return (
                <div key={product.slug} className="bg-light-base p-5 flex flex-col gap-3">
                  {/* Project number + status badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-mono text-light-text-muted">
                      PROJECT_{projectNum}
                    </span>
                    <span
                      className={`font-mono text-[9px] tracking-label uppercase px-1.5 py-0.5 rounded-sm ${badgeClass}`}
                    >
                      {badgeLabel}
                    </span>
                  </div>

                  {/* Product name */}
                  <h3 className="font-display font-light text-base tracking-label uppercase text-light-text leading-tight">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-xs text-light-text-dim leading-relaxed flex-1">
                    {product.tagline}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-[9px] tracking-mono text-light-text-muted uppercase">
                        Progress
                      </span>
                      <span className="font-mono text-[9px] tracking-mono text-light-text-muted">
                        {product.progress ?? 0}%
                      </span>
                    </div>
                    <div className="h-px w-full bg-light-border relative overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full ${
                          isActive ? "bg-accent-green" : "bg-accent-amber/60"
                        }`}
                        style={{ width: `${product.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Placeholder slot — keeps 4-col rhythm if fewer than 4 products */}
            {products.length < 4 && (
              <div className="bg-light-base p-5 flex flex-col gap-3 opacity-30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-mono text-light-text-muted">
                    PROJECT_{String(products.length + 1).padStart(3, "0")}
                  </span>
                  <span className="font-mono text-[9px] tracking-label uppercase px-1.5 py-0.5 rounded-sm bg-light-surface text-light-text-muted">
                    TBD
                  </span>
                </div>
                <h3 className="font-display font-light text-base tracking-label uppercase text-light-text leading-tight">
                  Undisclosed
                </h3>
                <p className="font-body text-xs text-light-text-dim leading-relaxed flex-1">
                  Details withheld pending internal review.
                </p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[9px] tracking-mono text-light-text-muted uppercase">
                      Progress
                    </span>
                    <span className="font-mono text-[9px] tracking-mono text-light-text-muted">
                      —
                    </span>
                  </div>
                  <div className="h-px w-full bg-light-border" />
                </div>
              </div>
            )}
          </div>
        </RevealWrapper>
      </SectionLight>

      {/* 8. Channel Strip */}
      <ChannelStrip activeLEDs={0} totalLEDs={6} />
    </>
  );
}
