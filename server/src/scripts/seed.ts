import { connectDB, closeDB } from '../config/db.js';
import { initAuth } from '../auth/better-auth.js';
import { ENV } from '../config/env.js';
import { NoticeRepository } from '../repositories/notice.repository.js';
import { FleetRepository } from '../repositories/fleet.repository.js';
import { ContentRepository } from '../repositories/content.repository.js';

async function seed() {
  try {
    console.log('[Seed] Conectando ao MongoDB...');
    const db = await connectDB();
    const auth = initAuth(db);
    if (!auth) {
      throw new Error('Falha ao inicializar Better Auth no seed');
    }

    console.log('[Seed] Verificando conta de administrador...');
    const usersCollection = db.collection('user');
    const existingAdmin = await usersCollection.findOne({ email: ENV.ADMIN_EMAIL });

    if (!existingAdmin) {
      console.log(`[Seed] Criando administrador inicial: ${ENV.ADMIN_EMAIL}`);
      // Criação de usuário via API do Better Auth
      try {
        const adminUser = await auth.api.signUpEmail({
          body: {
            name: 'Administrador TRR Krupinski',
            email: ENV.ADMIN_EMAIL,
            password: ENV.ADMIN_PASSWORD,
          },
        });
        
        // Define o papel 'admin' no usuário
        if (adminUser?.user?.id) {
          await usersCollection.updateOne(
            { email: ENV.ADMIN_EMAIL },
            { $set: { role: 'admin' } }
          );
        }
        console.log('[Seed] Administrador criado com sucesso!');
      } catch (err: any) {
        console.log('[Seed] Nota sobre cadastro admin:', err?.message || err);
        // Fallback direto no banco caso signUpEmail requeira requisição
        await usersCollection.updateOne(
          { email: ENV.ADMIN_EMAIL },
          { $set: { role: 'admin' } },
          { upsert: false }
        );
      }
    } else {
      console.log('[Seed] Administrador já existente no banco. Garantindo role admin...');
      await usersCollection.updateOne(
        { email: ENV.ADMIN_EMAIL },
        { $set: { role: 'admin' } }
      );
    }

    // Seed de Avisos
    const noticeRepo = new NoticeRepository();
    const existingNotices = await noticeRepo.findAll();
    if (existingNotices.length === 0) {
      console.log('[Seed] Inserindo avisos iniciais...');
      await noticeRepo.create({
        title: 'Plantão Safra 2026 Ativo',
        message: 'Abastecimento in loco prioritário para colheitadeiras e frotas agrícolas em Vilhena, Comodoro, Campo Novo e Aripuanã.',
        type: 'alert',
        active: true,
        priority: 10,
        linkUrl: 'https://wa.me/556933221100?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20abastecimento%20de%20safra.',
        linkText: 'Chamar no WhatsApp',
      });

      await noticeRepo.create({
        title: 'Abastecimento Programado para a Safra',
        message: 'Entregas programadas de Diesel S-10 e S-500 diretamente na sua propriedade ou pátio com medição digital e pontualidade.',
        type: 'info',
        active: true,
        priority: 5,
        linkUrl: '#produtos',
        linkText: 'Conhecer Produtos',
      });
    }

    // Seed de Frota (Links das fotos já existentes)
    const fleetRepo = new FleetRepository();
    const existingFleet = await fleetRepo.findAll();
    if (existingFleet.length === 0) {
      console.log('[Seed] Inserindo fotos iniciais do site (guardando links)...');
      const defaultFleet = [
        {
          title: 'Caminhão Tanque em Destaque (Banner Hero)',
          description: 'Caminhão em operação exibido no banner inicial do site.',
          imageUrl: '/images/hero-truck.jpg',
          category: 'hero',
          order: 1,
          active: true,
        },
        {
          title: 'Abastecimento na Colheita da Safra',
          description: 'Foto em destaque na seção Sobre a Empresa.',
          imageUrl: '/images/agro-harvest.jpg',
          category: 'sobre',
          order: 1,
          active: true,
        },
        {
          title: 'Cavalo Mecânico & Tanque Inox de Alta Capacidade',
          description: 'Transporte rodoviário seguro para granel líquido e abastecimento direto em grandes frotas.',
          imageUrl: '/images/frota1.jpeg',
          category: 'carrossel',
          order: 1,
          active: true,
        },
        {
          title: 'Caminhão Tanque com Sistema de Descarga Digital',
          description: 'Abastecimento fracionado e pontual para maquinários agrícolas em campo aberto.',
          imageUrl: '/images/frota2.jpeg',
          category: 'carrossel',
          order: 2,
          active: true,
        },
        {
          title: 'Unidade de Abastecimento Pesado 8x2',
          description: 'Estrutura robusta homologada pelo INMETRO para estradas rurais e condições severas.',
          imageUrl: '/images/frota3.jpeg',
          category: 'carrossel',
          order: 3,
          active: true,
        },
        {
          title: 'Composição Bitrem para Grandes Demandas',
          description: 'Logística de alta performance para transporte contínuo de diesel S-10 e S-500.',
          imageUrl: '/images/frota4.jpeg',
          category: 'carrossel',
          order: 4,
          active: true,
        },
        {
          title: 'Caminhão Distribuidor TRR Urbano e Rural',
          description: 'Agilidade e pontualidade na entrega de combustível certificado nas propriedades.',
          imageUrl: '/images/frota5.jpeg',
          category: 'carrossel',
          order: 5,
          active: true,
        },
      ];

      for (const item of defaultFleet) {
        await fleetRepo.create(item);
      }
    }

    // Seed de Conteúdo
    const contentRepo = new ContentRepository();
    console.log('[Seed] Inserindo conteúdos institucionais...');
    await contentRepo.upsert('company_hero', {
      headline: 'Combustível no Seu Tanque, Onde Sua Operação Estiver',
      subheadline: 'Mais de 30 anos abastecendo a safra e as frotas de Rondônia e Mato Grosso com qualidade certificada ANP e pontualidade máxima.',
      badge: '30+ Anos de Tradição e Excelência',
    });

    await contentRepo.upsert('company_about', {
      headline: 'Mais de 30 anos dedicados ao abastecimento de Rondônia e Mato Grosso',
      text1: 'Fundada em março de 1995, a TRR KRUPINSKI é uma empresa de revenda de combustíveis e lubrificantes que atua com excelência também no transporte de produtos perigosos rodoviários.',
      text2: 'Com matriz em Vilhena (RO) e bases operacionais em pontos estratégicos do Mato Grosso, fornecemos diesel de alta pureza diretamente no tanque da sua propriedade ou empresa, garantindo que sua safra e sua frota nunca fiquem paradas.',
      metrics: [
        { label: 'Tradição', value: 30, prefix: '+', suffix: ' Anos', description: 'Fundada em 1995 com sede própria em Vilhena - RO' },
        { label: 'Estrutura', value: 4, prefix: '', suffix: ' Bases', description: 'Vilhena, Comodoro, Campo Novo do Parecis e Aripuanã' },
        { label: 'Pontualidade', value: 100, prefix: '', suffix: '%', description: 'Compromisso com abastecimento sem paralisações na safra' },
        { label: 'Conformidade', value: 100, prefix: '', suffix: '%', description: 'Normas ANP, ANTT e laudos de pureza a cada entrega' }
      ]
    });

    await contentRepo.upsert('company_services', [
      {
        id: 'diesel',
        iconName: 'Fuel',
        title: 'Óleo Diesel S-10 e S-500',
        description: 'Fornecimento a granel com laudo de pureza e densidade. Combustível filtrado para máxima performance e proteção de motores agrícolas e rodoviários.',
        details: [
          'Óleo Diesel S-10 (Ultrabaixo teor de enxofre)',
          'Óleo Diesel S-500 para frotas pesadas',
          'Entrega direta no seu ponto de consumo'
        ]
      },
      {
        id: 'abastecimento',
        iconName: 'Truck',
        title: 'Abastecimento Direto na Lavoura',
        description: 'Caminhões equipados com bombas abastecedoras digitais calibradas para abastecer tratores, colheitadeiras e frotas direto na frente de colheita.',
        details: [
          'Descarga rápida com medição certificada',
          'Atendimento no campo sem paralisar a safra',
          'Flexibilidade de horários e plantão contínuo'
        ]
      },
      {
        id: 'lubrificantes',
        iconName: 'Droplets',
        title: 'Lubrificantes & Arla 32',
        description: 'Linha completa de óleos lubrificantes minerais e sintéticos para transmissões, motores pesados, sistemas hidráulicos e graxas para rolamentos.',
        details: [
          'Óleos de alta performance multiviscosos',
          'Fluidos hidráulicos e graxas especiais',
          'Arla 32 certificado pelo Inmetro'
        ]
      },
      {
        id: 'transporte',
        iconName: 'ShieldCheck',
        title: 'Transporte Rodoviário Perigoso',
        description: 'Logística especializada no transporte rodoviário de cargas perigosas com registro ativo na ANTT (RNTRC 001952720) e motoristas capacitados (MOPP).',
        details: [
          'Frota própria com rastreamento 24h via satélite',
          'Caminhões adequados para acessos rurais e vicinais',
          'Atendimento em todo Rondônia e Mato Grosso'
        ]
      }
    ]);

    await contentRepo.upsert('sections_order', [
      { id: 'hero', name: 'Seção Inicial (Hero)', description: 'Destaque com chamada principal e botões de contato', enabled: true, order: 1 },
      { id: 'notices', name: 'Carrossel de Avisos & Plantão', description: 'Comunicados urgentes de safra e plantão 24h', enabled: true, order: 2 },
      { id: 'about', name: 'A Empresa & Métricas', description: 'História de 30 anos e contadores de tradição, bases e conformidade', enabled: true, order: 3 },
      { id: 'fleet', name: 'Nossa Frota', description: 'Carrossel moderno com fotos e links dos caminhões', enabled: true, order: 4 },
      { id: 'services', name: 'Produtos e Serviços', description: 'Diesel S-10, S-500, Lubrificantes, Arla 32 e Transporte', enabled: true, order: 5 },
      { id: 'bases', name: 'Bases Operacionais & Mapa', description: 'Localização no Google Maps de Vilhena, Comodoro, Parecis e Aripuanã', enabled: true, order: 6 },
      { id: 'contact', name: 'Contato & Atendimento', description: 'Formulário de cotação e canais diretos de WhatsApp', enabled: true, order: 7 }
    ]);

    console.log('[Seed] Dados iniciais inseridos com sucesso!');
  } catch (error) {
    console.error('[Seed] Erro ao executar seed:', error);
  } finally {
    await closeDB();
  }
}

seed();
