import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRR Krupinski | Revenda de Combustíveis, Lubrificantes e Tanques em Comodato",
  description: "Abastecimento com pontualidade para o agronegócio e transportadoras em RO e MT. Diesel S-10, Diesel S-500, Lubrificantes e Tanques em Comodato. Bases em Vilhena, Comodoro, Campo Novo do Parecis e Aripuanã.",
  keywords: [
    "TRR Krupinski",
    "TRR Rondônia",
    "TRR Mato Grosso",
    "Diesel S10 Vilhena",
    "Diesel fazenda",
    "Comodato de tanque de combustível",
    "Diesel colheitadeira safra",
    "TRR Comodoro",
    "TRR Campo Novo do Parecis",
    "TRR Aripuanã"
  ],
  authors: [{ name: "TRR Krupinski" }],
  openGraph: {
    title: "TRR Krupinski | Combustível no Seu Tanque, Onde Sua Operação Estiver",
    description: "Mais de 30 anos abastecendo a safra e as frotas de Rondônia e Mato Grosso com qualidade certificada ANP e ANTT.",
    url: "https://trrkrupinski.com.br",
    siteName: "TRR Krupinski",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
