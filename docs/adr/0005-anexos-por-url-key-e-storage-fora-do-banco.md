# ADR 0005: Anexos armazenados em storage externo e referenciados por URL/Key

Status: Aceito  
Data: 2026-01-23

## Contexto

Anexos podem ser grandes e potencialmente perigosos (payload malicioso, PII em imagens, etc.). Guardar binário no banco aumenta custo, impacta backups e dificulta escalar. Também há necessidade de validação e controle de acesso.

## Decisão

Armazenar anexos em storage externo (S3/Blob/local compatível) e persistir apenas referência (`url`/`key`) no banco, vinculada ao caso.  
A API deve:

1. validar tamanho, MIME, extensão permitida e contagem de anexos;
2. preferir URLs assinadas/temporárias quando houver download;
3. nunca logar URLs assinadas nem metadados sensíveis de arquivos.

## Consequências

Escala melhor e reduz impacto no banco e nos backups.  
Exige componente de storage confiável e política clara de expiração/assinatura de URLs, além de tratamento de indisponibilidade do storage.
