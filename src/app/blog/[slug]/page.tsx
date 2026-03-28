import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog-posts";
import { SectionDark } from "@/components/layout/section-dark";
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <>
      <SectionDark className="pt-24">
        <span className="font-mono text-xs text-dark-text-muted tracking-mono">
          {post.date}
        </span>
        <h1 className="font-display font-thin text-3xl md:text-4xl tracking-heading uppercase text-dark-text mt-2">
          {post.title}
        </h1>
      </SectionDark>

      <ChannelStrip label={post.date} activeLEDs={1} totalLEDs={3} />

      <SectionLight>
        <article className="max-w-2xl mx-auto">
          <p className="font-body font-light text-base text-light-text leading-[1.8]">
            {post.body}
          </p>
        </article>
      </SectionLight>
    </>
  );
}
