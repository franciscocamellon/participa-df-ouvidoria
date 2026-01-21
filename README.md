# Participa DF • Ouvidoria Mobile (PWA)

Aplicação web progressiva (PWA) mobile-first para registro e acompanhamento de manifestações de ouvidoria, com localização em mapa, protocolo automático, opção de anonimato e envio multicanal (texto, imagem, áudio e vídeo).

## Demonstração

- Vídeo: COLE_AQUI_O_LINK_DO_VIDEO

## Funcionalidades

- Registro de manifestação com:
    - Categoria, descrição e nível de urgência
    - Localização em mapa (coordenadas e endereço aproximado)
    - Opção de envio anônimo
    - Consentimento de privacidade
- Protocolo automático e comprovante de envio
- Acompanhamento por protocolo (consulta pública)
- Histórico de status (linha do tempo)
- Anexos multicanal:
    - Imagem (captura/upload)
    - Áudio (gravação)
    - Vídeo (upload)
- Acessibilidade:
    - Navegação por teclado e foco visível nos fluxos principais
    - Semântica e atributos ARIA nos componentes críticos
    - Painel de acessibilidade (preferências de contraste/tamanho de fonte)

## Stack

- Frontend: Vite + React + TypeScript + Tailwind + shadcn/ui
- Runtime do frontend: Nginx (SPA + proxy para API)
- Backend: Java 21 + Spring Boot + Spring Data JPA + Flyway
- Banco de dados: PostgreSQL 16
- Observabilidade: Spring Actuator
- OpenAPI/Swagger UI: springdoc-openapi

## Arquitetura e roteamento

- O frontend é servido via Nginx na porta **8081**.
- O Nginx faz proxy de requisições **/api/** para o backend na porta **8080**.
- A API é versionada e exposta sob **/api/v1/**.

## Execução com Docker Compose (recomendado)

### Pré-requisitos

- Docker
- Docker Compose

### Variáveis de ambiente

Há um arquivo de referência **.env.compose** na raiz do repositório. Para utilizar os valores padrão:

Opção A (recomendada):

```bash
cp .env.compose .env
```

Opção B:

```bash
docker compose --env-file .env.compose up --build
```

### Subir o ambiente

Na raiz do repositório:

```bash
docker compose up --build
```

### Serviços e portas

- Frontend (PWA): http://localhost:8081
- Backend (API): http://localhost:8080
- PostgreSQL: localhost:5433
- pgAdmin: http://localhost:5050

### Healthchecks

- Frontend: `GET http://localhost:8081/health`
- Backend: `GET http://localhost:8080/actuator/health`

### Encerrar

```bash
docker compose down
```

## Uso (fluxo principal)

1. Acesse o aplicativo em: http://localhost:8081
2. Abra **Nova manifestação**
3. Preencha os campos obrigatórios e selecione a localização no mapa
4. (Opcional) Adicione anexos (imagem/áudio/vídeo)
5. Envie a manifestação e copie o **número de protocolo**
6. Acesse **Acompanhar** e consulte pelo protocolo para visualizar status e histórico

## API

Base URL (via frontend): `http://localhost:8081/api`  
Base URL (direto no backend): `http://localhost:8080/api`

### Endpoints principais (Ouvidoria)

- Criar manifestação:
    - `POST /api/v1/ombudsmans`
- Obter por id:
    - `GET /api/v1/ombudsmans/{id}`
- Obter por protocolo:
    - `GET /api/v1/ombudsmans/by-protocol/{protocolNumber}`
- Listar (paginado):
    - `GET /api/v1/ombudsmans?page=0&size=20&sort=createdAt,desc`

### Autenticação (quando aplicável)

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/refresh-token`

### Swagger UI

- http://localhost:8080/swagger-ui/index.html

## Banco de dados e migrações

- Migrações são executadas via Flyway no startup do backend.
- Os dados do PostgreSQL são persistidos em volume Docker.

## Desenvolvimento local (sem Docker)

### Backend

Pré-requisitos:

- Java 21+
- PostgreSQL (ou ajuste para outro banco suportado)

Execução:

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

Pré-requisitos:

- Node.js 20+

Execução:

```bash
cd frontend
npm ci
npm run dev
```

Configuração recomendada no desenvolvimento (arquivo `frontend/.env.local`):

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_MAPBOX_ACCESS_TOKEN=SEU_TOKEN
```

> Em modo dev, o frontend chama o backend diretamente; ajuste CORS no backend se necessário.

## Segurança e privacidade

- O sistema permite envio anônimo.
- Recomenda-se não inserir dados pessoais desnecessários no texto da manifestação.
- Segredos (JWT, credenciais) devem ser substituídos por valores seguros em ambientes não locais.

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
**Última atualização**: Janeiro de 2026
