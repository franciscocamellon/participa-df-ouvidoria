# ADR 0006: Relacionamentos por UUID como soft-FK no domínio (sem constraint física inicial)

Status: Aceito  
Data: 2026-01-23

## Contexto

O modelo atual usa UUIDs para relacionar `destination_agency_id`, `changed_by_user_id` e outros vínculos. Aplicar constraints de FK no banco melhora integridade, mas pode conflitar com migrações rápidas, seeds e dados legados.

## Decisão

Manter inicialmente relacionamentos como UUID (soft-FK), garantindo integridade na camada de serviço (validação do UUID existir quando necessário).  
As constraints físicas (FKs) serão consideradas em uma fase posterior, quando o schema estiver estável e quando não houver dependência de dados legados inconsistentes.

## Consequências

Migrações mais flexíveis no curto prazo.  
Maior risco de inconsistência se a camada de serviço falhar ou for contornada; exige testes e validações consistentes.  
Planejar um ADR futuro para “hardening” do schema com FKs e índices.
