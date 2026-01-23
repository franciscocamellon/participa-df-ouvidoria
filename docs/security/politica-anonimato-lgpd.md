# Política de anonimato e LGPD (Ouvidoria)

Data: 2026-01-23

Este documento descreve as regras mínimas para garantir **anonimato**, **minimização de dados** e conformidade operacional com princípios da **LGPD**, considerando o fluxo de manifestações no Participa-DF Ouvidoria.

## 1) Objetivo
Garantir que o sistema permita envio de manifestações **anônimas** sem risco evitável de reidentificação e que qualquer tratamento de dados pessoais seja restrito ao necessário, com controles técnicos e operacionais.

## 2) Definições
- **Manifestação anônima**: caso em que o cidadão opta por `anonymous=true`. O sistema não deve armazenar campos de identificação direta do cidadão como parte do caso.
- **Dados pessoais**: informação relacionada a pessoa natural identificada ou identificável (inclui identificadores diretos e indiretos).
- **Reidentificação**: combinação de informações (logs, IP, anexos, localizações detalhadas) que pode revelar a identidade.

## 3) Regras de minimização e armazenamento

### 3.1 Quando `anonymous=true`
- **Proibido persistir** no registro do caso: nome, e-mail, telefone, documento, qualquer identificador direto.
- **Evitar persistir**: endereço detalhado; preferir `approxAddress` (aproximado) e coordenadas com precisão adequada ao caso (avaliar necessidade).
- Anexos: tratar como potencialmente contendo PII. Não extrair nem indexar conteúdo automaticamente sem justificativa e controles.

### 3.2 Quando `anonymous=false`
- Persistir apenas os campos necessários para retorno/contato, quando o produto exigir.
- Separar dados do denunciante em estrutura própria (ex.: `reporter_identity`) se e quando o backend realmente usar esse modelo, com controle de acesso mais restrito.

## 4) Logs, auditoria e observabilidade segura
- **Nunca** logar:
  - payload completo do request de criação;
  - conteúdo de anexos;
  - URLs assinadas (se usadas);
  - dados pessoais (nome, e-mail, telefone).
- **Sempre** logar:
  - `correlationId` por requisição (gerado no backend);
  - `protocolNumber` quando disponível (ou `ombudsmanId` interno);
  - `endpoint`, `statusCode`, tempo de execução, origem do erro (classe/método) sem dados sensíveis.
- Auditoria: transições de status devem registrar `changedByUserId` quando operador autenticado.

## 5) Controle de acesso (RBAC)
- Endpoints administrativos (listar casos, alterar status, consultar detalhes) exigem autenticação e papel adequado.
- Endpoints públicos devem ser minimizados e protegidos contra abuso:
  - rate limit;
  - evitar listagens públicas; preferir consulta por protocolo.

## 6) Retenção e descarte
Definir e aplicar políticas de retenção por:
- **Dados de casos** (metadados + histórico).
- **Anexos** (storage externo): prazo e critérios de expurgo (por exemplo: após X meses de conclusão).
- **Logs**: retenção mínima necessária para operação e auditoria, com rotação e controle de acesso.

## 7) Direitos do titular e atendimento
Mesmo com anonimato, o sistema deve permitir:
- consulta do estado por `protocolNumber`;
- explicação sobre o que é armazenado e por quanto tempo;
- canal para solicitações formais (quando houver base legal e identificação necessária).

## 8) Segurança técnica mínima
- Criptografia em trânsito (HTTPS) e em repouso (DB/storage quando disponível).
- Secrets fora do repositório (vault/variáveis de ambiente).
- Upload seguro: validar tamanho, tipo, extensão permitida, e preferir varredura antimalware no pipeline quando possível.
- Proteção contra enumeração do protocolo: formato não sequencial + rate limit.

## 9) Incidentes de segurança
Qualquer suspeita de vazamento ou reidentificação deve acionar:
1) contenção (reduzir exposição, bloquear acessos, rotacionar segredos se necessário);
2) preservação de evidências (logs e artefatos);
3) análise de impacto e correções;
4) registro formal do incidente e lições aprendidas.
