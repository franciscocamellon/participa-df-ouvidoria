# ADR 0004: Persistência de resultado de triagem (IZA) embutida no caso

Status: Aceito  
Data: 2026-01-23

## Contexto

A triagem sugere categoria/órgão com confiança e justificativa. Há duas estratégias: armazenar resultado em uma tabela própria (`iza_triage_results`) ou embutir os campos no registro principal do caso.

## Decisão

Armazenar os campos de triagem como atributos embutidos no registro do caso (por exemplo: `iza_suggested_category`, `iza_suggested_agency_id`, `iza_confidence`, `iza_rationale`).  
A tabela `iza_triage_results` pode existir como legado/planejamento, mas o backend atual não depende dela.

## Consequências

Leitura e escrita ficam simples (um único registro para o caso) e reduz joins.  
Perde-se histórico detalhado de múltiplas triagens sem mudanças adicionais (caso o produto exija re-triagem futura). Se for necessário histórico, será criado um mecanismo explícito de versionamento/histórico de triagem.
