# ADR 0001: Registro de decisões arquiteturais (ADR)

Status: Aceito  
Data: 2026-01-23

## Contexto

O projeto evolui rápido, envolve integrações (triagem/encaminhamento), requisitos sensíveis (anonimato) e mudanças no modelo de dados. Sem registro explícito das decisões, o time perde contexto, repete debates e introduz regressões.

## Decisão

Adotar ADRs como mecanismo oficial para registrar decisões arquiteturais relevantes.  
Cada ADR deve conter: Status, Data, Contexto, Decisão, Consequências e Alternativas consideradas (quando aplicável).  
ADRs devem ser versionados junto ao código e revisados via PR.

## Consequências

Melhora rastreabilidade e reduz retrabalho.  
Impõe disciplina mínima de documentação, mas diminui custo de onboarding e de manutenção.
