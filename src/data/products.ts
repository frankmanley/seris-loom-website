export interface Product {
  name: string;
  slug: string;
  tagline: string;
  status: "active" | "pending";
  version?: string;
  image?: string;
  progress?: number; // 0-100
}

export const products: Product[] = [
  {
    name: "Seris Res",
    slug: "res",
    tagline: "Resonance extractor — filter excitation + sustain shaping",
    status: "active",
    version: "1.2",
    image: "/images/res-screenshot.png",
    progress: 100,
  },
  {
    name: "Seris Comp",
    slug: "comp",
    tagline: "VCA-style bus compressor",
    status: "pending",
    progress: 35,
  },
  {
    name: "Signal Cull",
    slug: "signal-cull",
    tagline: "Precision signal gate + ducker",
    status: "pending",
    progress: 15,
  },
];
