# Observabilidade básica (logs, métricas e tracing)

Data: 2026-01-23

Este documento define o mínimo de observabilidade para operar o sistema com segurança, sem violar anonimato.

## 1) Logs estruturados
Formato recomendado: JSON (um evento por linha).

Campos mínimos:
- `timestamp` (ISO-8601)
- `level`
- `service` (ex.: ouvidoria-api)
- `environment` (dev/stg/prod)
- `correlationId`
- `requestId` (se houver no gateway)
- `method`, `path`, `statusCode`, `durationMs`
- `protocolNumber` (quando disponível) ou `ombudsmanId`
- `errorClass`, `errorMessage` (sem dados sensíveis), `stacktrace` (em nível adequado)

Regras:
- não logar payload completo de criação;
- não logar URLs assinadas e anexos;
- mascarar tokens e secrets.

## 2) Métricas (Prometheus ou equivalente)
Recomendações mínimas:
- HTTP:
  - `http_server_requests_total` (por rota, status, método)
  - `http_server_requests_seconds` (latência p50/p95/p99)
- Negócio:
  - `ombudsman_created_total`
  - `ombudsman_create_failed_total`
  - `ombudsman_forwarded_total`
  - `ombudsman_forward_failed_total`
  - `ombudsman_triage_failed_total`
- Dependências:
  - `iza_requests_total`, `iza_request_duration_seconds`, `iza_errors_total`
  - `forwarding_requests_total`, `forwarding_request_duration_seconds`, `forwarding_errors_total`
- Banco:
  - conexões ativas no pool
  - tempo de query (se instrumentado)
- Storage:
  - upload/download sucesso/erro

## 3) Tracing distribuído
Se houver gateway + API + integrações:
- Propagar `traceparent` (W3C) e manter `correlationId` coerente.
- Spans recomendados:
  - `POST /ombudsmans`
  - `IzaTriageClient.call`
  - `ForwardingClient.call`
  - operações principais no DB (persist/update)

## 4) Alertas (mínimo “adulto”)
- API:
  - taxa de 5xx > 1% por 5–10 min
  - latência p95 > limiar (definir)
- Integrações:
  - IZA error rate > 5% por 10 min
  - Encaminhamento error rate > 5% por 10 min
- DB:
  - conexões no pool próximo do limite
  - deadlocks ou long queries
- Segurança/abuso:
  - spikes de requests por IP/rota
  - tentativas repetidas de login

## 5) Dashboards essenciais
- Visão geral: RPS, erro, latência, top rotas
- Criação de manifestações: volume, falhas, tempo médio
- Integrações: latência e erro IZA/Encaminhamento
- Banco: pool e latência
- Anexos: sucesso/erro de upload

## 6) Checklist de privacidade
Antes de promover qualquer log/trace novo:
- ele revela identidade em casos anônimos?
- ele inclui dados pessoais ou anexos?
- ele expõe URLs assinadas ou tokens?
