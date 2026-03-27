import { products } from "@/data/products";
import { SectionDark } from "@/components/layout/section-dark";
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { Card } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";
import { TextureOverlay } from "@/components/ui/texture-overlay";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <>
      <SectionDark>
        <h1 className="font-display font-thin text-4xl md:text-5xl tracking-display uppercase text-dark-text mb-4">
          Products
        </h1>
        <p className="font-display font-extralight text-base text-dark-text-dim tracking-wide">
          Utility-first audio tools for the space between intention and sound
        </p>
      </SectionDark>

      <ChannelStrip label="ALL PRODUCTS" activeLEDs={products.filter(p => p.status === "active").length} totalLEDs={products.length} />

      <SectionLight className="relative overflow-hidden">
        <TextureOverlay texture="grid" opacity={0.03} className="mix-blend-overlay" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.slug} href={`/products/${product.slug}`}>
              <div className="relative overflow-hidden rounded-[--radius-card]">
                <Card
                  title={product.name}
                  description={product.tagline}
                  status={product.status}
                  image={product.image}
                />
                {product.status === "active" && (
                  <BorderBeam
                    size={80}
                    duration={8}
                    colorFrom="#4A6A42"
                    colorTo="#C86A1A"
                    borderWidth={1}
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      </SectionLight>
    </>
  );
}
