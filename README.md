# Participa DF • Ouvidoria Mobile (PWA)

O Participa DF Ouvidoria é uma aplicação web progressiva (PWA) mobile-first para registro e acompanhamento de manifestações de ouvidoria com localização em mapa, geração de protocolo, opção de anonimato, suporte a anexos e consulta pública por protocolo. Este repositório é organizado para funcionar localmente via Docker Compose, com frontend servido por Nginx, backend em Java/Spring Boot e persistência em PostgreSQL, além de uma base de documentação arquitetural e operacional suficiente para manutenção de longo prazo.

## Visão rápida do que existe no repositório

A solução é composta por um frontend em React e TypeScript construído com Vite e servido em runtime via Nginx, um backend em Java 21 com Spring Boot expondo a API versionada em `/api/v1`, um banco PostgreSQL 16 com migrações gerenciadas por Flyway e um conjunto de documentos em `docs/` cobrindo C4, ADRs, OpenAPI, state machine de status, política de anonimato e LGPD, runbook e observabilidade mínima.

## Arquitetura em alto nível

A arquitetura do sistema está documentada pelo C4 mínimo e renderizada em PNG. Para leitura rápida, as duas visões mais úteis são contexto e containers.

![C4 Contexto](docs/images/rendered/contexto.png)

![C4 Containers](docs/images/rendered/containers.png)

A interação principal ocorre com o Cidadão/Usuário, que cria manifestações, possivelmente anônimas, e consulta o andamento por protocolo. O Operador/Servidor atua em fluxos autenticados para acompanhamento e atualização de status. O backend integra, quando disponível, um serviço externo de triagem (IZA) para sugestão de categoria e órgão, encaminha a manifestação para o órgão destino e usa um storage externo para anexos, persistindo no banco apenas URLs ou keys.

## Arquitetura interna por camadas

Abaixo está uma visão de “caixas” com foco nas escolhas reais de bibliotecas e nos pontos de acoplamento. Ela complementa os diagramas C4 e ajuda a explicar por que cada parte existe e onde ficam as responsabilidades.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  Frontend (PWA)                              │
│                                                                              │
│  Roteamento e estado de navegação: React Router DOM                           │
│                                                                              │
│  Comunicação com API e cache: TanStack React Query                            │
│                                                                              │
│  Mapa e geolocalização: Mapbox GL JS                                          │
│                                                                              │
│  Formulários e validação: React Hook Form + @hookform/resolvers               │
│                                                                              │
│  UI e componentes: shadcn/ui (Radix UI) + lucide-react + sonner               │
│                                                                              │
│  Estilo e design system: Tailwind CSS + tailwind-merge + class-variance-auth  │
│                                                                              │
│  Runtime e proxy: Nginx serve SPA/PWA e encaminha /api/* para o backend       │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                              Backend (API Ouvidoria)                         │
│                                                                              │
│  Web/API: Spring Boot Starter Web                                             │
│  Validação: Spring Boot Starter Validation                                    │
│  Segurança: Spring Boot Starter Security + JWT (jjwt)                         │
│  Persistência: Spring Data JPA + PostgreSQL Driver                            │
│  Migrações: Flyway                                                            │
│  OpenAPI/Swagger: springdoc-openapi                                           │
│  Observabilidade: Spring Boot Actuator                                        │
│  Mapeamento DTO <-> Entidade: MapStruct                                       │
│                                                                              │
│  Integrações externas: cliente IZA (triagem) e cliente de Encaminhamento      │
│  Storage: anexos referenciados por URL/Key, evitando binário no banco         │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Fluxo ponta a ponta do envio anônimo

O fluxo mais crítico do produto é o envio anônimo de uma manifestação. O diagrama de sequência abaixo documenta o comportamento esperado no happy path e evidencia os pontos opcionais de anexos e triagem.

![Sequência: Envio de Notificação Anônima](docs/images/rendered/seq-envio-notificacao-anonima.png)

O contrato público de criação está em `POST /api/v1/ombudsmans`, com retorno `201` e um `protocolNumber` que passa a ser a chave de acompanhamento do usuário final. A consulta pública por protocolo está em `GET /api/v1/ombudsmans/by-protocol/{protocolNumber}` e deve ser tratada com cuidado operacional para evitar enumeração e abuso, conforme indicado na política de observabilidade e no runbook.

## Containers, portas e roteamento

No ambiente local com Docker Compose, o frontend fica acessível em `http://localhost:8081` e o backend em `http://localhost:8080`. O Nginx do frontend é configurado para encaminhar requisições sob `/api/` para o backend, permitindo que o PWA e a API convivam sob o mesmo origin durante o uso local. O PostgreSQL fica exposto em `localhost:5433` e o pgAdmin, quando habilitado, em `http://localhost:5050`.

## Como executar (Docker Compose)

A forma recomendada de execução é via Docker Compose. O repositório possui um arquivo `.env.compose` como referência e você pode copiar para `.env` ou apontar diretamente no comando do compose.

```bash
cp .env.compose .env
docker compose up --build
```

Para encerrar a pilha:

```bash
docker compose down
```

Caso deseje validar saúde mínima, use `GET http://localhost:8080/actuator/health` para o backend e um endpoint equivalente no frontend caso exista healthcheck configurado no Nginx.

## API e contrato OpenAPI

A especificação OpenAPI fonte está em `docs/api/openapi.yaml` e deve ser tratada como contrato de integração, não como documentação “decorativa”. O Swagger UI, quando habilitado no backend, costuma estar em `http://localhost:8080/swagger-ui/index.html`. Mudanças em endpoints, DTOs e validações devem atualizar o OpenAPI junto com o código.

## Modelo de domínio, status e auditabilidade

O sistema modela a manifestação com um status corrente e um histórico de transições, mantendo rastreabilidade do ciclo de vida. A state machine oficial e as transições permitidas estão documentadas em `docs/domain/state-machine-status.md`. O princípio operacional é manter `current_status` para leitura e indexação e registrar transições em histórico apêndice para auditoria e reconstrução temporal.

## Privacidade, anonimato e LGPD

A plataforma suporta envio anônimo e precisa minimizar risco de reidentificação. A política de anonimato e diretrizes de tratamento de dados pessoais e logs estão detalhadas em `docs/security/politica-anonimato-lgpd.md`. Em termos práticos, quando `anonymous=true`, o backend não deve persistir identificadores diretos do denunciante e a observabilidade deve evitar logar payload bruto, anexos, URLs assinadas e qualquer dado que permita correlação indevida.

## Observabilidade mínima e padrões de log

A observabilidade mínima esperada está em `docs/observability/observabilidade-basica.md`. O backend expõe health via Actuator e deve registrar logs estruturados com `correlationId` para rastreio de ponta a ponta. Métricas e tracing, quando ativados, devem priorizar latência p95, taxa de erro por endpoint, falhas de integração com IZA e órgão destino e falhas de storage de anexos.

## Operação e resposta a incidentes

O runbook oficial está em `docs/runbook/runbook.md` e descreve como diagnosticar e mitigar incidentes envolvendo criação de manifestação, triagem, encaminhamento, anexos e indisponibilidade do banco. Em produção, a prioridade é preservar integridade do caso e evitar duplicidade de encaminhamento, mantendo comportamento degradado quando integrações externas estiverem instáveis.

## Documentação do projeto

A documentação está estruturada em `docs/` e inclui C4 mínimo, ADRs, OpenAPI, ERD, state machine, segurança e operação. O índice e os caminhos oficiais estão descritos em `docs/README.md`, e as imagens renderizadas ficam em `docs/images/rendered/`.

## Licença

MIT. Consulte o arquivo `LICENSE` quando presente no repositório.

## Contato

Para dúvidas ou sugestões, abra uma issue no repositório.
