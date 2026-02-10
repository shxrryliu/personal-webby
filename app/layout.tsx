import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "sherry xinrui liu",
  description: "Product manager and designer creating better web UX for underserved communities. Currently improving education for 1 in 3 K-12 students in the United States.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "sherry xinrui liu — portfolio v2026.0",
    description: "Product manager and designer creating better web UX for underserved communities.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "sherry xinrui liu — portfolio v2026.0",
    description: "Product manager and designer creating better web UX for underserved communities.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
