import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Typevero – Typing test multilingua",
  description:
    "Allena la velocità di digitazione in più lingue con Typevero, in un ambiente calmo, moderno e pulito.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className + " bg-neutral-950 text-neutral-100"}>
        {children}
      </body>
    </html>
  );
}