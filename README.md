# PlanejaGov - Sistema de Planejamento Governamental

Sistema desenvolvido para auxiliar municípios brasileiros na gestão e planejamento de ações governamentais.

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou yarn 1.22.x
- Conta no [Supabase](https://supabase.com) (opcional, para banco de dados)
- Chave da API do [Google Gemini](https://ai.google.dev/)

## 🚀 Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/narcisolcf/planejagovastudiov1.git
cd planejagovastudiov1
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Gemini API (OBRIGATÓRIO)
GEMINI_API_KEY=sua_chave_gemini_aqui

# Supabase (OPCIONAL - para persistência de dados)
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase

# URL da aplicação (desenvolvimento)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Como obter a chave do Gemini:
1. Acesse https://ai.google.dev/
2. Clique em "Get API Key"
3. Crie um novo projeto ou selecione um existente
4. Copie a chave gerada

### 4. Execute o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em: **http://localhost:3000**

### 5. Build de produção

```bash
npm run build
npm start
```

## 🌐 Deploy

### Deploy no Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "Import Project"
4. Selecione seu repositório
5. Configure as variáveis de ambiente:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL` (se usar)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (se usar)
6. Clique em "Deploy"

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/narcisolcf/planejagovastudiov1)

### Deploy no Netlify

1. Faça push do código para o GitHub
2. Acesse [netlify.com](https://netlify.com)
3. Clique em "Add new site" → "Import an existing project"
4. Selecione seu repositório
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Adicione as variáveis de ambiente
7. Clique em "Deploy site"

## 📁 Estrutura do Projeto

```
planejagovastudiov1/
├── app/                    # Diretórios de rotas (Next.js App Router)
├── components/             # Componentes React reutilizáveis
├── lib/                    # Utilitários e helpers
├── public/                 # Arquivos estáticos
├── styles/                 # Estilos globais
├── pages/api/             # Rotas da API (se usar Pages Router)
├── .env.local             # Variáveis de ambiente (não commitar)
├── next.config.js         # Configuração do Next.js
├── package.json           # Dependências do projeto
└── README.md              # Este arquivo
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes com cobertura
npm run test:coverage
```

## 📝 Funcionalidades

- ✅ Criação de planos governamentais
- ✅ Edição e atualização de planos
- ✅ Exclusão de planos
- ✅ Listagem e busca de planos
- ✅ Autenticação de usuários
- ✅ Interface responsiva

## 🛠️ Tecnologias Utilizadas

- **Next.js 14+** - Framework React
- **React 18+** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados (opcional)
- **Google Gemini AI** - Inteligência artificial

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através de:
- Email: contato@planejagovbrasil.com.br
- Issues: https://github.com/narcisolcf/planejagovastudiov1/issues

## 🙏 Agradecimentos

- Comunidade Next.js
- Google Gemini AI
- TestSprite para testes automatizados
