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
    name: "Res",
    slug: "res",
    tagline: "Resonance extractor — filter excitation + sustain shaping",
    status: "pending",
    image: "/images/res-screenshot.png",
    progress: 85,
  },
  {
    name: "Byt",
    slug: "byt",
    tagline: "8-bit Game Boy DMG synth — VHS wobble + tape degradation",
    status: "pending",
    progress: 15,
  },
];
