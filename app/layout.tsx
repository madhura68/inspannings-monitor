import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Inspannings Monitor",
  description:
    "Wellness-first app voor energieplanning, zelfreflectie en een rustige plan-doe-evalueer flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
