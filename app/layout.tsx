import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Charmin & Krupali | Wedding Invitation",
  description: "With our families, we invite you to celebrate the wedding of Charmin and Krupali on 6 December 2026.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}