export interface OperationalBase {
  id: string;
  name: string;
  city: string;
  state: 'RO' | 'MT';
  type: string;
  address: string;
  phones: string[];
  whatsappNumber: string; // international format for click to chat
  whatsappDisplay: string;
  coverage: string;
  highlights: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
  embedUrl: string;
  wazeUrl?: string;
}

export interface ProductService {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  idealFor: string;
  badge?: string;
}

export const COMPANY_INFO = {
  name: "TRR Krupinski",
  fullName: "Comércio e Transporte de Combustíveis Krupinski Ltda",
  foundedYear: 1995,
  yearsOfExperience: 31,
  anttRegister: "RNTRC 001952720",
  anpCompliant: true,
  matrizAddress: "Avenida Itaúba, 12707, Lote 06, Q-02 - Setor Industrial S-11, Vilhena - RO, CEP: 76987-760",
  coordinates: {
    lat: -12.791039,
    lng: -60.087482,
  },
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-12.791039,-60.087482",
  googleMapsRouteUrl: "https://www.google.com/maps/dir/?api=1&destination=-12.791039,-60.087482",
  wazeUrl: "https://www.waze.com/ul?ll=-12.791039,-60.087482&navigate=yes",
  googleMapsEmbed: "https://maps.google.com/maps?q=-12.79103946685791,-60.08748245239258&hl=pt-BR&z=16&output=embed",
  mainPhone: "(69) 3322-1589",
  mainEmergencyPhone: "(69) 9995-2942",
  mainWhatsApp: "5569999952942",
  email: "contato@trrkrupinski.com.br",
};

export const OPERATIONAL_BASES: OperationalBase[] = [
  {
    id: "vilhena",
    name: "Base Central & Matriz Vilhena",
    city: "Vilhena",
    state: "RO",
    type: "Matriz & Hub Logístico",
    address: "Av. Itaúba, 12707, Setor Industrial S-11, Vilhena - RO",
    phones: ["(69) 3321-3942", "(69) 3322-1589", "(69) 3322-1377", "(69) 3322-1567"],
    whatsappNumber: "5569999952942",
    whatsappDisplay: "(69) 99995-2942",
    coverage: "Cone Sul de Rondônia e Noroeste do Mato Grosso",
    highlights: ["Armazenamento de grande porte", "Frota de caminhões pesados e tocos para lavoura", "Plantão 24h na safra"],
    coordinates: {
      lat: -12.791039,
      lng: -60.087482,
    },
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-12.791039,-60.087482",
    wazeUrl: "https://www.waze.com/ul?ll=-12.791039,-60.087482&navigate=yes",
    embedUrl: "https://maps.google.com/maps?q=-12.79103946685791,-60.08748245239258&hl=pt-BR&z=16&output=embed",
  },
  {
    id: "comodoro",
    name: "Base Operacional Comodoro",
    city: "Comodoro",
    state: "MT",
    type: "Base de Apoio Regional",
    address: "Base Estratégica BR-174 / Rodovias Regionais, Comodoro - MT",
    phones: ["(65) 3283-1655", "(65) 3283-2658"],
    whatsappNumber: "5565996135844",
    whatsappDisplay: "(65) 99613-5844",
    coverage: "Vale do Guaporé, Chapada dos Parecis e Eixo da BR-174",
    highlights: ["Abastecimento expresso para frotas", "Rápido atendimento ao agro local", "Pátio logístico próprio"],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=TRR+Krupinski+Comodoro+MT",
    wazeUrl: "https://www.waze.com/ul?q=TRR+Krupinski+Comodoro+MT&navigate=yes",
    embedUrl: "https://maps.google.com/maps?q=Comodoro+MT&hl=pt-BR&z=14&output=embed",
  },
  {
    id: "campo-novo",
    name: "Base Campo Novo do Parecis",
    city: "Campo Novo do Parecis",
    state: "MT",
    type: "Base Agrícola Estratégica",
    address: "Polo Logístico de Abastecimento, Campo Novo do Parecis - MT",
    phones: ["(65) 3382-1771"],
    whatsappNumber: "556533821771",
    whatsappDisplay: "(65) 3382-1771",
    coverage: "Coração produtor de grãos (Soja, Milho, Algodão, Girassol)",
    highlights: ["Foco em grandes lavouras", "Instalação de tanques aéreos em fazendas", "Abastecimento in loco de colheitadeiras"],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Campo+Novo+do+Parecis+MT+TRR+Krupinski",
    wazeUrl: "https://www.waze.com/ul?q=Campo+Novo+do+Parecis+MT&navigate=yes",
    embedUrl: "https://maps.google.com/maps?q=Campo+Novo+do+Parecis+MT&hl=pt-BR&z=14&output=embed",
  },
  {
    id: "aripuana",
    name: "Base & Postos Aripuanã",
    city: "Aripuanã",
    state: "MT",
    type: "Base & Rede de Postos",
    address: "Região Central & Postos Irmãos Krupinski, Aripuanã - MT",
    phones: ["(66) 3565-2580", "(66) 3565-1181", "(66) 3565-1448"],
    whatsappNumber: "556635652580",
    whatsappDisplay: "(66) 3565-2580",
    coverage: "Norte de Mato Grosso, Setores de Mineração, Madeira e Pecuária",
    highlights: ["Apoio à mineração e obras pesadas", "Rede de postos de suporte rodoviário", "Logística para rotas remotas"],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Postos+Irmaos+Krupinski+Aripuana+MT",
    wazeUrl: "https://www.waze.com/ul?q=Aripuana+MT&navigate=yes",
    embedUrl: "https://maps.google.com/maps?q=Aripuana+MT&hl=pt-BR&z=14&output=embed",
  }
];

export const PRODUCTS_SERVICES: ProductService[] = [
  {
    id: "diesel-s10",
    title: "Óleo Diesel S-10",
    tagline: "Máxima pureza para maquinários modernos Euro 5 e Euro 6",
    description: "Combustível com apenas 10 partes por milhão de enxofre. Garante vida útil prolongada do sistema de injeção Common Rail, filtros limpos e potência integral para tratores, colheitadeiras e caminhões pesados.",
    features: [
      "Filtração de alta precisão no carregamento e descarga",
      "Proteção anti-borra e prevenção de condensação d'água",
      "Teste de densidade e laudo de conformidade em cada entrega"
    ],
    idealFor: "Tratores de última geração, colheitadeiras e caminhões novos.",
    badge: "Mais Vendido no Agro"
  },
  {
    id: "diesel-s500",
    title: "Óleo Diesel S-500",
    tagline: "Robustez e rendimento para motores industriais e frotas",
    description: "Formulação ideal para maquinários convencionais, motores estacionários, pás-carregadeiras e grupos geradores que exigem lubrificação natural das peças de injeção sob trabalho pesado contínuo.",
    features: [
      "Alto poder calorífico e economia de combustível",
      "Entrega fracionada no ponto exato de consumo",
      "Armazenamento seguro em tanques dedicados"
    ],
    idealFor: "Frotas tradicionais, geradores, caldeiras e obras pesadas.",
  },
  {
    id: "abastecimento-lavoura",
    title: "Abastecimento Direto na Lavoura",
    tagline: "Combustível entregue pontualmente nas frentes de colheita e propriedades",
    description: "Caminhões dedicados e preparados para estradas rurais com sistemas de descarga e medição eletrônica para abastecer tratores, colheitadeiras e caminhões direto no ponto de operação.",
    features: [
      "Medição eletrônica aferida com laudo",
      "Agilidade no campo para sua colheita não parar",
      "Atendimento contínuo e programado durante a safra"
    ],
    idealFor: "Produtores rurais com safra ativa e frotistas em operação de campo.",
    badge: "Agilidade na Safra"
  },
  {
    id: "lubrificantes",
    title: "Lubrificantes & Arla 32",
    tagline: "Proteção mecânica avançada e controle de emissões",
    description: "Linha completa de óleos lubrificantes minerais e sintéticos para motores diesel pesados, caixas de câmbio, sistemas hidráulicos e graxas para rolamentos, além de Arla 32 certificado pelo Inmetro.",
    features: [
      "Óleos 15W40, 10W40, fluidos hidráulicos ISO 68",
      "Arla 32 a granel, bombonas e IBCs de 1.000L",
      "Suporte técnico para estender o intervalo de troca"
    ],
    idealFor: "Manutenção preventiva de frotas e oficinas agrícolas."
  },
  {
    id: "transporte-perigosos",
    title: "Transporte Rodoviário Dedicado",
    tagline: "Logística especializada em produtos perigosos com registro ANTT",
    description: "Transporte rodoviário de cargas perigosas com frota própria e moderna, sistema de rastreamento 24h via satélite, telemetria de velocidade e motoristas certificados com treinamento MOPP.",
    features: [
      "Registro ANTT RNTRC 001952720 ativo",
      "Caminhões equipados com kit de emergência e MTR ambiental",
      "Acesso garantido mesmo em estradas vicinais de terra na safra"
    ],
    idealFor: "Grandes volumes industriais e remessas intermunicipais."
  }
];

export const COMPANY_METRICS = [
  { value: "+30", label: "Anos de Tradição", subtext: "Fundada em 1995 com sede própria" },
  { value: "4", label: "Bases Operacionais", subtext: "Vilhena, Comodoro, Campo Novo e Aripuanã" },
  { value: "100%", label: "Pontualidade na Safra", subtext: "Histórico de confiança no Agro e Logística" },
  { value: "100%", label: "Conforme ANP & ANTT", subtext: "Frota rastreada e combustível testado" },
];
