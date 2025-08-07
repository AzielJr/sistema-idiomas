# Custom Idiomas - Sistema de Gestão Escolar

## 📋 Sobre o Projeto

Sistema completo de gestão escolar desenvolvido em React + TypeScript + Material-UI, com funcionalidades para administração de cursos de idiomas.

## 🚀 Funcionalidades Implementadas

### 📊 Dashboard
- Visão geral do sistema
- Estatísticas em tempo real
- Cards informativos

### 📝 Cadastros
- **Alunos**: Gestão completa de estudantes
- **Professores**: Cadastro e gerenciamento de docentes
- **Material Didático**: Controle de recursos educacionais
- **Turmas**: Organização de classes
- **Aulas**: Programação de aulas

### 📅 Minha Agenda
- Calendário visual interativo
- Visualização de compromissos
- Interface moderna e responsiva

### 🎯 Movimentações
- **Plano de Aulas**: Planejamento pedagógico detalhado
- **Presença/Faltas**: Controle de frequência dos alunos

### 📚 Projetos
- **Leitura**: Gestão de projetos de leitura
- **Escrita**: Acompanhamento de projetos de escrita

### ⚙️ Administração
- **Unidade**: Gestão de unidades escolares (com contato, celular e imagem)
- **Grupos de Acesso**: Controle de permissões por nível
- **Usuários**: Gestão completa de usuários do sistema
- **LOG do Sistema**: Monitoramento de atividades com filtros por data

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Material-UI (MUI)** - Biblioteca de componentes
- **React Router** - Navegação
- **Vite** - Build tool e dev server

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para execução local

1. **Clone o repositório**
```bash
git clone [URL_DO_REPOSITORIO]
cd custom_idiomas
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto em modo desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
```
http://localhost:5173
```

## 🚀 Deploy para Produção

### Opção 1: Build Local + Servidor Web

1. **Gere o build de produção**
```bash
npm run build
```

2. **Os arquivos serão gerados na pasta `dist/`**

3. **Hospede os arquivos em qualquer servidor web** (Apache, Nginx, etc.)

### Opção 2: Vercel (Recomendado)

1. **Instale a CLI do Vercel**
```bash
npm i -g vercel
```

2. **Faça o deploy**
```bash
vercel --prod
```

### Opção 3: Netlify

1. **Instale a CLI do Netlify**
```bash
npm install -g netlify-cli
```

2. **Faça o build e deploy**
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Opção 4: GitHub Pages

1. **Instale o gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Adicione no package.json**
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://[SEU_USUARIO].github.io/custom_idiomas"
}
```

3. **Execute o deploy**
```bash
npm run build
npm run deploy
```

## 🔧 Configurações para Deploy

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://sua-api.com
VITE_APP_NAME=Custom Idiomas
```

### Configuração do Vite (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Ajuste conforme necessário para subdiretorios
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

## 📱 Funcionalidades Principais

### Sistema de LOG
- **Filtros por Data**: Data inicial e final
- **Monitoramento**: Login, logout, salvamentos, exclusões
- **Informações Detalhadas**: IP, dispositivo, navegador
- **Paginação**: Controle de registros por página

### Gestão de Usuários
- **Perfis Completos**: Foto, dados pessoais, contato
- **Grupos de Acesso**: Administrador, Gerente, Professor, Secretaria, Visualizador
- **Status**: Ativo/Inativo com toggle rápido

### Interface Responsiva
- **Desktop**: Layout completo com sidebar
- **Tablet**: Adaptação automática
- **Mobile**: Menu colapsável

## 🎨 Características da UI

- **Design Moderno**: Material Design 3.0
- **Cores Consistentes**: Paleta harmoniosa
- **Feedback Visual**: Loading states, tooltips, validações
- **Acessibilidade**: Contraste adequado, navegação por teclado

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── rotas/              # Configuração de rotas
├── interface/          # Tipos TypeScript
├── temas/              # Configuração de temas
└── assets/             # Recursos estáticos
```

## 🔒 Segurança

- **Validação de Formulários**: Campos obrigatórios
- **Sanitização**: Prevenção de XSS
- **Controle de Acesso**: Baseado em grupos
- **LOG de Auditoria**: Rastreamento de ações

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato com a equipe de desenvolvimento.

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2024  
**Status**: ✅ Pronto para Deploy
