import { CompanyInfo, OperationalBase, ProductService } from './companyData';

/**
 * DADOS DE FALLBACK (PLANO DE CONTINGÊNCIA)
 * ATENÇÃO: Estes dados são utilizados SOMENTE e SOMENTE QUANDO a query para a API não retornar nada
 * (ex: falha de conexão com o banco ou backend inacessível).
 * Em condições normais, todos os dados são carregados dinamicamente via API REST do MongoDB.
 */

export const FALLBACK_COMPANY_INFO: CompanyInfo = {
  name: 'TRR Krupinski',
  fullName: 'Comércio e Transporte de Combustíveis Krupinski Ltda',
  foundedYear: 1995,
  yearsOfExperience: 31,
  anttRegister: 'RNTRC 001952720',
  anpCompliant: true,
  matrizAddress: 'Avenida Itaúba, 12707, Lote 06, Q-02 - Setor Industrial S-11, Vilhena - RO, CEP: 76987-760',
  coordinates: {
    lat: -12.791039,
    lng: -60.087482,
  },
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-12.791039,-60.087482',
  googleMapsRouteUrl: 'https://www.google.com/maps/dir/?api=1&destination=-12.791039,-60.087482',
  wazeUrl: 'https://www.waze.com/ul?ll=-12.791039,-60.087482&navigate=yes',
  googleMapsEmbed: 'https://maps.google.com/maps?q=-12.79103946685791,-60.08748245239258&hl=pt-BR&z=16&output=embed',
  mainPhone: '(69) 3322-1589',
  mainEmergencyPhone: '(69) 9995-2942',
  mainWhatsApp: '5569999952942',
  email: 'contato@trrkrupinski.com.br',
  hours: 'Segunda a Sexta: 07h às 18h | Sábado: 07h às 12h (Plantão na Safra)',
};

export const FALLBACK_HERO = {
  badge: '30+ Anos de Tradição e Excelência',
  headline: 'Combustível no Seu Tanque, Onde Sua Operação Estiver',
  subheadline: 'Mais de 30 anos abastecendo a safra e as frotas de Rondônia e Mato Grosso com qualidade certificada ANP e pontualidade máxima.',
  imageUrl: '/images/frota1.jpeg',
};

export const FALLBACK_ABOUT = {
  headline: 'Mais de 30 anos dedicados ao abastecimento de Rondônia e Mato Grosso',
  text1: 'Fundada em março de 1995, a TRR KRUPINSKI é uma empresa de revenda de combustíveis e lubrificantes que atua com excelência também no transporte de produtos perigosos rodoviários.',
  text2: 'Com matriz em Vilhena (RO) e bases operacionais em pontos estratégicos do Mato Grosso, fornecemos diesel de alta pureza diretamente no tanque da sua propriedade ou empresa, garantindo que sua safra e sua frota nunca fiquem paradas.',
  years: 30,
  bases: 4,
  punctuality: 100,
  compliance: 100,
  imageUrl: '/images/agro-harvest.jpg',
};

export const FALLBACK_SERVICES = {
  badge: 'O Que Oferecemos',
  title: 'Produtos e Soluções para Sua Operação',
  subtitle: 'Do fornecimento diário de diesel ao abastecimento direto em maquinários na lavoura.',
  items: [
    {
      id: 'diesel',
      iconName: 'Fuel',
      title: 'Óleo Diesel S-10 e S-500',
      description: 'Fornecimento a granel com laudo de pureza e densidade. Combustível filtrado para máxima performance e proteção de motores agrícolas e rodoviários.',
      details: [
        'Óleo Diesel S-10 (Ultrabaixo teor de enxofre)',
        'Óleo Diesel S-500 para frotas pesadas',
        'Entrega direta no seu ponto de consumo',
      ],
    },
    {
      id: 'abastecimento',
      iconName: 'Truck',
      title: 'Abastecimento Direto na Lavoura',
      description: 'Caminhões equipados com bombas abastecedoras digitais calibradas para abastecer tratores, colheitadeiras e frotas direto na frente de colheita.',
      details: [
        'Descarga rápida com medição certificada',
        'Atendimento no campo sem paralisar a safra',
        'Flexibilidade de horários e plantão contínuo',
      ],
    },
    {
      id: 'lubrificantes',
      iconName: 'Droplets',
      title: 'Lubrificantes & Arla 32',
      description: 'Linha completa de óleos lubrificantes minerais e sintéticos para transmissões, motores pesados, sistemas hidráulicos e graxas para rolamentos.',
      details: [
        'Óleos de alta performance multiviscosos',
        'Fluidos hidráulicos e graxas especiais',
        'Arla 32 certificado pelo Inmetro',
      ],
    },
    {
      id: 'transporte',
      iconName: 'ShieldCheck',
      title: 'Transporte Rodoviário Perigoso',
      description: 'Logística especializada no transporte rodoviário de cargas perigosas com registro ativo na ANTT (RNTRC 001952720) e motoristas capacitados (MOPP).',
      details: [
        'Frota própria com rastreamento 24h via satélite',
        'Caminhões adequados para acessos rurais e vicinais',
        'Atendimento em todo Rondônia e Mato Grosso',
      ],
    },
  ],
};

export const FALLBACK_BASES: OperationalBase[] = [
  {
    id: 'vilhena',
    name: 'Base Central & Matriz Vilhena',
    city: 'Vilhena',
    state: 'RO',
    type: 'Matriz & Hub Logístico',
    address: 'Av. Itaúba, 12707, Setor Industrial S-11, Vilhena - RO',
    phones: ['(69) 3321-3942', '(69) 3322-1589', '(69) 3322-1377', '(69) 3322-1567'],
    whatsappNumber: '5569999952942',
    whatsappDisplay: '(69) 99995-2942',
    coverage: 'Cone Sul de Rondônia e Noroeste do Mato Grosso',
    highlights: ['Armazenamento de grande porte', 'Frota de caminhões pesados e tocos para lavoura', 'Plantão 24h na safra'],
    coordinates: {
      lat: -12.791039,
      lng: -60.087482,
    },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-12.791039,-60.087482',
    wazeUrl: 'https://www.waze.com/ul?ll=-12.791039,-60.087482&navigate=yes',
    embedUrl: 'https://maps.google.com/maps?q=-12.79103946685791,-60.08748245239258&hl=pt-BR&z=16&output=embed',
  },
  {
    id: 'comodoro',
    name: 'Base Operacional Comodoro',
    city: 'Comodoro',
    state: 'MT',
    type: 'Base de Apoio Regional',
    address: 'Base Estratégica BR-174 / Rodovias Regionais, Comodoro - MT',
    phones: ['(65) 3283-1655', '(65) 3283-2658'],
    whatsappNumber: '5565996135844',
    whatsappDisplay: '(65) 99613-5844',
    coverage: 'Vale do Guaporé, Chapada dos Parecis e Eixo da BR-174',
    highlights: ['Abastecimento expresso para frotas', 'Rápido atendimento ao agro local', 'Pátio logístico próprio'],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=TRR+Krupinski+Comodoro+MT',
    wazeUrl: 'https://www.waze.com/ul?q=TRR+Krupinski+Comodoro+MT&navigate=yes',
    embedUrl: 'https://maps.google.com/maps?q=Comodoro+MT&hl=pt-BR&z=14&output=embed',
  },
  {
    id: 'campo-novo',
    name: 'Base Campo Novo do Parecis',
    city: 'Campo Novo do Parecis',
    state: 'MT',
    type: 'Base Agrícola Estratégica',
    address: 'Polo Logístico de Abastecimento, Campo Novo do Parecis - MT',
    phones: ['(65) 3382-1771'],
    whatsappNumber: '556533821771',
    whatsappDisplay: '(65) 3382-1771',
    coverage: 'Coração produtor de grãos (Soja, Milho, Algodão, Girassol)',
    highlights: ['Foco em grandes lavouras', 'Instalação de tanques aéreos em fazendas', 'Abastecimento in loco de colheitadeiras'],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Campo+Novo+do+Parecis+MT+TRR+Krupinski',
    wazeUrl: 'https://www.waze.com/ul?q=Campo+Novo+do+Parecis+MT&navigate=yes',
    embedUrl: 'https://maps.google.com/maps?q=Campo+Novo+do+Parecis+MT&hl=pt-BR&z=14&output=embed',
  },
  {
    id: 'aripuana',
    name: 'Base & Postos Aripuanã',
    city: 'Aripuanã',
    state: 'MT',
    type: 'Base & Rede de Postos',
    address: 'Região Central & Postos Irmãos Krupinski, Aripuanã - MT',
    phones: ['(66) 3565-2580', '(66) 3565-1181', '(66) 3565-1448'],
    whatsappNumber: '556635652580',
    whatsappDisplay: '(66) 3565-2580',
    coverage: 'Norte de Mato Grosso, Setores de Mineração, Madeira e Pecuária',
    highlights: ['Apoio à mineração e obras pesadas', 'Rede de postos de suporte rodoviário', 'Logística para rotas remotas'],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Postos+Irmaos+Krupinski+Aripuana+MT',
    wazeUrl: 'https://www.waze.com/ul?q=Aripuana+MT&navigate=yes',
    embedUrl: 'https://maps.google.com/maps?q=Aripuana+MT&hl=pt-BR&z=14&output=embed',
  },
];

export const FALLBACK_CONTACT = {
  badge: 'Atendimento',
  title: 'Entre em Contato com a TRR Krupinski',
  subtitle: 'Nossa equipe está pronta para atender seu pedido com rapidez e eficiência.',
  phone: '(69) 3322-1589',
  whatsapp: '5569999952942',
  email: 'contato@trrkrupinski.com.br',
  hours: 'Segunda a Sexta: 07h às 18h | Sábado: 07h às 12h (Plantão na Safra)',
};

export const FALLBACK_BANNERS = [
  {
    _id: 'default-banner-1',
    title: 'TRR KRUPINSKI',
    description: 'Entregando qualidade há mais de 30 anos',
    imageUrl: '/images/banner1.jpg',
    order: 1,
    active: true,
    linkUrl: '#sobre',
    linkText: 'Conheça Nossa História',
  },
  {
    _id: 'default-banner-2',
    title: 'Plantão Safra 2026',
    description: 'Abastecimento direto na lavoura com diesel certificado e pontualidade máxima',
    imageUrl: '/images/agro-harvest.jpg',
    order: 2,
    active: true,
    linkUrl: 'https://wa.me/5569999952942',
    linkText: 'Fale com o Plantão',
  },
  {
    _id: 'default-banner-3',
    title: 'Frota Própria e Calibrada',
    description: 'Transporte e entrega com máxima precisão e segurança para sua propriedade',
    imageUrl: '/images/banner2.jpg',
    order: 3,
    active: true,
    linkUrl: '#frota',
    linkText: 'Ver Nossa Frota',
  },
];

export const FALLBACK_NOTICES = [
  {
    _id: 'fallback-notice-1',
    title: 'Plantão Safra 2026 Ativo: Abastecimento Direto na Lavoura',
    description: 'Estrutura operacional e caminhões tanques dedicados para abastecer colheitadeiras e frotas agrícolas in loco 24 horas em Vilhena, Comodoro, Campo Novo do Parecis e Aripuanã.',
    imageUrl: '/images/agro-harvest.jpg',
    active: true,
    linkUrl: 'https://wa.me/5569999952942?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20abastecimento%20de%20safra.',
    linkText: 'Solicitar Abastecimento',
  },
  {
    _id: 'fallback-notice-2',
    title: 'Entregas Programadas de Óleo Diesel S-10 e S-500',
    description: 'Fornecimento contínuo de combustível com medição digital certificada pelo Inmetro e laudo de pureza a cada descarregamento na sua propriedade rural.',
    imageUrl: '/images/banner2.jpg',
    active: true,
    linkUrl: '#produtos',
    linkText: 'Conhecer Produtos',
  },
  {
    _id: 'fallback-notice-3',
    title: 'Frota Própria e Logística 24 Horas na Safra',
    description: 'Caminhões tanques equipados com bombas abastecedoras digitais para levar óleo diesel até a frente de colheita sem paralisação das máquinas.',
    imageUrl: '/images/banner1.jpg',
    active: true,
    linkUrl: '#frota',
    linkText: 'Ver Frota',
  },
];

export const FALLBACK_FLEET_ITEMS = [
  {
    id: 1,
    src: '/images/frota1.jpeg',
    title: 'Caminhão Tanque com Medição Digital',
    subtitle: 'Equipado com carretel de alta vazão e bomba calibrada para abastecimento seguro.',
  },
  {
    id: 2,
    src: '/images/frota2.jpeg',
    title: 'Caminhão Toco para Estradas Vicinais',
    subtitle: 'Agilidade de acesso e versatilidade em qualquer terreno ou propriedade rural.',
  },
  {
    id: 3,
    src: '/images/frota3.jpeg',
    title: 'Frota Pesada Bitrem',
    subtitle: 'Grande capacidade para suprimento contínuo de polos agrícolas e industriais.',
  },
  {
    id: 4,
    src: '/images/frota4.jpeg',
    title: 'Transporte Rodoviário Perigoso Certificado',
    subtitle: 'Motoristas capacitados (MOPP) e conformidade integral com normas da ANTT e ANP.',
  },
  {
    id: 5,
    src: '/images/frota5.jpeg',
    title: 'Abastecimento Direto na Frente de Colheita',
    subtitle: 'Atendimento pontual sem interrupção do ritmo das colheitadeiras e tratores.',
  },
  {
    id: 6,
    src: '/images/frota6.jpeg',
    title: 'Caminhão Tanque em Operação na Lavoura',
    subtitle: 'Estrutura robusta para suportar estradas de terra e rotas remotas do Centro-Oeste e Norte.',
  },
  {
    id: 7,
    src: '/images/frota7.jpeg',
    title: 'Entrega Programada de Diesel S-10 e S-500',
    subtitle: 'Laudo de pureza e densidade a cada descarregamento na propriedade.',
  },
  {
    id: 8,
    src: '/images/frota8.jpeg',
    title: 'Descarga Rápida com Bocal Hermético',
    subtitle: 'Sistemas antivazamento e total segurança operacional para o meio ambiente.',
  },
  {
    id: 9,
    src: '/images/frota9.jpeg',
    title: 'Logística Ágil para Safra e Entressafra',
    subtitle: 'Distribuição contínua com autonomia garantida para grandes plantios.',
  },
  {
    id: 10,
    src: '/images/frota10.jpeg',
    title: 'Monitoramento e Rastreamento 24h via Satélite',
    subtitle: 'Segurança da carga em tempo real da base emissora até o ponto de consumo.',
  },
  {
    id: 11,
    src: '/images/frota11.jpeg',
    title: 'Caminhão de Suporte para Frotas Agrícolas',
    subtitle: 'Flexibilidade e capacidade de abastecer múltiplos veículos simultaneamente.',
  },
  {
    id: 12,
    src: '/images/frota12.jpeg',
    title: 'Tanque Inox e Filtros Coalescentes',
    subtitle: 'Garantia de combustível limpo, sem água emulsionada ou impurezas no motor.',
  },
  {
    id: 13,
    src: '/images/frota13.jpeg',
    title: 'Atendimento Especializado a Fazendas e Mineradoras',
    subtitle: 'Suprimento sob demanda para operações que não podem parar.',
  },
  {
    id: 14,
    src: '/images/frota14.jpeg',
    title: 'Manutenção Preventiva Rigorosa',
    subtitle: 'Veículos inspecionados periodicamente para garantir zero falhas em trânsito.',
  },
  {
    id: 15,
    src: '/images/frota15.jpeg',
    title: 'Prontidão Operacional em Vilhena e Mato Grosso',
    subtitle: 'Mais de 30 anos transportando energia e confiança pelo agronegócio brasileiro.',
  },
];
