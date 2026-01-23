# ADR 0002: Anonimato, minimização de dados e observabilidade segura

Status: Aceito  
Data: 2026-01-23

## Contexto

O sistema permite envio de manifestação anônima. O maior risco técnico é reidentificação indireta via logs, metadados de anexos, headers, IP, correlação de eventos e armazenamento de dados pessoais “por conveniência”.

## Decisão

Quando `anonymous=true`, o sistema não deve persistir dados pessoais do denunciante (nome, email, telefone) como parte do caso.  
O sistema pode manter apenas o mínimo necessário para operação, rastreabilidade e auditoria, evitando qualquer campo que identifique diretamente o cidadão.

Na observabilidade:

1. Logs devem ser estruturados e usar um `correlation_id` gerado no backend.
2. Logs não podem conter payload bruto do request de criação, nem URLs assinadas, nem conteúdo de anexos.
3. Para suporte ao usuário, a consulta por protocolo deve ser suficiente para rastrear o caso sem expor identidade.

## Consequências

Reduz risco de vazamento e facilita conformidade com privacidade.  
Depuração fica menos “conveniente” (sem payload completo no log), exigindo melhor disciplina de métricas, tracing e IDs de correlação.
