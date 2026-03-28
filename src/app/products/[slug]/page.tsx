import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { SectionDark } from "@/components/layout/section-dark";
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";
import { CRTInset } from "@/components/ui/crt-inset";
import { LEDIndicator } from "@/components/ui/led-indicator";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  return (
    <>
      <SectionDark className="pt-24">
        <div className="flex items-center gap-3 mb-4">
          <LEDIndicator color="amber" size="md" />
          <span className="font-pixel text-xs text-dark-text-muted tracking-mono uppercase">
            Coming Soon
          </span>
        </div>
        <h1 className="font-display font-thin text-4xl md:text-5xl tracking-display uppercase text-dark-text mb-4">
          {product.name}
        </h1>
        <p className="font-display font-extralight text-lg text-dark-text-dim tracking-wide mb-8">
          {product.tagline}
        </p>

        {product.image && (
          <CRTInset className="p-4 max-w-3xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full object-contain"
            />
          </CRTInset>
        )}
      </SectionDark>

      <ChannelStrip label={product.name.toUpperCase()} activeLEDs={1} />

      <SectionLight>
        <h2 className="font-display font-extralight text-2xl tracking-heading uppercase text-light-text mb-6">
          Overview
        </h2>
        <p className="font-body font-light text-light-text-dim leading-relaxed max-w-2xl">
          {product.tagline}. Currently in development — more details coming soon.
        </p>
      </SectionLight>

      <ChannelStrip activeLEDs={0} />
    </>
  );
}
