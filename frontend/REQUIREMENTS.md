# Requisitos do Projeto - Mediação Territorial Integrada

## Requisitos de Sistema

### Hardware Mínimo
- **Processador**: 2 cores, 2 GHz
- **Memória RAM**: 4 GB
- **Armazenamento**: 500 MB livres
- **Conexão**: Internet banda larga

### Hardware Recomendado
- **Processador**: 4 cores, 3 GHz
- **Memória RAM**: 8 GB
- **Armazenamento**: 1 GB SSD
- **Conexão**: Internet fibra

## Requisitos de Software

### Ambiente de Desenvolvimento

| Software | Versão Mínima | Versão Recomendada | Obrigatório |
|----------|---------------|-------------------|-------------|
| Node.js | 18.0.0 | 20.x LTS | ✅ Sim |
| npm | 9.0.0 | 10.x | ✅ Sim |
| Git | 2.30.0 | 2.40+ | ✅ Sim |
| VS Code | - | Última | ❌ Não |

### Alternativas ao npm
- **yarn**: >= 1.22.0
- **bun**: >= 1.0.0
- **pnpm**: >= 8.0.0

## Dependências de Produção

### Core Framework
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.1"
}
```

### UI Components (Shadcn/ui + Radix)
```json
{
  "@radix-ui/react-accordion": "^1.2.11",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-aspect-ratio": "^1.1.7",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-checkbox": "^1.3.2",
  "@radix-ui/react-collapsible": "^1.1.11",
  "@radix-ui/react-context-menu": "^2.2.15",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-hover-card": "^1.1.14",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-menubar": "^1.1.15",
  "@radix-ui/react-navigation-menu": "^1.2.13",
  "@radix-ui/react-popover": "^1.1.14",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-radio-group": "^1.3.7",
  "@radix-ui/react-scroll-area": "^1.2.9",
  "@radix-ui/react-select": "^2.2.5",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slider": "^1.3.5",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-switch": "^1.2.5",
  "@radix-ui/react-tabs": "^1.1.12",
  "@radix-ui/react-toast": "^1.2.14",
  "@radix-ui/react-toggle": "^1.1.9",
  "@radix-ui/react-toggle-group": "^1.1.10",
  "@radix-ui/react-tooltip": "^1.2.7"
}
```

### Mapas
```json
{
  "mapbox-gl": "^3.17.0",
  "@types/mapbox-gl": "^3.4.1"
}
```

### Estado e Data Fetching
```json
{
  "zustand": "^5.0.9",
  "@tanstack/react-query": "^5.83.0"
}
```

### Formulários e Validação
```json
{
  "react-hook-form": "^7.61.1",
  "@hookform/resolvers": "^3.10.0",
  "zod": "^3.25.76"
}
```

### Utilitários de Estilo
```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7"
}
```

### Gráficos e Visualização
```json
{
  "recharts": "^2.15.4"
}
```

### Manipulação de Datas
```json
{
  "date-fns": "^3.6.0",
  "react-day-picker": "^8.10.1"
}
```

### Notificações e Feedback
```json
{
  "sonner": "^1.7.4"
}
```

### Outros Componentes
```json
{
  "cmdk": "^1.1.1",
  "embla-carousel-react": "^8.6.0",
  "input-otp": "^1.4.2",
  "lucide-react": "^0.462.0",
  "next-themes": "^0.3.0",
  "react-resizable-panels": "^2.1.9",
  "vaul": "^0.9.9"
}
```

## Dependências de Desenvolvimento

```json
{
  "@types/node": "^20.x",
  "@types/react": "^18.x",
  "@types/react-dom": "^18.x",
  "@vitejs/plugin-react-swc": "^3.x",
  "autoprefixer": "^10.x",
  "eslint": "^9.x",
  "postcss": "^8.x",
  "tailwindcss": "^3.4.x",
  "typescript": "^5.x",
  "vite": "^5.x"
}
```

## Serviços Externos

### Mapbox (Obrigatório)
- **Tipo**: API de Mapas
- **Uso**: Visualização do mapa interativo
- **Configuração**: Token de acesso via variável de ambiente
- **URL**: https://www.mapbox.com/
- **Plano**: Free tier disponível (50.000 cargas/mês)

```env
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiLi4uIiwiYSI6Ii4uLiJ9...
```

### Backend (Futuro )
- **Tipo**: Backend as a Service
- **Uso**: Persistência, autenticação, APIs
- **Status**: Preparado para integração

## Variáveis de Ambiente

### Obrigatórias
| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_MAPBOX_ACCESS_TOKEN` | Token de acesso do Mapbox | `pk.eyJ1...` |

### Opcionais
| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL da API backend | - |
| `VITE_ENABLE_ANALYTICS` | Habilitar analytics | `false` |
| `VITE_DEBUG_MODE` | Modo debug | `false` |

## Requisitos do Navegador

### Navegadores Suportados
| Navegador | Versão Mínima |
|-----------|---------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### Recursos Necessários
- JavaScript habilitado
- Cookies habilitados
- WebGL suportado (para Mapbox)
- Geolocalização (opcional)

## Instalação Completa

### Passo a Passo

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/mediacao-territorial.git
cd mediacao-territorial

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
cp .env.example .env.local
# Editar .env.local com seu token do Mapbox

# 4. Verificar instalação
npm run type-check
npm run lint

# 5. Iniciar desenvolvimento
npm run dev

# 6. Build de produção (quando pronto)
npm run build
```

### Verificação de Saúde

Após iniciar o servidor (`npm run dev`), verifique:

1. ✅ Aplicação carrega em `http://localhost:5173`
2. ✅ Mapa renderiza corretamente
3. ✅ Marcadores aparecem no mapa
4. ✅ Navegação funciona entre páginas
5. ✅ Console sem erros críticos

## Troubleshooting

### Erro: Mapa não carrega
```
Causa: Token do Mapbox inválido ou não configurado
Solução: Verificar VITE_MAPBOX_ACCESS_TOKEN no .env.local
```

### Erro: Dependências não instalam
```
Causa: Versão do Node.js incompatível
Solução: Atualizar Node.js para v18+ LTS
```

### Erro: Build falha
```
Causa: Erros de TypeScript
Solução: Executar npm run type-check e corrigir erros
```

### Erro: Estilos não aplicam
```
Causa: PostCSS/Tailwind não configurado
Solução: Verificar postcss.config.js e tailwind.config.ts
```

## Comandos de Referência

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento

# Build
npm run build            # Build de produção
npm run preview          # Preview do build

# Qualidade de Código
npm run lint             # ESLint
npm run type-check       # TypeScript check

# Limpar
rm -rf node_modules      # Remover dependências
rm -rf dist              # Remover build
npm cache clean --force  # Limpar cache npm
```

## Estrutura de Arquivos de Configuração

```
├── .env.example         # Template de variáveis
├── .env.local           # Variáveis locais (git ignore)
├── components.json      # Configuração Shadcn
├── eslint.config.js     # Configuração ESLint
├── package.json         # Dependências e scripts
├── postcss.config.js    # Configuração PostCSS
├── tailwind.config.ts   # Configuração Tailwind
├── tsconfig.json        # Configuração TypeScript
├── tsconfig.app.json    # TS config da aplicação
├── tsconfig.node.json   # TS config do Node
└── vite.config.ts       # Configuração Vite
```

---

**Documento atualizado em**: Dezembro 2024  
**Versão do projeto**: 1.0.0-pilot
