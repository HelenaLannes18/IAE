import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configurando a fonte Inter
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IAE - Instituto de Advocacia Empresarial",
  description: "Conectando a técnica jurídica à realidade corporativa.",
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
      </body>
    </html>
  );
}