import type { Metadata } from "next";
import { Outfit, Manrope, Saira } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-outfit" });
const manrope = Manrope({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-manrope" });
const saira = Saira({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-saira" });

const title = "Running Higgs Realtime on ESP32";
const description =
  "Build ESP32 voice devices powered by Higgs Realtime using Elato’s open-source stack. Explore the hardware, audio streaming and global edge deployment.";
const image = { url: "/opengraph-image.jpg", width: 1774, height: 887, alt: "Illustrated voice assistants in a factory, a kitchen and a child's room" };

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: `${title} – Boson AI`,
  description,
  authors: [{ name: "The Boson AI Team" }],
  openGraph: {
    type: "article",
    siteName: "Boson AI",
    title,
    description,
    publishedTime: "2026-10-27T00:00:00.000Z",
    authors: ["The Boson AI Team"],
    images: [image],
  },
  twitter: { card: "summary_large_image", title, description, images: [image.url] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${manrope.variable} ${saira.variable}`}>
      <body>{children}</body>
    </html>
  );
}
