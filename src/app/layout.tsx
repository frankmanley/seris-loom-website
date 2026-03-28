import type { Metadata } from "next";
import { Space_Grotesk, Pixelify_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixelify-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteUrl = "https://serisloom.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seris Loom — Utility-First Audio Tools",
    template: "%s | Seris Loom",
  },
  description:
    "Utility-first VST3 audio plugins for producers and engineers. Resonance extraction, bus compression, and precision signal tools designed to disappear into your workflow.",
  keywords: [
    "VST3 plugins",
    "audio plugins",
    "music production",
    "resonance extractor",
    "bus compressor",
    "mixing tools",
    "mastering plugins",
    "DAW plugins",
    "Ableton plugins",
    "free music tools",
    "online metronome",
    "chromatic tuner",
    "delay calculator",
  ],
  authors: [{ name: "Seris Loom" }],
  creator: "Seris Loom",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Seris Loom",
    title: "Seris Loom — Utility-First Audio Tools",
    description:
      "Utility-first VST3 audio plugins for producers and engineers. Free tools: metronome, tuner, delay calculator, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Seris Loom — Utility-First Audio Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seris Loom — Utility-First Audio Tools",
    description:
      "Utility-first VST3 audio plugins for producers and engineers.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${pixelifySans.variable} ${ibmPlexMono.variable}`}>
      <body className="font-body bg-dark-base text-dark-text antialiased">
        <Navigation />
        <main className="pt-[52px]">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
