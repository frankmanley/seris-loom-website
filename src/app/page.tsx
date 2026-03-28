"use client";

import { Hero } from "@/components/hero/hero";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { SectionLight } from "@/components/layout/section-light";
import { SectionDark } from "@/components/layout/section-dark";
import { CRTInset } from "@/components/ui/crt-inset";
import { LightBoard } from "@/components/ui/lightboard";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { TextureOverlay } from "@/components/ui/texture-overlay";
import { GreenLine, GreenText, GreenDot } from "@/components/ui/green-accents";
import { ScaledIframe } from "@/components/ui/scaled-iframe";
import { products } from "@/data/products";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

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
  const byt = products.find((p) => p.slug === "byt");
  const res = products.find((p) => p.slug === "res");

  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. LightBoard Ticker */}
      <div className="bg-screen-black border-y border-dark-border py-2">
        <LightBoard
          text="SERIS LOOM // UTILITY FIRST AUDIO TOOLS // COMING SOON"
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
      <ChannelStrip label="PREVIEW" activeLEDs={1} />

      {/* 5. Featured Product — Byt */}
      {byt && (
        <SectionDark>
          <RevealWrapper>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <p className="font-pixel text-xs tracking-label uppercase text-accent-amber mb-2">
                  COMING SOON
                </p>
                <div className="flex items-center gap-3">
                  <GreenDot size="lg" />
                  <h2 className="font-display font-extralight text-3xl md:text-4xl tracking-heading uppercase text-dark-text">
                    {byt.name}
                  </h2>
                </div>
              </div>
              <span className="font-pixel text-[10px] tracking-mono uppercase text-dark-text-muted">
                In Development
              </span>
            </div>

            <div className="relative rounded-[--radius-card] overflow-hidden">
              <BorderBeam
                size={120}
                duration={10}
                colorFrom="#4A6A42"
                colorTo="#C86A1A"
                borderWidth={1}
              />
              <ScaledIframe
                src="/byt-prototype/index.html"
                title="Seris Byt — 8-bit Synth Plugin"
                width={620}
                height={380}
                className="w-full"
              />
            </div>

            <p className="font-body font-light text-sm text-dark-text-dim leading-relaxed mt-6 max-w-2xl">
              {byt.tagline}
            </p>
          </RevealWrapper>
        </SectionDark>
      )}

      {/* 6. Channel Strip */}
      <ChannelStrip label="PIPELINE" activeLEDs={1} totalLEDs={4} />

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

          {/* R&D grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-light-border rounded-[--radius-card] overflow-hidden">
            {products.map((product, index) => {
              const projectNum = String(index + 1).padStart(3, "0");

              return (
                <div key={product.slug} className="bg-light-base p-5 flex flex-col gap-3">
                  {/* Project number + status badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-mono text-light-text-muted">
                      PROJECT_{projectNum}
                    </span>
                    <span className="font-pixel text-[9px] tracking-label uppercase px-1.5 py-0.5 rounded-sm bg-accent-amber/20 text-accent-amber">
                      IN DEV
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
                        className="absolute left-0 top-0 h-full bg-accent-amber/60"
                        style={{ width: `${product.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </RevealWrapper>
      </SectionLight>

      {/* 8. Channel Strip */}
      <ChannelStrip activeLEDs={0} totalLEDs={4} />
    </>
  );
}
