import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { connectDB, closeDB } from '../config/db.js';

describe('Validação de Rotas da API (Supertest + Vitest)', () => {
  let adminCookie: string[] = [];

  beforeAll(async () => {
    // Garante a conexão com o banco de dados antes de iniciar os testes
    await connectDB();
  });

  afterAll(async () => {
    // Fecha a conexão com o banco após a conclusão de todos os testes
    await closeDB();
  });

  describe('1. Rota de Healthcheck', () => {
    it('GET /api/health deve responder 200 com status "ok"', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'TRR Krupinski API');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('2. Rotas Públicas da API (Leitura)', () => {
    it('GET /api/fleet deve retornar 200 com array de veículos', async () => {
      const response = await request(app).get('/api/fleet');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /api/bases deve retornar 200 com array de bases operacionais', async () => {
      const response = await request(app).get('/api/bases');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /api/banners deve retornar 200 com array de banners ativos', async () => {
      const response = await request(app).get('/api/banners');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /api/commodities deve retornar 200 com cotações de mercado e dólar', async () => {
      const response = await request(app).get('/api/commodities');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('items');
      expect(Array.isArray(response.body.data.items)).toBe(true);
      expect(response.body.data).toHaveProperty('isAvailable');
    });

    it('GET /api/notices/active deve retornar 200 com comunicados ativos', async () => {
      const response = await request(app).get('/api/notices/active');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /api/content deve retornar 200 com os conteúdos cadastrados do site', async () => {
      const response = await request(app).get('/api/content');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('GET /api/content/:key deve retornar 404 quando o conteúdo específico ainda não foi cadastrado', async () => {
      const response = await request(app).get('/api/content/chave_inexistente');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        error: 'Conteúdo não encontrado',
      });
    });
  });

  describe('3. Autenticação Better Auth', () => {
    it('POST /api/auth/sign-in/email com credenciais inválidas deve falhar', async () => {
      const response = await request(app)
        .post('/api/auth/sign-in/email')
        .set('Origin', 'http://localhost:3000')
        .send({
          email: 'admin@trrkrupinski.com.br',
          password: 'senha_errada_invalida',
        });

      expect([400, 401, 403]).toContain(response.status);
    });

    it('POST /api/auth/sign-in/email com credenciais válidas do admin deve retornar 200 e cookies de sessão', async () => {
      const response = await request(app)
        .post('/api/auth/sign-in/email')
        .set('Origin', 'http://localhost:3000')
        .send({
          email: 'admin@trrkrupinski.com.br',
          password: 'admin123456',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'admin@trrkrupinski.com.br');
      expect(response.body.user).toHaveProperty('role', 'admin');

      // Salva o cookie de sessão para os testes autenticados
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        adminCookie = Array.isArray(cookies) ? cookies : [cookies];
      }
    });
  });

  describe('4. Proteção de Rotas Administrativas sem Autenticação', () => {
    it('GET /api/admin/banners sem autenticação deve retornar 401 Unauthorized', async () => {
      const response = await request(app).get('/api/admin/banners');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('POST /api/admin/fleet sem autenticação deve retornar 401 Unauthorized', async () => {
      const response = await request(app)
        .post('/api/admin/fleet')
        .send({ title: 'Caminhão Teste' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('POST /api/admin/banners sem autenticação deve retornar 401 Unauthorized', async () => {
      const response = await request(app)
        .post('/api/admin/banners')
        .send({ title: 'Banner Teste' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('DELETE /api/admin/bases/:id sem autenticação deve retornar 401 Unauthorized', async () => {
      const response = await request(app).delete('/api/admin/bases/1');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('5. Testes de Criação (POST) Autorizados com Sucesso', () => {
    it('POST /api/admin/banners com dados válidos deve criar o banner (201 Created)', async () => {
      const newBanner = {
        title: 'Banner Vitest Teste Automatizado',
        description: 'Banner criado exclusivamente para validação de rota POST',
        imageUrl: '/images/banner1.jpg',
        order: 99,
        active: true,
        linkUrl: '#sobre',
        linkText: 'Conheça Mais',
      };

      const response = await request(app)
        .post('/api/admin/banners')
        .set('Cookie', adminCookie)
        .send(newBanner);

      const createdId = response.body?.data?.id || response.body?.data?._id;

      try {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('title', newBanner.title);
        expect(response.body.data).toHaveProperty('imageUrl', newBanner.imageUrl);
        expect(createdId).toBeTruthy();
      } finally {
        if (createdId) {
          await request(app)
            .delete(`/api/admin/banners/${createdId}`)
            .set('Cookie', adminCookie);
        }
      }
    });

    it('POST /api/admin/fleet com dados válidos deve cadastrar o veículo na frota (201 Created)', async () => {
      const newTruck = {
        title: 'Caminhão Scania Teste Vitest',
        description: 'Veículo pesado para entrega agrícola',
        imageUrl: '/images/frota1.jpeg',
        order: 50,
        active: true,
        category: 'carrossel',
      };

      const response = await request(app)
        .post('/api/admin/fleet')
        .set('Cookie', adminCookie)
        .send(newTruck);

      const createdId = response.body?.data?.id || response.body?.data?._id;

      try {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('title', newTruck.title);
        expect(response.body.data).toHaveProperty('category', newTruck.category);
        expect(createdId).toBeTruthy();
      } finally {
        if (createdId) {
          await request(app)
            .delete(`/api/admin/fleet/${createdId}`)
            .set('Cookie', adminCookie);
        }
      }
    });

    it('POST /api/admin/notices com dados válidos deve cadastrar um aviso (201 Created)', async () => {
      const newNotice = {
        title: 'Aviso Teste Automatizado Vitest',
        description: 'Plantão de atendimento para a safra de soja',
        active: true,
        type: 'alert',
        priority: 5,
        imageUrl: '/images/agro-harvest.jpg',
      };

      const response = await request(app)
        .post('/api/admin/notices')
        .set('Cookie', adminCookie)
        .send(newNotice);

      const createdId = response.body?.data?.id || response.body?.data?._id;

      try {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('title', newNotice.title);
        expect(createdId).toBeTruthy();
      } finally {
        if (createdId) {
          await request(app)
            .delete(`/api/admin/notices/${createdId}`)
            .set('Cookie', adminCookie);
        }
      }
    });

    it('POST /api/admin/bases com dados válidos deve cadastrar uma base operacional (201 Created)', async () => {
      const newBase = {
        name: 'Base Operacional Vitest',
        city: `Cacoal Teste ${Date.now()}`,
        state: 'RO',
        address: 'Rodovia BR-364, KM 205',
        whatsappNumber: '5569999999999',
        active: true,
      };

      const response = await request(app)
        .post('/api/admin/bases')
        .set('Cookie', adminCookie)
        .send(newBase);

      const createdId = response.body?.data?.id || response.body?.data?._id;

      try {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('name', newBase.name);
        expect(response.body.data).toHaveProperty('city', newBase.city);
        expect(createdId).toBeTruthy();
      } finally {
        if (createdId) {
          await request(app)
            .delete(`/api/admin/bases/${createdId}`)
            .set('Cookie', adminCookie);
        }
      }
    });

    it('POST /api/admin/fleet com payload inválido deve retornar 400 Bad Request', async () => {
      const invalidTruck = {}; // Falta title e imageUrl

      const response = await request(app)
        .post('/api/admin/fleet')
        .set('Cookie', adminCookie)
        .send(invalidTruck);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('POST /api/admin/banners com payload inválido deve retornar 400 Bad Request', async () => {
      const invalidBanner = {}; // Falta title e imageUrl

      const response = await request(app)
        .post('/api/admin/banners')
        .set('Cookie', adminCookie)
        .send(invalidBanner);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('6. Tratamento de Rotas Inexistentes (404)', () => {
    it('GET /api/rota-inexistente deve retornar 404 com mensagem de erro padronizada', async () => {
      const response = await request(app).get('/api/rota-inexistente');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        error: 'Rota não encontrada',
      });
    });
  });
});
