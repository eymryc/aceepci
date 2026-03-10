import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import "./globals.css";

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
    <html lang="fr">
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

