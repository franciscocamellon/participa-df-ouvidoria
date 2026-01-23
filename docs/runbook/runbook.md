# Runbook — Participa-DF Ouvidoria (Produção)

Versão: 1.0  
Data: 2026-01-23  
Escopo: Backend/API, banco PostgreSQL, storage de anexos, integrações (IZA e Órgão Destino), observabilidade.

## 1) Objetivo e Princípios

Este runbook descreve como operar, diagnosticar e recuperar o sistema Participa-DF Ouvidoria em produção, com foco em confiabilidade, integridade do fluxo de manifestações e proteção de anonimato.  
Princípios: não logar dados pessoais nem payload completo; sempre usar `protocolNumber` e `correlationId` para rastreamento; mudanças em produção via release e migração versionada.

## 2) Visão geral do sistema

Fluxo crítico: Usuário cria manifestação (anônima ou identificada) -> persistência -> status inicial -> triagem (IZA) -> definição de órgão -> encaminhamento -> atualização de status/histórico -> retorno de protocolo.  
Dependências externas: serviço de triagem (IZA), órgão destino (encaminhamento), storage de anexos.

Componentes:

- Front-end (Web/App): chama a API
- API Ouvidoria (Spring Boot): regras de negócio e integrações
- PostgreSQL: persistência
- Storage: anexos por URL/Key
- IZA: triagem
- Órgão destino: recebimento do encaminhamento

## 3) Checklist de Saúde (triagem rápida)

Quando houver suspeita de incidente, execute nesta ordem:

### 3.1 API (saúde básica)

1. Verificar processo/containers em execução (orquestrador/VM)
2. Verificar endpoint de health (se existir) ou chamada simples em endpoint público:
   - Criar um caso de teste em ambiente de staging, nunca em produção.
3. Verificar logs recentes por erro 5xx e spikes.

### 3.2 Banco de dados

1. Conectividade (ping/psql) e latência
2. Pool de conexões (se exposto por métrica)
3. Migrações: confirmar se última migração aplicada corresponde ao release

### 3.3 Integrações externas

1. IZA: tempo de resposta e taxa de erro
2. Encaminhamento: tempo de resposta e taxa de erro
3. Storage: upload/download e permissões

### 3.4 Sintoma -> hipótese

- 5xx na criação: validação/bug/regressão, DB indisponível, storage/IZA travando, timeout.
- Criação funciona mas sem triagem: falha no IZA, timeout, fallback não implementado.
- Protocolo gerado mas não encaminha: falha no órgão destino, idempotência ausente, status travado.
- Anexo “some”: storage key inválida, expiração de URL assinada, política de permissão.

## 4) Sinais e Alarmes (o que monitorar)

Métricas recomendadas (se não existirem, são backlog obrigatório):

- Taxa de requisições por endpoint (RPS) e latência p95/p99
- Taxa de erros 4xx/5xx
- Criação de manifestação: contagem e taxa de falha
- Integrações:
  - IZA: latência p95 + taxa de falha
  - Encaminhamento: latência p95 + taxa de falha
- Banco: conexões ativas, deadlocks, long queries, CPU/IO
- Storage: falhas de upload/download
- Segurança: spikes de requests por IP (abuso/bruteforce), tentativas de enumeração de protocolo

Logs:

- Sempre logar `correlationId`, `protocolNumber` (quando houver), `endpoint`, `statusCode`.
- Nunca logar payload completo, dados pessoais, nem URLs assinadas.

## 5) Procedimentos de Diagnóstico (passo a passo)

### 5.1 Diagnosticar falha ao criar manifestação (POST /ombudsmans)

1. Confirmar sintomas: usuários reportam erro? qual status HTTP?
2. Buscar logs por `correlationId` (se disponível) ou janela de tempo + endpoint
3. Separar por classe:
   - 400: validação (cliente) — checar mensagens de erro
   - 401/403: configuração de segurança — regressão de permissões
   - 500: bug/infra
4. Se 500:
   - verificar stacktrace (sem payload) e causa raiz (DB/timeout/external)
   - verificar DB: conexões e query lenta
   - verificar integrações: IZA e storage
5. Mitigação:
   - se integração externa indisponível, habilitar comportamento degradado (ver seção 6.2)
   - se DB indisponível, fail fast e acionar DBA/infra

### 5.2 Diagnosticar “triagem não preenchida” (iza\_\* nulos)

1. Consultar um caso afetado por `protocolNumber`
2. Verificar logs do `IzaTriageClient`
3. Confirmar latência e taxa de erro do IZA
4. Se IZA fora:
   - garantir que criação não dependa de triagem para responder (degradação aceitável)
   - registrar status como RECEIVED e executar triagem assíncrona quando IZA voltar (se existir suporte)

### 5.3 Diagnosticar “não encaminhou para órgão destino”

1. Consultar caso por protocolo e verificar `currentStatus` e histórico
2. Verificar logs do `ForwardingClient` por `protocolNumber`
3. Se falha:
   - confirmar timeouts/retries
   - verificar se há idempotência (para evitar encaminho duplicado)
4. Mitigação:
   - reprocessar encaminhamento manualmente (se existir endpoint/admin tool)
   - se não existir ferramenta, registrar incidente e aplicar hotfix com job/retry controlado

### 5.4 Diagnosticar problema com anexos

Sintomas:

- upload falha
- URLs inválidas
- download 403/404

Passos:

1. Confirmar se o erro acontece no upload (client->storage) ou no acesso posterior
2. Checar permissões e credenciais do storage
3. Se URLs são assinadas:
   - confirmar expiração e clock drift
4. Confirmar se o banco está armazenando `attachmentUrls` coerentes
   Mitigação:

- caso seja expiração de URL, mudar para `key` + geração de URL assinada sob demanda
- caso seja permissão, corrigir IAM/política do bucket/contêiner

### 5.5 Diagnosticar falhas de autenticação (Auth)

1. Confirmar endpoint: /auth/login ou endpoint protegido
2. Se 401 no login:
   - credenciais erradas? usuário bloqueado? senha expirada?
3. Se 401/403 em endpoints:
   - verificar configuração de security / roles
   - verificar se token expira e refresh está funcional
     Mitigação:

- se regressão pós-release, rollback
- se chaves JWT rotacionadas sem coordenação, alinhar segredos/config

## 6) Respostas a Incidentes (Mitigações rápidas)

### 6.1 DB degradado/indisponível

Objetivo: proteger integridade do dado e evitar corrupção.
Ações:

- Se indisponível: retornar 503 rapidamente; desabilitar qualquer “retry infinito” na API.
- Acionar infra/DBA, verificar consumo de CPU/IO e conexões.
- Se migração travou: congelar deploys; aplicar rollback do schema somente se houver plano (preferir forward-fix).

### 6.2 Dependência externa fora (IZA ou Órgão Destino)

IZA fora:

- Manter criação do caso funcionando sem triagem.
- Persistir caso com status RECEIVED e campos iza\_\* vazios.
- Registrar evento de falha (métrica) e permitir reprocesso posterior.

Órgão destino fora:

- Não perder o caso.
- Persistir caso e marcar status “FORWARDING_PENDING” (se existir) ou manter em RECEIVED com nota de falha.
- Garantir idempotência para não duplicar encaminhamento quando o serviço retornar.

### 6.3 Pico de abuso/ataque (rate spike, enumeração de protocolo)

Ações imediatas:

- aplicar rate limit no gateway/reverse proxy (por IP e por rota crítica)
- bloquear IPs abusivos temporariamente
- ativar WAF rules para padrões de brute-force
- revisar se endpoints públicos expõem listagem indevida
  Pós-incidente:
- exigir token ou captcha para rotas públicas sensíveis
- reforçar formato do protocolo (não sequencial) e limites de consulta

### 6.4 Vazamento potencial de dados/anonimato

Ações:

- tratar como incidente de segurança
- congelar logs/artefatos (preservação)
- revisar imediatamente logs e rastrear exfiltração
- rotacionar segredos se necessário
- comunicar responsáveis (privacidade/segurança)

## 7) Operações de Release

Checklist de deploy:

1. Confirmar versão do artefato e changelog
2. Aplicar migrações (Flyway/Liquibase) antes ou junto ao deploy conforme estratégia
3. Warm-up de endpoints (se aplicável)
4. Smoke test:
   - login (staging)
   - criação de caso (staging)
   - consulta por protocolo (staging)
5. Monitorar p95 e 5xx por 15–30 minutos após release

Rollback:

- Preferir rollback de aplicação para versão anterior se schema for compatível.
- Se schema incompatível, executar estratégia de forward-fix (novo deploy corrigindo).

## 8) Manutenção de Dados (consulta e suporte)

Regras:

- Suporte deve localizar casos por `protocolNumber`, nunca por dados pessoais em modo anônimo.
- Nunca copiar payload de casos em tickets sem mascaramento.
- Exportações e dumps devem ser restritos e auditados.

Consultas úteis (exemplos; adaptar ao schema real):

- Buscar caso por protocolo:
  SELECT id, protocol_number, current_status, created_at
  FROM ombudsman
  WHERE protocol_number = :protocol;

- Ver histórico:
  SELECT status, changed_at, note
  FROM ombudsman_status_history
  WHERE ombudsman_id = :id
  ORDER BY stage;

## 9) Ações Preventivas (backlog operacional obrigatório)

- Implementar /health e /metrics (Prometheus)
- Implementar tracing/correlationId end-to-end
- Implementar idempotência por client_request_id na criação
- Implementar state machine explícita de status
- Endurecer schema com FKs e índices quando estabilizar
- Estratégia formal de retenção de anexos e expiração de URLs

## 10) Contatos e Responsabilidades

Definir no repositório/Confluence:

- On-call primário (backend)
- On-call infra/DBA
- Responsável por segurança/privacidade
- Responsável por integração com órgãos externos
