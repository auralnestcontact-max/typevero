import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Typevero – Typing test multilingua",
  description:
    "Allena la velocità di digitazione in più lingue con Typevero, in un ambiente calmo e pulito.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-neutral-950`}>
        {children}
      </body>
    </html>
  );
}
