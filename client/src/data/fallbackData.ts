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
  imageUrl: '/images/hero-truck.jpg',
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
];

export const FALLBACK_FLEET_ITEMS = [
  {
    id: 1,
    src: '/images/hero-truck.jpg',
    title: 'Caminhão Tanque com Medição Digital',
    subtitle: 'Equipado com carretel de alta vazão e bomba calibrada para abastecimento seguro.',
  },
  {
    id: 2,
    src: '/images/agro-harvest.jpg',
    title: 'Abastecimento Direto na Lavoura',
    subtitle: 'Atendimento pontual sem interrupção do ritmo da colheita.',
  },
  {
    id: 3,
    src: '/images/frota1.jpeg',
    title: 'Frota Pesada Bitrem',
    subtitle: 'Grande capacidade para suprimento contínuo de polos industriais e fazendas.',
  },
  {
    id: 4,
    src: '/images/frota2.jpeg',
    title: 'Caminhão Toco para Estradas Vicinais',
    subtitle: 'Agilidade de acesso e versatilidade em qualquer terreno ou propriedade.',
  },
];
