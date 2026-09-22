import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configurando a fonte Inter
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.iae.edu.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "IAE - Instituto de Advocacia Empresarial",
  description: "Conectando a técnica jurídica à realidade corporativa.",
  openGraph: {
    title: "IAE - Instituto de Advocacia Empresarial",
    description: "Conectando a técnica jurídica à realidade corporativa.",
    siteName: "IAE - Instituto de Advocacia Empresarial",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IAE - Instituto de Advocacia Empresarial",
    description: "Conectando a técnica jurídica à realidade corporativa.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased scroll-smooth"
    >
      {/* Aplicando a classe da fonte Inter no body */}
      <body className={`${inter.className} min-h-full flex flex-col bg-[#f5f4f0] text-slate-900`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}