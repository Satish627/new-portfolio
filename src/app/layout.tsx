import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CanvasRoot from "@/components/canvas/CanvasRoot";
import SmoothScroll from "@/components/dom/SmoothScroll";
import ScrollProgress from "@/components/dom/ScrollProgress";
import Nav from "@/components/dom/Nav";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Satish Gurung — Software Developer",
  description:
    "Building living interfaces from code. Portfolio of Satish Gurung, a Copenhagen-based full-stack developer crafting immersive web experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}
    >
      <body>
        <CanvasRoot />
        <SmoothScroll />
        <ScrollProgress />
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
