import { connectDB, closeDB } from '../config/db.js';
import { initAuth } from '../auth/better-auth.js';
import { ENV } from '../config/env.js';
import { NoticeRepository } from '../repositories/notice.repository.js';
import { FleetRepository } from '../repositories/fleet.repository.js';
import { ContentRepository } from '../repositories/content.repository.js';
import { BannerRepository } from '../repositories/banner.repository.js';
import { BaseRepository } from '../repositories/base.repository.js';

// Links do Google Drive fornecidos pelo usuário
const imagensFrotaLinks = [
  'https://drive.google.com/file/d/1jTnUeXOdhlGdrZq1u3QAAdeT6ZOSW8Mf/preview',
  'https://drive.google.com/file/d/1jTnUeXOdhlGdrZq1u3QAAdeT6ZOSW8Mf/preview',
  'https://drive.google.com/file/d/1vYMjc6_MGpQO14mVFSnm8ta7OTBR17z3/preview',
  'https://drive.google.com/file/d/1TYYR_bndJB3m0w3_nRjTUYiOolSRwXvM/preview',
  'https://drive.google.com/file/d/1HqLtrVBCXkF99QhRKihqSGowIvSlZ76D/preview',
  'https://drive.google.com/file/d/1mlUTKu7192g77ydkPtZToPsk2GawP-ga/preview',
  'https://drive.google.com/file/d/1epCXur-1EWqmD7M3m2rWDGVwN3S4yGoE/preview',
  'https://drive.google.com/file/d/1zGaMXm1V7I7E_kWOr7pBaf1XaU0W9lFZ/preview',
  'https://drive.google.com/file/d/1A_R5cnVgCJxHGMY0Yz5-AeAZO0ho028O/preview',
  'https://drive.google.com/file/d/1op2f7beMCNVBnwqfSUDGMgJAd-Y1OOVz/preview',
  'https://drive.google.com/file/d/1gE3IzAT1Ku8cbK8nMJK3pJf5HDLG7dDX/preview',
  'https://drive.google.com/file/d/13vImScBkY9-trCsPR_54eJUJBi8E6CtX/preview',
  'https://drive.google.com/file/d/1z1dWNobVQfwbhHABq0L1KY7i_5TM-M57/preview',
  'https://drive.google.com/file/d/1HSoar8Sw1BaH5NUi7GBBF3_5riPtnR_p/preview',
  'https://drive.google.com/file/d/1mFYzk8iAJw-eR-7awQ6ex8rgr0MXCYQP/preview',
];

const imagensBannerLinks = [
  'https://drive.google.com/file/d/13SXX2wMZFlX74fI_ZyvYjdHIYaEWBnUX/preview',
  'https://drive.google.com/file/d/12ZDr_Gses1aVdWGgQuJiCeymfdIMyWqW/preview',
  'https://drive.google.com/file/d/1BAZXVtzGpXeSfUSAX9yemSbTieDVhrdB/preview',
];

// server/src/scripts/seed.ts



function formatGoogleDriveUrl(url: string): string {
  if (!url) return '';
  
  // Captura o ID do link /file/d/ID/... ou ?id=ID
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  
  if (match && match[1]) {
    // Usando o endpoint thumbnail direto do Google com resolução alta:
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600`;
  }
  
  return url;
}

async function seed() {
  try {
    console.log('[Seed] Conectando ao MongoDB...');
    const db = await connectDB();
    const auth = initAuth(db);
    if (!auth) {
      throw new Error('Falha ao inicializar Better Auth no seed');
    }

    const adminEmail = 'admin@trrkrupinski.com.br';
    const adminPassword = 'admin123456';

    console.log('[Seed] Verificando conta de administrador...');
    const usersCollection = db.collection('user');
    const existingAdmin = await usersCollection.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log(`[Seed] Criando administrador inicial: ${adminEmail}`);
      try {
        const adminUser = await auth.api.signUpEmail({
          body: {
            name: 'Administrador TRR Krupinski',
            email: adminEmail,
            password: adminPassword,
          },
        });

        if (adminUser?.user?.id) {
          await usersCollection.updateOne(
            { email: adminEmail },
            { $set: { role: 'admin' } }
          );
        }
        console.log('[Seed] Administrador criado com sucesso!');
      } catch (err: any) {
        console.log('[Seed] Nota sobre cadastro admin:', err?.message || err);
        await usersCollection.updateOne(
          { email: adminEmail },
          { $set: { role: 'admin' } },
          { upsert: false }
        );
      }
    } else {
      console.log('[Seed] Administrador já existente no banco. Garantindo role admin...');
      await usersCollection.updateOne(
        { email: adminEmail },
        { $set: { role: 'admin' } }
      );
    }

    // 0. Seed de Banners Principais do Topo (Carrossel)
    console.log('[Seed] Atualizando Banners Principais do Topo...');
    const bannerRepo = new BannerRepository();
    await db.collection('banners').deleteMany({});

    await bannerRepo.create({
      title: 'TRR KRUPINSKI',
      description: 'Entregando qualidade a mais de 30 anos',
      imageUrl: '/images/Gemini_Generated_Image_ywuiheywuiheywui.jpg',
      order: 1,
      active: true,
      linkUrl: '#sobre',
      linkText: 'Conheça Nossa História',
    });

    await bannerRepo.create({
      title: 'Plantão Safra 2026',
      description: 'Abastecimento direto na lavoura com diesel certificado e pontualidade',
      imageUrl: '/images/agro-harvest.jpg',
      order: 2,
      active: true,
      linkUrl: 'https://wa.me/5569999952942',
      linkText: 'Fale com o Plantão',
    });

    await bannerRepo.create({
      title: 'Frota Própria e Calibrada',
      description: 'Transporte e entrega com máxima precisão e segurança para sua propriedade',
      imageUrl: '/images/hero-truck.jpg',
      order: 3,
      active: true,
      linkUrl: '#frota',
      linkText: 'Ver Nossa Frota',
    });

    // 1. Seed de Avisos / Notícias
    console.log('[Seed] Atualizando Quadro de Avisos com imagens dos banners...');
    const noticeRepo = new NoticeRepository();
    await db.collection('notices').deleteMany({});

    await noticeRepo.create({
      title: 'Plantão Safra 2026 Ativo: Abastecimento Direto na Lavoura',
      description: 'Estrutura operacional e caminhões tanques dedicados para abastecer colheitadeiras e frotas agrícolas in loco 24 horas em Vilhena, Comodoro, Campo Novo do Parecis e Aripuanã.',
      imageUrl: formatGoogleDriveUrl(imagensBannerLinks[0]),
      active: true,
      linkUrl: 'https://wa.me/5569999952942?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20abastecimento%20de%20safra.',
      linkText: 'Solicitar Abastecimento',
    });

    await noticeRepo.create({
      title: 'Entregas Programadas de Óleo Diesel S-10 e S-500',
      description: 'Fornecimento contínuo de combustível com medição digital certificada pelo Inmetro e laudo de pureza a cada descarregamento na sua propriedade rural.',
      imageUrl: formatGoogleDriveUrl(imagensBannerLinks[1]),
      active: true,
      linkUrl: '#produtos',
      linkText: 'Conhecer Produtos',
    });

    // 2. Seed de Frota & Fotos das Seções
    console.log('[Seed] Atualizando Fotos da Frota e Seções com links do Drive...');
    const fleetRepo = new FleetRepository();
    await db.collection('fleet_items').deleteMany({});

    const defaultFleet = [
      {
        title: 'Caminhão Tanque em Destaque (Banner Hero)',
        description: 'Caminhão em operação exibido no banner inicial do site.',
        imageUrl: formatGoogleDriveUrl(imagensBannerLinks[2] || imagensFrotaLinks[0]),
        category: 'hero',
        order: 1,
        active: true,
      },
      {
        title: 'Abastecimento na Colheita da Safra',
        description: 'Foto em destaque na seção Sobre a Empresa.',
        imageUrl: formatGoogleDriveUrl(imagensBannerLinks[1] || imagensFrotaLinks[1]),
        category: 'sobre',
        order: 2,
        active: true,
      },
      ...imagensFrotaLinks.map((link, idx) => ({
        title: `Caminhão Tanque TRR Krupinski #${idx + 1}`,
        description: 'Frota própria equipada para transporte seguro e descarga calibrada em fazendas e rodovias.',
        imageUrl: formatGoogleDriveUrl(link),
        category: 'carrossel',
        order: idx + 3,
        active: true,
      })),
    ];

    for (const item of defaultFleet) {
      await fleetRepo.create(item);
    }

    // 3. Seed de Conteúdos Institucionais (Todos os textos do site)
    const contentRepo = new ContentRepository();
    console.log('[Seed] Inserindo todos os dados e textos institucionais via API...');

    // A. Informações Gerais da Empresa (Substitui companyData no front)
    await contentRepo.upsert('company_info', {
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
    });

    // B. Bases Operacionais
    const basesData = [
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

    await contentRepo.upsert('company_bases', basesData);

    const baseRepo = new BaseRepository();
    await db.collection('operational_bases').deleteMany({});
    for (let i = 0; i < basesData.length; i++) {
      await baseRepo.create({
        ...basesData[i],
        order: i + 1,
        active: true,
      });
    }

    // C. Seção Hero (Mantém estritamente Título, Descrição e Imagem)
    await contentRepo.upsert('company_hero', {
      headline: 'Combustível no Seu Tanque, Onde Sua Operação Estiver',
      subheadline: 'Mais de 30 anos abastecendo a safra e as frotas de Rondônia e Mato Grosso com qualidade certificada ANP e pontualidade máxima.',
      imageUrl: formatGoogleDriveUrl(imagensBannerLinks[2] || imagensFrotaLinks[0]),
    });

    // D. Seção Sobre
    await contentRepo.upsert('company_about', {
      headline: 'Mais de 30 anos dedicados ao abastecimento de Rondônia e Mato Grosso',
      text1: 'Fundada em março de 1995, a TRR KRUPINSKI é uma empresa de revenda de combustíveis e lubrificantes que atua com excelência também no transporte de produtos perigosos rodoviários.',
      text2: 'Com matriz em Vilhena (RO) e bases operacionais em pontos estratégicos do Mato Grosso, fornecemos diesel de alta pureza diretamente no tanque da sua propriedade ou empresa, garantindo que sua safra e sua frota nunca fiquem paradas.',
      years: 30,
      bases: 4,
      punctuality: 100,
      compliance: 100,
      imageUrl: formatGoogleDriveUrl(imagensBannerLinks[1] || imagensFrotaLinks[1]),
    });

    // E. Produtos & Serviços
    await contentRepo.upsert('company_services', {
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
    });

    // F. Contato
    await contentRepo.upsert('company_contact', {
      badge: 'Atendimento',
      title: 'Entre em Contato com a TRR Krupinski',
      subtitle: 'Nossa equipe está pronta para atender seu pedido com rapidez e eficiência.',
      phone: '(69) 3322-1589',
      whatsapp: '5569999952942',
      email: 'contato@trrkrupinski.com.br',
      hours: 'Segunda a Sexta: 07h às 18h | Sábado: 07h às 12h (Plantão na Safra)',
    });

    // G. Ordem das Seções
    await contentRepo.upsert('sections_order', [
      { id: 'hero', name: 'Seção Inicial (Hero)', description: 'Destaque com chamada principal e botões de contato', enabled: true, order: 1 },
      { id: 'notices', name: 'Quadro de Avisos & Notícias', description: 'Comunicados com fotos em destaque', enabled: true, order: 2 },
      { id: 'about', name: 'A Empresa & Métricas', description: 'História de 30 anos e contadores de tradição, bases e conformidade', enabled: true, order: 3 },
      { id: 'fleet', name: 'Nossa Frota', description: 'Carrossel moderno com fotos e links dos caminhões', enabled: true, order: 4 },
      { id: 'services', name: 'Produtos e Serviços', description: 'Diesel S-10, S-500, Lubrificantes, Arla 32 e Transporte', enabled: true, order: 5 },
      { id: 'bases', name: 'Bases Operacionais & Mapa', description: 'Localização no Google Maps de Vilhena, Comodoro, Parecis e Aripuanã', enabled: true, order: 6 },
      { id: 'contact', name: 'Contato & Atendimento', description: 'Formulário de cotação e canais diretos de WhatsApp', enabled: true, order: 7 },
    ]);

    console.log('[Seed] Todos os dados e links inseridos com sucesso no banco!');
  } catch (error) {
    console.error('[Seed] Erro ao executar seed:', error);
  } finally {
    await closeDB();
  }
}

seed();
