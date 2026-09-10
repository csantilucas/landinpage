# TRR Krupinski - Website Institucional & Painel Administrativo

Solução web full-stack desenvolvida sob medida para a **TRR Krupinski** (Transportador Revendedor Retalhista de Combustíveis), especializada no fornecimento e transporte de Diesel S-10, Diesel S-500 e Arla 32 com abastecimento direto na lavoura e frotas agrícolas em Rondônia e Mato Grosso.

O projeto une uma **Landing Page institucional de alta conversão** com um **Painel Administrativo completo**, permitindo personalização total de conteúdos, reordenação de seções, gestão de imagens por área e publicação de notícias e comunicados da safra em tempo real.

---

## 🛠️ Stack Tecnológica

### Frontend (`client/`)
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Estilização:** Tailwind CSS (tema limpo, responsivo, sem fundos escuros no admin)
- **Gerenciamento de Estado & Cache:** TanStack Query v5 (@tanstack/react-query)
- **Ícones & UI:** Lucide React
- **Autenticação Cliente:** Better Auth React Client

### Backend (`server/`)
- **Runtime & Framework:** Node.js + Express + TypeScript
- **Banco de Dados:** MongoDB (acesso via MongoDB Node Driver / Mongoose)
- **Autenticação & Sessões:** Better Auth com armazenamento em banco de dados
- **Arquitetura em Camadas:** Routes ➔ Controllers ➔ Services ➔ Repositories ➔ Database

---

## 📁 Estrutura do Projeto

```
landinpage/
├── client/                     # Aplicação Next.js
│   ├── src/
│   │   ├── app/                # App Router
│   │   │   ├── page.tsx        # Landing Page Dinâmica
│   │   │   ├── layout.tsx      # Layout raiz com TanStack Query Provider
│   │   │   └── admin/          # Painel Administrativo
│   │   │       ├── page.tsx          # Dashboard com métricas e atalhos
│   │   │       ├── layout.tsx        # Layout claro com navegação rápida
│   │   │       ├── secoes/           # Kanban vertical para reordenar/ativar seções
│   │   │       ├── imagens/          # Gestão de imagens por seções com acordeão
│   │   │       ├── avisos/           # Gestão de notícias e comunicados da safra
│   │   │       ├── conteudo/         # Personalização de textos e métricas
│   │   │       └── login/            # Autenticação de administradores
│   │   ├── components/         # Componentes modulares
│   │   │   ├── NoticeCarousel.tsx    # Carrossel fixo com título "Notícias" e fotos
│   │   │   ├── HeroSection.tsx       # Banner principal com imagem dinâmica
│   │   │   ├── AboutSection.tsx      # Seção Sobre com contadores e foto institucional
│   │   │   ├── FleetCarousel.tsx     # Carrossel animado da frota pesada
│   │   │   ├── ServicesSection.tsx   # Abastecimento direto na lavoura & produtos
│   │   │   ├── BasesGrid.tsx         # Unidades operacionais (Vilhena, Comodoro, etc.)
│   │   │   ├── ContactSection.tsx    # Contatos e integração com WhatsApp
│   │   │   └── AdminGearButton.tsx   # Botão flutuante de acesso rápido ao admin
│   │   └── lib/                # API client, configurações e Better Auth
│   └── package.json
│
└── server/                     # API RESTful em TypeScript
    ├── src/
    │   ├── controllers/        # Controladores REST
    │   ├── services/           # Regras de negócio
    │   ├── repositories/       # Abstração de persistência no MongoDB
    │   ├── models/             # Tipagens e esquemas de dados (Notice, Fleet, Content)
    │   ├── routes/             # Definição das rotas públicas e protegidas
    │   ├── middleware/         # Middleware de autenticação Better Auth
    │   ├── config/             # Conexão MongoDB e variáveis de ambiente
    │   └── scripts/
    │       └── seed.ts         # Script de carga inicial (admin, fotos e dados)
    └── package.json
```

---

## ✨ Funcionalidades Principais

### 🌐 Landing Page Institucional
1. **Notícias & Comunicados em Destaque**:
   - Título **"Notícias"** visível acima dos cards.
   - Suporte a imagens fotográficas/banners em miniaturas proporcionais integradas ao card.
   - Tipos de avisos categorizados (Alerta/Plantão, Comunicado, Informativo).
   - Sem botão de fechar (comunicados da safra permanecem permanentemente visíveis).
   - Rotação automática e navegação manual por setas ou paginação.
2. **Seções 100% Dinâmicas**:
   - A ordem e a visibilidade de todas as seções (Hero, Sobre, Notícias, Frota, Serviços, Bases, Contato) são controladas via painel admin e salvas no banco de dados.
3. **Abastecimento Direto na Lavoura**:
   - Destaque para caminhões equipados com bombas medidoras digitais para entrega in loco sem necessidade de tanques em comodato.
4. **Frota em Alta Resolução**:
   - Carrossel com transições suaves e fotos dos caminhões tanques, bitrens e unidades operacionais.
5. **Acesso Rápido ao Painel**:
   - Botão flutuante de engrenagem na lateral da página para abertura imediata da área administrativa.

---

### 🎛️ Painel Administrativo (`/admin`)

O painel segue a mesma paleta visual limpa e profissional da página inicial (tons de branco, ardósia e âmbar, sem telas escuras):

- **Reordenação e Visibilidade das Seções (`/admin/secoes`)**:
  - Interface estilo Kanban vertical para subir, descer ou desativar qualquer seção da página inicial com um clique.
- **Gerenciador de Imagens por Seções (`/admin/imagens`)**:
  - Organização por labels específicas:
    - *Carrossel da Frota (Fotos dos Caminhões)*
    - *Banner Inicial (Hero Section)*
    - *Sobre a Empresa (Foto da Safra / Lavoura)*
    - *Cards de Produtos & Serviços*
    - *Geral / Institucional*
  - Dropdown / Acordeão para expandir ou recolher as fotos de cada área.
  - Botão individual **`+ Cadastrar nesta Seção`** em cada cabeçalho para inserção direta no destino correto.
  - **Prévia visual em tempo real** ao digitar ou colar a URL da imagem.
- **Gerenciador de Notícias & Avisos (`/admin/avisos`)**:
  - Cadastro de comunicados com título, mensagem, link de destino, texto do botão e **link de imagem com pré-visualização instantânea**.
  - Tabela com miniatura fotográfica de cada notícia cadastrada.
- **Editor de Textos & Métricas (`/admin/conteudo`)**:
  - Edição de títulos, subtítulos, canais de contato e métricas de desempenho (ex.: 100% de pontualidade na safra).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MongoDB](https://www.mongodb.com/) rodando localmente na porta padrão (`mongodb://localhost:27017`) ou conexão Atlas configurada no `.env`

### 1. Iniciar o Backend (`server/`)
```bash
cd server
npm install

# Executar a carga inicial com usuário administrador e conteúdos padrão
npm run seed

# Iniciar servidor em desenvolvimento (porta 5000)
npm run dev
```

### 2. Iniciar o Frontend (`client/`)
Em outro terminal:
```bash
cd client
npm install

# Iniciar o cliente Next.js em desenvolvimento (porta 3000)
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a Landing Page.

---

## 🔐 Acesso Administrativo

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **E-mail Padrão:** `admin@trrkrupinski.com.br`
- **Senha Padrão:** `admin123456`

---

## 🛡️ Segurança & Boas Práticas

- **Credenciais Seguras:** Arquivos `.env` ignorados no `.gitignore` para proteção de segredos.
- **Autenticação:** Sessões gerenciadas via Better Auth com proteção de rotas através de middleware.
- **Validação:** Tipagem estrita com TypeScript em todas as camadas (cliente e servidor).
- **Sem Cache Obsoleto:** TanStack Query com invalidação automática de cache após mutações de dados no painel administrativo.
