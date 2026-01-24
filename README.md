# Desafio Participa DF (CGDF) - Categoria Ouvidoria

## Participa DF Ouvidoria Mobile (PWA)

Esta solução implementa uma versão **PWA mobile-first** para o Participa DF (Ouvidoria), com foco em **inclusão**, **multicanalidade**, **anonimato opcional**, **emissão automática de protocolo**, **consulta pública por protocolo** e **aderência às diretrizes de acessibilidade (WCAG 2.1 AA)**, conforme os requisitos do **Edital nº 10/2025 (1º Hackathon em Controle Social: Desafio Participa DF)**.

O repositório foi estruturado para ser **testável do zero** via Docker Compose, com documentação operacional e arquitetural suficiente para uma avaliação técnica objetiva, além de facilitar evolução e manutenção.

### Vídeo de demonstração (obrigatório pelo edital)

Link do vídeo (até 7 minutos): **COLE_AQUI_O_LINK_PUBLICO**  
O vídeo deve demonstrar: fluxo completo de manifestação, uso de múltiplos canais (texto, áudio, imagem, vídeo) e recursos de acessibilidade.

---

## Como esta proposta atende ao edital

O edital, na categoria Ouvidoria, exige uma solução PWA com multicanalidade (texto, áudio, imagem, vídeo), emissão de protocolo, anonimato opcional, acessibilidade conforme WCAG e integração com a arquitetura do Participa DF e com a IA IZA (triagem).

### Requisitos funcionais principais (Ouvidoria)

A aplicação cobre os fluxos centrais do serviço de ouvidoria:

- **Registro de manifestação** com dados essenciais e validações
- **Envio anônimo opcional**, com diretrizes de minimização de dados
- **Emissão automática de protocolo**
- **Consulta pública por protocolo**, sem autenticação para o cidadão
- **Linha do tempo de status** para rastreabilidade do atendimento
- **Anexos multicanal**: texto, áudio gravado, upload de imagem e upload de vídeo
- **Experiência mobile-first** e “instalável” como PWA

### Acessibilidade (WCAG 2.1 AA)

A solução inclui práticas de acessibilidade para melhorar inclusão e usabilidade, tais como:

- navegação por teclado e foco visível nos fluxos principais
- regiões ARIA para anúncios dinâmicos (ex.: confirmação, erros e feedback)
- componentes acessíveis via Radix UI (base do shadcn/ui)
- painel de acessibilidade (preferências como contraste e tamanho de fonte)
- textos alternativos em imagens relevantes do layout

Observação importante: WCAG 2.1 AA é uma meta de conformidade que deve ser verificada por inspeção manual e ferramentas automatizadas. Este repositório inclui base estrutural e componentes acessíveis para suportar essa validação.

---

## Arquitetura (C4 mínimo)

A arquitetura está documentada em `docs/c4/` e as visões principais estão renderizadas em PNG para leitura imediata.

![C4 Contexto](docs/images/rendered/contexto.png)

![C4 Containers](docs/images/rendered/containers.png)

### Visão de implementação, destacando tecnologias reais do projeto

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  Frontend (PWA)                              │
│                                                                              │
│  UI e acessibilidade: shadcn/ui (Radix UI) + lucide-react + sonner            │
│  Estilo: Tailwind CSS + tailwind-merge + class-variance-authority            │
│  Roteamento: react-router-dom                                                 │
│  Estado: zustand                                                             │
│  Dados e cache: @tanstack/react-query                                         │
│  Formulários e validação: react-hook-form + zod + @hookform/resolvers         │
│  Mapa: mapbox-gl                                                              │
│  PWA: prompt/gestão de instalação, comportamento offline (cache/queue)        │
│                                                                              │
│  Runtime: Nginx serve SPA/PWA e faz proxy same-origin para /api/*             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                               Backend (API Ouvidoria)                        │
│                                                                              │
│  Linguagem: Java 21                                                          │
│  Framework: Spring Boot (Web, Validation, Security)                           │
│  Persistência: Spring Data JPA + PostgreSQL Driver                            │
│  Migrações: Flyway                                                            │
│  OpenAPI/Swagger UI: springdoc-openapi                                        │
│  Observabilidade: Spring Boot Actuator                                        │
│  DTO mapping: MapStruct                                                      │
│  Autenticação: JWT (jjwt)                                                    │
│                                                                              │
│  Domínio: manifestação (ombudsman), status atual + histórico de status        │
│  Anexos: persistência por URL/Key, evitando binário no banco                  │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                             Persistência e serviços externos                  │
│                                                                              │
│  Banco: PostgreSQL 16 (com migrações versionadas)                             │
│  IZA (triagem): preparado no domínio e documentação para acoplar resultado    │
│  Órgão destino: integração prevista por contrato e runbook                    │
│  Storage de anexos: padrão S3/Blob/local documentado (URLs/Keys)              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Nota sobre IZA (triagem)

O edital menciona integração com a IA IZA. Este repositório já possui:

- modelagem de domínio para armazenar resultado de triagem no caso
- ADR de decisão sobre persistência do resultado (triagem embutida no registro principal)
- contrato OpenAPI prevendo o campo de resultado/identificador de triagem no payload de criação

A chamada direta ao serviço externo de triagem pode ser acoplada no backend ou no frontend, dependendo do modelo de integração disponibilizado pela organização. O projeto foi estruturado para manter esse acoplamento controlado e substituível.

---

## Fluxo principal (envio anônimo) e evidências

O diagrama de sequência do envio anônimo está renderizado em PNG para facilitar inspeção durante a avaliação.

![Sequência: Envio de Notificação Anônima](docs/images/rendered/seq-envio-notificacao-anonima.png)

Resumo do comportamento esperado:

- o cidadão cria uma manifestação podendo marcar como anônima
- a aplicação valida campos obrigatórios e registra localização quando aplicável
- anexos podem ser adicionados (imagem, áudio, vídeo)
- o backend registra o caso, gera protocolo, registra status inicial e retorna `201`
- o cidadão acompanha o andamento por protocolo sem autenticação

---

## Como rodar e testar (avaliadores)

### Pré-requisitos

- Docker
- Docker Compose

### Subir o ambiente completo

Na raiz do repositório:

```bash
cp .env.compose .env
docker compose up --build
```

### Serviços e portas

- Frontend (PWA via Nginx): http://localhost:8081
- Backend (API Spring Boot): http://localhost:8080
- PostgreSQL: localhost:5433
- pgAdmin (opcional): http://localhost:5050

### Healthchecks rápidos

- Front: `GET http://localhost:8081/health`
- Backend: `GET http://localhost:8080/actuator/health`

### Roteamento e proxy (same-origin)

O Nginx do frontend encaminha:

- `/api/*` para `backend:8080`
- `/swagger-ui/*` para `backend:8080`
- `/v3/api-docs/*` para `backend:8080`
- `/actuator/*` para `backend:8080`

Isso reduz atrito na avaliação, pois evita CORS no uso local e permite abrir UI e API sob o mesmo host.

---

## Roteiro de teste em até 7 minutos (sugestão para o vídeo)

1. abrir o PWA em modo responsivo (simulando celular)
2. iniciar “Nova manifestação”
3. preencher descrição e campos principais
4. marcar como anônima
5. selecionar localização no mapa
6. anexar um áudio gravado e uma imagem (e opcionalmente um vídeo)
7. enviar e capturar o protocolo gerado
8. abrir a tela de consulta por protocolo e confirmar o status e a linha do tempo
9. demonstrar 2 pontos de acessibilidade: navegação por teclado, anúncios ARIA e painel de acessibilidade

---

## API (contrato e endpoints principais)

A especificação OpenAPI está em `docs/api/openapi.yaml`.

- Swagger UI (local): http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON (local): http://localhost:8080/v3/api-docs

Principais endpoints:

- Criar manifestação: `POST /api/v1/ombudsmans`
- Consultar por protocolo (público): `GET /api/v1/ombudsmans/by-protocol/{protocolNumber}`
- Atualizar status: `PATCH /api/v1/ombudsmans/{id}/status`
- Auth (operador): `/api/v1/auth/*`
- Usuários (operador): `/api/v1/users/*`

---

## Banco de dados e migrações

O PostgreSQL é inicializado via container e o backend aplica migrações automaticamente com Flyway.

- migrações estão versionadas e devem ser tratadas como “forward-only”
- anexos são armazenados por referência (URL/Key) e não como binário no banco

---

## Privacidade, anonimato e LGPD (ponto forte)

Uma proposta competitiva para ouvidoria precisa reduzir risco de reidentificação e evitar coleta excessiva.

Este repositório inclui política e decisões arquiteturais para:

- minimizar dados pessoais quando `anonymous=true`
- separar anexos do banco, persistindo somente referência
- evitar logging de payloads e URLs sensíveis
- orientar retenção e auditoria de eventos relevantes

Documentos relacionados:

- `docs/security/politica-anonimato-lgpd.md`
- `docs/adr/0002-anonimato-e-minimizacao-de-dados.md`
- `docs/adr/0005-anexos-por-url-key-e-storage-fora-do-banco.md`

---

## Observabilidade e operação (runbook)

Para avaliação técnica e sustentabilidade, o projeto inclui:

- observabilidade mínima com Actuator e padrões de log
- runbook com sintomas, diagnóstico e mitigação
- ADRs explicando decisões e tradeoffs

Documentos relacionados:

- `docs/observability/observabilidade-basica.md`
- `docs/runbook/runbook.md`
- `docs/adr/`

---

## Estrutura de pastas

```text
.
├── frontend/                 # PWA (Vite + React + TS) + Nginx runtime
├── backend/                  # API (Java 21 + Spring Boot)
├── db/                       # scripts e artefatos auxiliares de banco
├── docker-compose.yml        # orquestração local
├── docs/                     # documentação do projeto (C4, ADR, OpenAPI, runbook)
│   ├── c4/
│   ├── api/
│   ├── domain/
│   ├── security/
│   ├── observability/
│   ├── runbook/
│   └── images/rendered/      # PNGs renderizados (C4, sequência, etc.)
└── .env.compose              # exemplo de variáveis de ambiente
```

---

## Uso de Inteligência Artificial (transparência)

O edital permite uso de IA desde que documentado.

Se houve uso de IA no desenvolvimento, documentar aqui:

- modelos utilizados
- bibliotecas e serviços
- finalidade (ex.: apoio a prototipagem, geração de documentação, revisão de código)
- cuidados adotados (privacidade, ausência de dados pessoais reais, validação humana)

---

## Licença

MIT, quando o arquivo `LICENSE` estiver presente no repositório.

---

## Contato

Para dúvidas e melhorias, abrir issue no repositório.
