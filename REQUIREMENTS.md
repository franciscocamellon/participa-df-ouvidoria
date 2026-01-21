# Requisitos do Projeto - Participa DF • Ouvidoria Mobile (PWA)

## Requisitos de Sistema

### Hardware Mínimo
- **Processador**: 2 cores, 2 GHz
- **Memória RAM**: 4 GB
- **Armazenamento**: 2 GB livres
- **Conexão**: Internet banda larga

### Hardware Recomendado
- **Processador**: 4 cores, 3 GHz (ou superior)
- **Memória RAM**: 8 GB
- **Armazenamento**: 5 GB SSD livres
- **Conexão**: Internet fibra

## Requisitos de Software

### Ambiente de Execução (recomendado)
| Software | Versão Mínima | Versão Recomendada | Obrigatório |
|----------|---------------|-------------------|-------------|
| Docker | 24.x | Última estável | ✅ Sim |
| Docker Compose | v2 | Última estável | ✅ Sim |

### Ambiente de Desenvolvimento
| Software | Versão Mínima | Versão Recomendada | Obrigatório |
|----------|---------------|-------------------|-------------|
| Java (JDK) | 21 | 21 (LTS) | ✅ Sim |
| Node.js | 20.x | 20.x LTS | ✅ Sim |
| npm | 10.x | Última estável | ✅ Sim |
| Git | 2.30.0 | 2.40+ | ✅ Sim |
| VS Code | - | Última | ❌ Não |

### Ferramentas Inclusas no Projeto
- **Maven Wrapper** (`backend/mvnw`): dispensa instalação manual do Maven
- **Flyway**: migrações de banco no startup do backend

## Dependências de Produção

### Frontend (Vite + React + TypeScript)

#### Core Framework
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.1"
}
```

#### PWA
```json
{
  "vite-plugin-pwa": "^0.21.2"
}
```

#### UI Components (shadcn/ui + Radix)
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

#### Mapas
```json
{
  "mapbox-gl": "^3.17.0",
  "@types/mapbox-gl": "^3.4.1"
}
```

#### Estado e Data Fetching
```json
{
  "zustand": "^5.0.9",
  "@tanstack/react-query": "^5.83.0"
}
```

#### Formulários e Validação
```json
{
  "react-hook-form": "^7.61.1",
  "@hookform/resolvers": "^3.10.0",
  "zod": "^3.25.76"
}
```

#### Utilitários de Estilo
```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7"
}
```

#### Gráficos e Visualização
```json
{
  "recharts": "^2.15.4"
}
```

#### Datas e Calendário
```json
{
  "date-fns": "^3.6.0",
  "react-day-picker": "^8.10.1"
}
```

#### Notificações e Feedback
```json
{
  "sonner": "^1.7.4"
}
```

#### Outros Componentes/Utilitários
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

### Backend (Java 21 + Spring Boot)

#### Framework e infraestrutura (Maven)
- Spring Boot **3.5.7**
    - `spring-boot-starter-web`
    - `spring-boot-starter-security`
    - `spring-boot-starter-data-jpa`
    - `spring-boot-starter-validation`
    - `spring-boot-starter-actuator`
- Banco e migrações
    - PostgreSQL driver (runtime)
    - Flyway (`flyway-core`, `flyway-database-postgresql`)
- JWT
    - `io.jsonwebtoken:jjwt-*` **0.11.5**
- OpenAPI / Swagger UI
    - Springdoc OpenAPI (BOM) **2.8.13**
    - `springdoc-openapi-starter-webmvc-ui`
- Mapeamento DTO ↔ domínio
    - MapStruct **1.5.5.Final**

#### Testes
- `spring-boot-starter-test`
- `spring-security-test`
- jqwik **1.9.2**

## Dependências de Desenvolvimento

### Frontend
```json
{
  "@eslint/js": "^9.21.0",
  "@tailwindcss/typography": "^0.5.15",
  "@types/node": "^20.17.12",
  "@types/react": "^18.3.12",
  "@types/react-dom": "^18.3.1",
  "@vitejs/plugin-react-swc": "^3.7.2",
  "autoprefixer": "^10.4.20",
  "eslint": "^9.21.0",
  "eslint-plugin-react-hooks": "^5.1.0",
  "eslint-plugin-react-refresh": "^0.4.16",
  "globals": "^15.15.0",
  "postcss": "^8.4.47",
  "tailwindcss": "^3.4.17",
  "typescript": "^5.7.2",
  "typescript-eslint": "^8.24.0",
  "vite": "^5.4.11"
}
```

### Backend
- Maven Wrapper (incluído)
- JDK 21

## Serviços Externos

### Mapbox (Obrigatório)
- **Tipo**: API de mapas
- **Uso**: renderização do mapa interativo (WebGL)
- **Configuração**: token via variável de ambiente
- **Plano**: free tier disponível

```env
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiLi4uIiwiYSI6Ii4uLiJ9...
```

## Variáveis de Ambiente

### Execução via Docker Compose (recomendado)

O projeto utiliza um arquivo de referência `.env.compose` na raiz. Para rodar com os valores padrão:
```bash
cp .env.compose .env
docker compose up --build
```

#### Obrigatórias
| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_MAPBOX_ACCESS_TOKEN` | Token Mapbox para mapas | `pk.eyJ1...` |

#### Recomendadas (com padrões no `.env.compose`)
| Variável | Descrição | Padrão (se não definido) |
|----------|-----------|--------------------------|
| `OMBUDSMAN_DB_NAME` | Nome do banco | `ombudsman_db` |
| `OMBUDSMAN_DB_USER` | Usuário do banco | `ombudsman_user` |
| `OMBUDSMAN_DB_PASS` | Senha do banco | `ombudsman_pass` |
| `JWT_SECRET` | Segredo JWT | (definido no `.env.compose`) |
| `JWT_EXPIRATION_MS` | Expiração JWT em ms | `3600000` |
| `CORS_ALLOWED_ORIGINS` | Origins permitidos (CORS) | `http://localhost:8081` |
| `VITE_API_BASE_URL` | Base URL pública do frontend | `http://localhost:8081` |
| `PGADMIN_DEFAULT_EMAIL` | Usuário do pgAdmin | `admin@example.com` |
| `PGADMIN_DEFAULT_PASSWORD` | Senha do pgAdmin | `admin` |

### Desenvolvimento local (sem Docker)

#### Frontend (opcional)
| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_BASE_URL` | Base URL para a API | `http://localhost:8080` |
| `VITE_MAPBOX_ACCESS_TOKEN` | Token Mapbox | `pk.eyJ1...` |

#### Backend (opcional)
Em modo local, o Spring pode ser configurado via `SPRING_DATASOURCE_*`:
| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SPRING_DATASOURCE_URL` | JDBC URL | `jdbc:postgresql://localhost:5433/ombudsman_db` |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco | `ombudsman_user` |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco | `ombudsman_pass` |
| `JWT_SECRET` | Segredo JWT | (valor seguro) |
| `CORS_ALLOWED_ORIGINS` | Origins permitidos | `http://localhost:5173` |

## Requisitos do Navegador

### Navegadores suportados
| Navegador | Versão mínima |
|----------|----------------|
| Chrome | 90+ |
| Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |

### Recursos necessários
- JavaScript habilitado
- WebGL (para Mapbox)
- Permissão de geolocalização (opcional)

## Instalação Completa

### Execução com Docker Compose (recomendado)

```bash
# 1. Clonar repositório
git clone <URL_DO_REPOSITORIO>
cd participa-df-ouvidoria

# 2. Configurar variáveis
cp .env.compose .env
# Ajustar VITE_MAPBOX_ACCESS_TOKEN, se necessário

# 3. Subir ambiente
docker compose up --build
```

Verificação:
- Frontend: http://localhost:8081
- Backend: http://localhost:8080/swagger-ui/index.html
- Health: http://localhost:8080/actuator/health

### Execução local (sem Docker)

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm ci
npm run dev
```

## Troubleshooting

### Erro: mapa não carrega
**Causa comum**: token Mapbox ausente ou inválido  
**Solução**: definir `VITE_MAPBOX_ACCESS_TOKEN` no `.env`/`.env.compose`.

### Erro: backend não conecta no banco
**Causa comum**: porta/serviço do PostgreSQL indisponível  
**Solução**:
- confirmar serviços ativos: `docker compose ps`
- checar logs: `docker compose logs -f postgres-ombudsman`
- confirmar porta: `5433:5432` no compose

### Erro: CORS bloqueando chamadas da UI
**Causa comum**: origem do frontend não está liberada  
**Solução**: ajustar `CORS_ALLOWED_ORIGINS` para o host/porta em uso.

### Erro: Flyway falha ao iniciar
**Causa comum**: credenciais/URL do banco divergentes  
**Solução**: revisar `SPRING_FLYWAY_*` no `docker-compose.yml` e `.env`.

## Comandos de Referência

### Docker
```bash
docker compose up --build
docker compose down
docker compose logs -f backend
docker compose logs -f frontend
docker compose ps
```

### Frontend
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend
```bash
./mvnw clean package
./mvnw test
./mvnw spring-boot:run
```

## Estrutura de Arquivos de Configuração

```
├── .env.compose
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/resources/application.yaml
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    └── public/
        ├── offline.html
        └── pwa-*.png
```

---

**Documento atualizado em**: Janeiro 2026  
**Versão do projeto**: 1.0.0
