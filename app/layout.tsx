import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
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
  openGraph: {
    type: "website",
    siteName: "HVACR Group",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
