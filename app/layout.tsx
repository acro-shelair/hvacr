import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hvacrgroup.com.au"),
  title: {
    default: "HVACR Group | Refrigeration & Air Conditioning Experts | Brisbane QLD",
    template: "%s | HVACR Group",
  },
  description:
    "Queensland's most trusted refrigeration and climate control group. Three specialist brands — Acro Refrigeration, Shelair & Koolacube — serving commercial and industrial clients since 1972.",
  keywords: [
    "HVACR",
    "refrigeration Brisbane",
    "air conditioning Queensland",
    "commercial refrigeration",
    "industrial HVAC",
    "cold room installation",
    "Acro Refrigeration",
    "Shelair",
    "Koolacube",
    "HVAC QLD",
    "commercial air conditioning NSW",
  ],
  authors: [{ name: "HVACR Group", url: "https://hvacrgroup.com.au" }],
  creator: "HVACR Group",
  openGraph: {
    type: "website",
    siteName: "HVACR Group",
    locale: "en_AU",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HVACR Group — Queensland's most trusted refrigeration and climate control group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@HVACRGroup",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://hvacrgroup.com.au",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
