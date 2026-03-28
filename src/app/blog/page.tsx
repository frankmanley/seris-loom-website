import { blogPosts } from "@/data/blog-posts";
import { SectionDark } from "@/components/layout/section-dark";
import { SectionLight } from "@/components/layout/section-light";
import { ChannelStrip } from "@/components/ui/channel-strip";
import Link from "next/link";

export default function BlogPage() {
  return (
    <>
      <SectionDark>
        <h1 className="font-display font-thin text-4xl md:text-5xl tracking-display uppercase text-dark-text mb-4">
          Journal
        </h1>
        <p className="font-display font-extralight text-base text-dark-text-dim tracking-wide">
          Notes from the signal path
        </p>
      </SectionDark>

      <ChannelStrip label="JOURNAL" activeLEDs={blogPosts.length} totalLEDs={6} />

      <SectionLight>
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-dark-surface border border-dark-border rounded-[--radius-card] p-6 transition-all duration-200 hover:border-dark-text-muted"
            >
              <span className="font-mono text-[10px] text-dark-text-muted tracking-mono">
                {post.date}
              </span>
              <h2 className="font-display font-light text-xl tracking-heading uppercase text-dark-text mt-1 mb-2 group-hover:text-accent-amber transition-colors">
                {post.title}
              </h2>
              <p className="font-body font-light text-sm text-dark-text-dim leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </SectionLight>
    </>
  );
}
