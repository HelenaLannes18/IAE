import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-SH5239LSZF" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SH5239LSZF');
          `}
        </Script>
        {children}
        <Analytics />
      </body>
    </html>
  );
}