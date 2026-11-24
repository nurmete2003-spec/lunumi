import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-display" });
const body = Nunito({ subsets: ["latin", "latin-ext"], variable: "--font-body" });

export const metadata: Metadata = { title: "Lunumi · Learn. Grow. Glow.", description: "Your little universe of learning." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
