import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="nl">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
