# ADR 0003: Modelo de status e histórico de transições

Status: Aceito  
Data: 2026-01-23

## Contexto

Manifestações mudam de estado (recebida, encaminhada, em análise, finalizada, etc.). É necessário garantir auditabilidade e reconstrução do estado no tempo.

## Decisão

Persistir:

1. `current_status` no registro principal para leitura rápida e indexação.
2. `status_history` como histórico apêndice (append-only), registrando `status`, `changed_at`, `note` e `changed_by` quando aplicável.

Transições devem ser validadas por uma política central (state machine) no serviço de domínio, e não espalhadas em controllers.

## Consequências

Permite auditoria e debugging do fluxo ao longo do tempo.  
Aumenta custo de modelagem (manter consistência entre `current_status` e histórico), exigindo testes de integração e invariantes.
