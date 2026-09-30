import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "SAGE Skyline — Independent Campaign Concept", description: "A cinematic independent digital experience concept for SAGE Skyline in Bawadiya Kalan, Bhopal.", icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
