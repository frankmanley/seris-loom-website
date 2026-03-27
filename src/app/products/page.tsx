import { products } from "@/data/products";
import { SectionDark } from "@/components/layout/section-dark";
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { Card } from "@/components/ui/card";

export default function ProductsPage() {
  return (
    <>
      <SectionDark>
        <h1 className="font-display font-thin text-4xl md:text-5xl tracking-display uppercase text-dark-text mb-4">
          Products
        </h1>
        <p className="font-display font-extralight text-base text-dark-text-dim tracking-wide">
          Utility-first audio tools — coming soon
        </p>
      </SectionDark>

      <ChannelStrip label="IN DEVELOPMENT" activeLEDs={0} totalLEDs={products.length} />

      <SectionLight>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((product) => (
            <Card
              key={product.slug}
              title={product.name}
              description={product.tagline}
              status={product.status}
              image={product.image}
            />
          ))}
        </div>
      </SectionLight>
    </>
  );
}
