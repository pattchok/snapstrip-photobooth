import type { Metadata } from "next";
import { Patrick_Hand, Gaegu } from "next/font/google";
import { BoothProvider } from "@/lib/BoothProvider";
import "./globals.css";

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: "400",
});

const gaegu = Gaegu({
  variable: "--font-gaegu",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "SnapStrip | Digital Photo Booth",
  description:
    "Your instant photo booth is here! Pick a fun theme, strike some poses, and get a cute photo strip to share!",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${patrickHand.variable} ${gaegu.variable} h-full`}>
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily: "var(--font-gaegu), cursive",
          background: "#FFF8F0",
          color: "#2A2A2A",
        }}
      >
        <BoothProvider>{children}</BoothProvider>
      </body>
    </html>
  );
}
