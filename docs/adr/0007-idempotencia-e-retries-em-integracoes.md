# ADR 0007: Idempotência, timeouts e retries nas integrações (IZA e Órgão Destino)

Status: Aceito  
Data: 2026-01-23

## Contexto

Integrações externas falham. O envio de uma manifestação não pode gerar duplicidade de encaminhamento nem travar o usuário. Requisições podem ser repetidas por timeout, rede ou reenvio do front-end.

## Decisão

1. O endpoint de criação deve ser idempotente por um `client_request_id` (UUID) enviado pelo front-end e persistido junto ao caso; replays retornam o mesmo protocolo.
2. Chamadas para IZA e encaminhamento devem ter timeout explícito e política de retry limitada, com backoff.
3. Encaminhamento deve ser idempotente do lado do nosso sistema: registrar “encaminhamento realizado” e impedir duplicidade por protocolo + destino.

## Consequências

Reduz duplicidade e melhora confiabilidade sob falhas.  
Eleva complexidade (armazenar `client_request_id`, lidar com estados intermediários e eventuais filas/compensações).
