import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diwali — A Cinematic Journey of Light",
  description:
    "Scroll through a glowing palace, a living rangoli, a river of diyas, and a sky full of celebration. शुभ दीपावली!",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
