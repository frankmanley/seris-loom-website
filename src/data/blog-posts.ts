export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  body: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: "Building Seris Res",
    slug: "building-seris-res",
    excerpt: "The design philosophy behind our first plugin — resonance extraction as a creative tool.",
    date: "2026-03-15",
    body: "This is placeholder content for the first blog post. The full article will detail the design process behind Seris Res, from initial concept to final implementation. We'll cover the signal processing decisions, the UI philosophy, and why we chose resonance extraction as our first tool.",
  },
  {
    title: "Between the Signal and the Silence",
    slug: "between-signal-and-silence",
    excerpt: "What it means to build utility-first audio tools in a world of feature creep.",
    date: "2026-03-01",
    body: "Placeholder content for the brand philosophy post. This will explore what 'utility-first' means in practice, how we approach feature design, and the philosophy of building tools that disappear into the workflow.",
  },
];
