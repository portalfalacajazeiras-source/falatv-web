# FalaTV Web — Frontend Next.js 14

Portal de vídeos do canal Fala Cajazeiras. Frontend mobile-first que consome a REST API do plugin WordPress FalaTV.

## Stack

- **Next.js 14** App Router com ISR, SSR e CSR por rota
- **TypeScript 5** strict mode
- **TanStack Query v5** para server state e infinite scroll
- **Zustand 4** para UI state
- **Tailwind CSS 3** com design tokens FalaTV
- **Framer Motion 11** para animações

## Pré-requisitos

- Node.js 20+
- Plugin WordPress FalaTV v0.4.3+ instalado e configurado
- Conta Vercel (deploy gratuito)

## Instalação local

```bash
# Clone o repositório
git clone https://github.com/falatv/falatv-web.git
cd falatv-web

# Instala dependências
npm install

# Configura variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Inicia o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_WP_API_URL` | URL da REST API WordPress (obrigatório) |
| `NEXT_PUBLIC_SITE_NAME` | Nome do site (padrão: FalaTV) |
| `NEXT_PUBLIC_SITE_URL` | URL do frontend em produção |
| `NEXT_PUBLIC_CHANNEL_NAME` | Nome do canal (padrão: Fala Cajazeiras) |
| `REVALIDATION_SECRET` | Segredo para webhook ISR (deve bater com o WordPress) |

## Deploy no Vercel

1. Faça fork/import do repositório no Vercel
2. Configure as variáveis de ambiente no dashboard do Vercel
3. Deploy automático a cada push na branch `main`

O `REVALIDATION_SECRET` deve ser o mesmo valor configurado em **FalaTV → Configurações → Segredo de Revalidação** no WordPress.

## Estrutura de rotas

| Rota | Rendering | Cache |
|---|---|---|
| `/` | ISR | 60s + webhook |
| `/videos` | ISR | 60s + webhook |
| `/videos/[id]` | ISR | 300s + webhook |
| `/shorts` | CSR | TanStack Query |
| `/ao-vivo` | SSR | force-dynamic |
| `/busca` | CSR | sem cache |
| `/playlists` | ISR | 300s |
| `/offline` | Static | build time |
| `/api/revalidate` | API Route | webhook do WP |

## Webhook ISR

Quando o WordPress sincroniza novos vídeos, ele chama automaticamente:

```
POST https://falatv.com.br/api/revalidate
X-Revalidation-Secret: <secret>
Content-Type: application/json

{ "path": "/", "type": "all" }
```

O Next.js invalida o cache ISR das páginas afetadas e regenera com os novos vídeos.

## Scripts

```bash
npm run dev        # Desenvolvimento
npm run build      # Build de produção
npm run start      # Servidor de produção local
npm run lint       # ESLint
npm run type-check # TypeScript check
```


