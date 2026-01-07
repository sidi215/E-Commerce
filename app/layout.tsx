import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriMauritanie - Plateforme Agricole Numérique",
  description: "Connectant les agriculteurs mauritaniens aux marchés locaux avec des outils intelligents pour améliorer leurs revenus",
};

// Root layout - The middleware redirects to [locale] routes
// This layout provides the base HTML structure
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The middleware handles all routing to [locale]
  // This provides the base HTML structure
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
