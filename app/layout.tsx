import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { siteConfig } from "@/config/site";
import "./globals.css";

const rajdhani = Rajdhani({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["ACEEPCI", "jeunesse protestante", "Côte d'Ivoire", "évangélisation", "étudiants", "élèves"],
  openGraph: {
    type: "website",
    locale: "fr_CI",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={rajdhani.variable}>
      <body className={`${rajdhani.className} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

