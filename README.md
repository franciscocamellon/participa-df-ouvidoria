# Mediação Territorial Integrada

Plataforma de coordenação urbana focada em confiança, transparência e retorno ao cidadão. Sistema desenvolvido para gestão de ocorrências urbanas, controle de resíduos e integração territorial.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Componentes Principais](#componentes-principais)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [Design System](#design-system)
- [Princípios de Design](#princípios-de-design)
- [Segurança](#segurança)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## Sobre o Projeto

A **Mediação Territorial Integrada** é uma plataforma de tecnologia cívica ("civic tech") que visa facilitar a comunicação entre cidadãos e órgãos públicos para resolução de problemas urbanos. O sistema adota uma filosofia "trust-first" (confiança primeiro), evitando linguagem de vigilância e priorizando transparência em todas as interações.

### Filosofia do Projeto

- **Trust-first**: Linguagem ética, sem referências a vigilância
- **Transparência**: Estados claros, explicações acessíveis
- **Privacidade**: Consentimento obrigatório, dados anonimizados
- **Acessibilidade**: Contraste WCAG AA, navegação por teclado

## Funcionalidades

### 🗺️ Mapa Interativo

- Visualização de ocorrências georreferenciadas
- Registro de novas ocorrências diretamente no mapa
- Marcadores com ícones específicos por categoria
- Integração com Mapbox GL JS

### 📝 Gestão de Ocorrências

- **Categorias**: Zeladoria, iluminação, descarte irregular, mobiliário urbano, acessibilidade, vulnerabilidade social, risco ambiental
- **Fluxo de status**: Recebido → Em triagem → Encaminhado → Em execução → Concluído → Sem ação/Programado
- **Histórico completo**: Timeline de cada atualização

### ♻️ Módulo de Resíduos (Lixo)

- Registro de descarte irregular
- Ofertas de materiais recicláveis
- Controle de coleta por cooperativas
- Métricas de kg coletados por material
- Workflow operacional completo

### 👤 Perfil do Cidadão

- Histórico de contribuições
- Sistema de "contribuições verificadas"
- Métricas de confiança (não competitivo)

### 📊 Dashboard

- Estatísticas gerais
- Distribuição por categoria
- Status das ocorrências

## Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   React     │  │  Zustand    │  │  Mapbox GL  │          │
│  │   Router    │  │   Store     │  │     JS      │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  ┌─────────────────────────────────────────────────┐        │
│  │              Shadcn/ui Components               │        │
│  │  (Dialog, Toast, Cards, Forms, etc.)            │        │
│  └─────────────────────────────────────────────────┘        │
│                                                              │
│  ┌─────────────────────────────────────────────────┐        │
│  │           Tailwind CSS + Design System          │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

| Camada      | Tecnologia      | Versão  | Propósito             |
| ----------- | --------------- | ------- | --------------------- |
| Framework   | React           | 18.3.1  | UI Components         |
| Build Tool  | Vite            | 5.x     | Bundling & Dev Server |
| Linguagem   | TypeScript      | 5.x     | Type Safety           |
| Estilização | Tailwind CSS    | 3.4     | Utility-first CSS     |
| Componentes | Shadcn/ui       | -       | UI Component Library  |
| Estado      | Zustand         | 5.0.9   | State Management      |
| Roteamento  | React Router    | 6.30.1  | Client-side Routing   |
| Mapas       | Mapbox GL JS    | 3.17.0  | Interactive Maps      |
| Formulários | React Hook Form | 7.61.1  | Form Management       |
| Validação   | Zod             | 3.25.76 | Schema Validation     |
| Gráficos    | Recharts        | 2.15.4  | Data Visualization    |
| Datas       | date-fns        | 3.6.0   | Date Manipulation     |

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **yarn** >= 1.22.0 ou **bun** >= 1.0.0
- **Git** >= 2.30.0
- **Token do Mapbox** (obtenha em [mapbox.com](https://account.mapbox.com/))

### Verificar Instalações

```bash
node --version    # v18.0.0 ou superior
npm --version     # 9.0.0 ou superior
git --version     # 2.30.0 ou superior
```

## Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/mediacao-territorial.git
cd mediacao-territorial
```

### 2. Instalar Dependências

**Usando npm:**

```bash
npm install
```

**Usando yarn:**

```bash
yarn install
```

**Usando bun:**

```bash
bun install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite o arquivo com suas configurações:

```env
# Mapbox Configuration (OBRIGATÓRIO)
VITE_MAPBOX_ACCESS_TOKEN=seu_token_mapbox_aqui

# API Configuration (opcional - para integração futura)
VITE_API_URL=https://api.exemplo.com
VITE_API_KEY=sua_api_key

# Feature Flags (opcional)
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=false
```

### 4. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Configuração

### Configuração Principal (`src/config/app.config.ts`)

```typescript
// Coordenadas padrão do mapa (Setor Comercial Sul, Brasília)
export const DEFAULT_CENTER = {
  lng: -47.8921653,
  lat: -15.7971748,
};

// Categorias de ocorrência disponíveis
export const OCCURRENCE_CATEGORIES = [
  "zeladoria",
  "iluminacao",
  "descarte_irregular",
  // ...
];

// Configuração de status
export const STATUS_FLOW = [
  "recebido",
  "em_triagem",
  "encaminhado",
  // ...
];
```

### Configuração do Mapbox (`src/config/mapbox.ts`)

```typescript
export const MAPBOX_STYLE = "mapbox://styles/mapbox/dark-v11";
export const DEFAULT_ZOOM = 15;
```

### Configuração de Resíduos (`src/config/waste.config.ts`)

```typescript
export const WASTE_TYPES = [
  { id: "organico", label: "Orgânico", color: "#22C55E" },
  { id: "reciclavel", label: "Reciclável", color: "#3B82F6" },
  // ...
];
```

## Estrutura de Pastas

```
mediacao-territorial/
├── public/                     # Arquivos estáticos
│   ├── favicon.ico
│   ├── robots.txt
│   └── placeholder.svg
│
├── src/
│   ├── assets/                 # Imagens e recursos
│   │
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Componentes Shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/             # Componentes de layout
│   │   │   └── Header.tsx
│   │   │
│   │   ├── map/                # Componentes do mapa
│   │   │   ├── MapView.tsx
│   │   │   └── MapControls.tsx
│   │   │
│   │   ├── occurrence/         # Componentes de ocorrências
│   │   │   ├── OccurrenceModal.tsx
│   │   │   └── OccurrenceDetailCard.tsx
│   │   │
│   │   ├── waste/              # Componentes de resíduos
│   │   │   ├── WasteMapView.tsx
│   │   │   ├── WasteDetailPanel.tsx
│   │   │   ├── WasteReportModal.tsx
│   │   │   ├── RecyclableDetailPanel.tsx
│   │   │   └── RecyclableOfferModal.tsx
│   │   │
│   │   └── camera/             # Componentes de câmeras
│   │       └── CameraPanel.tsx
│   │
│   ├── config/                 # Configurações
│   │   ├── app.config.ts       # Config geral
│   │   ├── mapbox.ts           # Config do Mapbox
│   │   └── waste.config.ts     # Config de resíduos
│   │
│   ├── hooks/                  # Custom Hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/                    # Utilitários
│   │   └── utils.ts            # Funções helper
│   │
│   ├── pages/                  # Páginas/Rotas
│   │   ├── Index.tsx           # Mapa principal
│   │   ├── Dashboard.tsx       # Dashboard
│   │   ├── Lixo.tsx            # Módulo de resíduos
│   │   ├── MeusRegistros.tsx   # Registros do usuário
│   │   ├── Perfil.tsx          # Perfil
│   │   ├── Sobre.tsx           # Sobre
│   │   ├── Sugestoes.tsx       # Sugestões
│   │   └── NotFound.tsx        # 404
│   │
│   ├── stores/                 # Estado global (Zustand)
│   │   ├── occurrenceStore.ts  # Store de ocorrências
│   │   └── wasteStore.ts       # Store de resíduos
│   │
│   ├── types/                  # Definições TypeScript
│   │   ├── occurrence.ts       # Tipos de ocorrência
│   │   └── waste.ts            # Tipos de resíduos
│   │
│   ├── App.tsx                 # Componente raiz
│   ├── App.css                 # Estilos globais
│   ├── index.css               # Design system/tokens
│   ├── main.tsx                # Entry point
│   └── vite-env.d.ts           # Tipos do Vite
│
├── .env.example                # Exemplo de variáveis
├── .gitignore                  # Arquivos ignorados
├── components.json             # Config Shadcn
├── eslint.config.js            # Config ESLint
├── index.html                  # HTML template
├── package.json                # Dependências
├── postcss.config.js           # Config PostCSS
├── README.md                   # Documentação
├── REQUIREMENTS.md             # Requisitos
├── tailwind.config.ts          # Config Tailwind
├── tsconfig.json               # Config TypeScript
└── vite.config.ts              # Config Vite
```

## Componentes Principais

### MapView (`src/components/map/MapView.tsx`)

Renderiza o mapa interativo com Mapbox GL JS, gerencia marcadores de ocorrências e eventos de clique.

### OccurrenceModal (`src/components/occurrence/OccurrenceModal.tsx`)

Modal para registro de novas ocorrências, com formulário validado e seleção de categoria.

### WasteMapView (`src/components/waste/WasteMapView.tsx`)

Mapa especializado para o módulo de resíduos, com marcadores diferenciados.

### Header (`src/components/layout/Header.tsx`)

Navegação principal com links responsivos e tema consistente.

## Gerenciamento de Estado

### Zustand Stores

#### occurrenceStore

```typescript
// Principais ações
addOccurrence(occurrence); // Adicionar ocorrência
updateOccurrenceStatus(id, status); // Atualizar status
deleteOccurrence(id); // Remover ocorrência
selectOccurrence(occurrence); // Selecionar para visualização
getUserOccurrences(userId); // Filtrar por usuário
```

#### wasteStore

```typescript
// Principais ações
addWasteReport(report); // Adicionar relatório de lixo
addRecyclableOffer(offer); // Adicionar oferta reciclável
updateWasteStatus(id, status); // Atualizar status
deleteWasteReport(id); // Remover relatório
deleteRecyclableOffer(id); // Remover oferta
```

### Persistência

Ambos os stores utilizam `zustand/middleware/persist` para salvar dados no `localStorage`.

## Rotas da Aplicação

| Rota              | Página        | Descrição                         |
| ----------------- | ------------- | --------------------------------- |
| `/`               | Index         | Mapa principal de ocorrências     |
| `/dashboard`      | Dashboard     | Estatísticas e métricas           |
| `/lixo`           | Lixo          | Módulo de gestão de resíduos      |
| `/meus-registros` | MeusRegistros | Histórico do usuário              |
| `/perfil`         | Perfil        | Configurações e métricas pessoais |
| `/sobre`          | Sobre         | Informações da plataforma         |
| `/sugestoes`      | Sugestoes     | Envio de sugestões                |
| `*`               | NotFound      | Página 404                        |

## Design System

### Cores (HSL - index.css)

```css
:root {
  /* Base */
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;

  /* Primária - Azul profundo (confiança) */
  --primary: 217 91% 60%;
  --primary-foreground: 222 47% 11%;

  /* Accent - Ciano elétrico */
  --accent: 187 100% 42%;

  /* Destrutivo - Vermelho */
  --destructive: 0 84% 60%;

  /* Sucesso - Verde */
  --success: 142 76% 36%;
}
```

### Componentes Shadcn/ui

Todos os componentes base estão em `src/components/ui/` e seguem o design system definido.

## Princípios de Design

1. **Trust-first**: Linguagem que transmite confiança
2. **Transparência**: Estados claros e explicações acessíveis
3. **Acessibilidade**: WCAG AA, navegação por teclado
4. **Responsividade**: Mobile-first design
5. **Não-vigilância**: Evitar terminologia de monitoramento

## Segurança

- ✅ Token do Mapbox em variável de ambiente
- ✅ Sem exposição de dados sensíveis em logs
- ✅ Consentimento de privacidade obrigatório
- ✅ Dados anonimizados por padrão
- ⚠️ Preparado para integração com backend seguro

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev           # Servidor de desenvolvimento

# Build
npm run build         # Build de produção
npm run preview       # Preview do build

# Qualidade
npm run lint          # Verificar código
npm run type-check    # Verificar tipos
```

## Deploy

### Build de Produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/`.

### Variáveis de Ambiente em Produção

Certifique-se de configurar:

- `VITE_MAPBOX_ACCESS_TOKEN`

### Plataformas Suportadas

- Vercel
- Netlify
- GitHub Pages
- Qualquer servidor estático

## Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código

- ESLint para linting
- Prettier para formatação
- Commits semânticos

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Versão**: 1.0.0-pilot  
**Última atualização**: Dezembro 2024
