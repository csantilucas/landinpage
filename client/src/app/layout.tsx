import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "TRR Krupinski | Revenda de Combustíveis e Lubrificantes",
  description: "Abastecimento com pontualidade para o agronegócio e transportadoras em RO e MT. Óleo Diesel S-10, Diesel S-500, Lubrificantes e Arla 32 com entrega direta. Bases em Vilhena, Comodoro, Campo Novo do Parecis e Aripuanã.",
  keywords: [
    "TRR Krupinski",
    "TRR Rondônia",
    "TRR Mato Grosso",
    "Diesel S10 Vilhena",
    "Diesel fazenda",
    "Abastecimento na lavoura",
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
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-amber-500 selection:text-slate-950">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
