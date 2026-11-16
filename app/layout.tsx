import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Libre_Caslon_Text,
  Courier_Prime,
  Caveat,
} from "next/font/google";
import { Agentation } from "agentation";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const caslon = Libre_Caslon_Text({
  variable: "--font-libre-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const courier = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Handwriting for the pen notes on screenshots. Caveat stays legible at small sizes.
const hand = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const description =
  "Designer, engineer and writer. Currently at Emerge Career, coaching formerly incarcerated people into high-paying skilled-trades jobs.";

export const metadata: Metadata = {
  title: "sherry xinrui liu",
  description,
  openGraph: {
    title: "sherry xinrui liu",
    description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "sherry xinrui liu",
    description,
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
        className={`${bodoni.variable} ${caslon.variable} ${courier.variable} ${hand.variable} antialiased`}
      >
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
