import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://framextractor.vercel.app"),
  title: {
    default: "FrameXtractor — Extract Video Frames Free, Instantly",
    template: "%s | FrameXtractor",
  },
  description:
    "Extract high-quality frames from any video directly in your browser. 100% free, private, client-side — no uploads, no account, no server.",
  keywords: [
    "video frame extractor", "extract frames from video", "screenshot from video",
    "frame capture tool", "free video tool", "privacy video tool",
    "browser video frame", "PNG JPEG from video", "caosdev",
  ],
  authors: [{ name: "caosdev", url: "https://caosdev.vercel.app/" }],
  creator: "caosdev",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://framextractor.vercel.app/",
    siteName: "FrameXtractor",
    title: "FrameXtractor — Free Video Frame Extractor",
    description: "Extract frames from any video instantly in your browser. Free, private, no uploads ever.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FrameXtractor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FrameXtractor — Free Video Frame Extractor",
    description: "Extract high-quality frames from any video free, in your browser.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "https://framextractor.vercel.app/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "FrameXtractor",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Web Browser",
              description: "Free video frame extractor. Runs entirely in your browser with no uploads.",
              url: "https://framextractor.vercel.app/",
              author: { "@type": "Person", name: "caosdev", url: "https://caosdev.vercel.app/" },
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              sameAs: ["https://caosdev.vercel.app/"],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white min-h-screen flex flex-col antialiased`}
        suppressHydrationWarning
      >
        {/* Background effects — explicit divs avoid pseudo-element conflicts */}
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-glow" aria-hidden="true" />

        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
