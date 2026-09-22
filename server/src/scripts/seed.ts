import 'dotenv/config';
import { connectDB, closeDB, prisma } from '../config/db.js';
import { initAuth } from '../auth/better-auth.js';
import { ENV } from '../config/env.js';

async function seed() {
  try {
    // 1. Extração estrita das variáveis de ambiente
    const adminEmail = process.env.ADMIN_EMAIL!;
    const adminPassword = process.env.ADMIN_PASSWORD!;
    const adminName = 'Administrador TRR Krupinski';

    // 2. Validação Estrita de Segurança e Regra de Negócio (Sem Fallbacks)
    if (!adminEmail || !adminEmail.trim()) {
      throw new Error(
        '[Seed Error] A variável ADMIN_EMAIL não está definida ou está vazia no arquivo .env.'
      );
    }

    if (!adminPassword || !adminPassword.trim()) {
      throw new Error(
        '[Seed Error] A variável ADMIN_PASSWORD não está definida ou está vazia no arquivo .env.'
      );
    }

    console.log('[Seed] Conectando ao banco de dados...');
    await connectDB();

    const auth = initAuth();
    if (!auth) {
      throw new Error('[Seed Error] Falha ao inicializar o Better Auth.');
    }

    console.log(`[Seed] Verificando existência do usuário: ${adminEmail}`);
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingUser) {
      console.log('[Seed] Administrador não encontrado. Criando conta com credenciais do .env...');

      // Criação via Better Auth (garante hash criptográfico seguro e tabelas associadas)
      const authResponse = await auth.api.signUpEmail({
        body: {
          name: adminName,
          email: adminEmail,
          password: adminPassword,
        },
      });

      if (authResponse?.user?.id) {
        await prisma.user.update({
          where: { id: authResponse.user.id },
          data: { role: 'admin' },
        });
      }
      console.log('[Seed] Conta de administrador criada com sucesso!');
    } else {
      console.log('[Seed] Usuário já existente no banco. Garantindo perfil de administrador...');
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'admin' },
      });
      console.log('[Seed] Role do administrador confirmada com sucesso.');
    }

    console.log('[Seed] Processo de seed finalizado com êxito.');
  } catch (error) {
    console.error('[Seed] Falha na execução do seed:', error);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

seed();