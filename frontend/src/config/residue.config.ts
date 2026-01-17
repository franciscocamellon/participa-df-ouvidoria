// Residue Management Module Configuration
// Aligned with PNRS and municipal governance best practices

export const residueTypes = [
  {
    id: 'domiciliar',
    label: 'Resíduo domiciliar',
    icon: 'home',
    color: '#64748b',
    description: 'Resíduos gerados em residências, não recicláveis',
    infoOnly: false,
  },
  {
    id: 'reciclavel',
    label: 'Resíduo reciclável',
    icon: 'recycle',
    color: '#0891b2',
    description: 'Papel, plástico, vidro, metal e outros recicláveis',
    infoOnly: false,
  },
  {
    id: 'volumoso',
    label: 'Resíduo volumoso',
    icon: 'sofa',
    color: '#7c3aed',
    description: 'Móveis, colchões e itens de grande porte',
    infoOnly: false,
  },
  {
    id: 'entulho',
    label: 'Entulho de construção',
    icon: 'construction',
    color: '#ea580c',
    description: 'Restos de obras, reformas e demolições',
    infoOnly: false,
  },
  {
    id: 'verde',
    label: 'Resíduo verde (poda)',
    icon: 'tree-deciduous',
    color: '#16a34a',
    description: 'Galhos, folhas, aparas de jardim',
    infoOnly: false,
  },
  {
    id: 'perigoso',
    label: 'Resíduo perigoso',
    icon: 'alert-triangle',
    color: '#dc2626',
    description: 'Pilhas, baterias, lâmpadas, óleo (apenas informativo)',
    infoOnly: true,
  },
] as const;

export const residueOrigins = [
  {
    id: 'domiciliar',
    label: 'Domiciliar',
    description: 'Origem residencial',
  },
  {
    id: 'via_publica',
    label: 'Via pública',
    description: 'Encontrado em rua, calçada ou área pública',
  },
  {
    id: 'comercio',
    label: 'Comércio',
    description: 'Origem comercial ou estabelecimento',
  },
] as const;

export const residueConditions = [
  {
    id: 'acumulado',
    label: 'Acumulado',
    description: 'Concentrado em um ponto específico',
  },
  {
    id: 'espalhado',
    label: 'Espalhado',
    description: 'Disperso pela área',
  },
  {
    id: 'recorrente',
    label: 'Recorrente',
    description: 'Problema frequente neste local',
  },
] as const;

export const residueVolumes = [
  {
    id: 'pequeno',
    label: 'Pequeno',
    description: 'Cabe em sacos de lixo comuns',
    visualHint: '📦',
  },
  {
    id: 'medio',
    label: 'Médio',
    description: 'Equivalente a um carrinho de mão',
    visualHint: '📦📦',
  },
  {
    id: 'grande',
    label: 'Grande',
    description: 'Requer veículo utilitário',
    visualHint: '📦📦📦',
  },
  {
    id: 'muito_grande',
    label: 'Muito grande',
    description: 'Requer caçamba ou caminhão',
    visualHint: '📦📦📦📦',
  },
] as const;

export const residueStatuses = [
  {
    id: 'registrado',
    label: 'Registrado',
    color: '#3b82f6', // Blue - information
    description: 'Seu registro foi recebido e será analisado.',
  },
  {
    id: 'em_analise',
    label: 'Em análise',
    color: '#f59e0b', // Yellow - processing
    description: 'A equipe técnica está avaliando o registro.',
  },
  {
    id: 'programado',
    label: 'Programado',
    color: '#8b5cf6', // Purple - scheduled
    description: 'Ação programada conforme planejamento municipal.',
  },
  {
    id: 'coletado',
    label: 'Coletado',
    color: '#22c55e', // Green - resolved
    description: 'Resíduo foi coletado ou situação resolvida.',
  },
  {
    id: 'arquivado',
    label: 'Arquivado',
    color: '#94a3b8', // Gray - archived
    description: 'Registro arquivado após análise.',
  },
] as const;

export const reuseInterests = [
  {
    id: 'doacao',
    label: 'Doação',
    description: 'Material disponível para doação',
  },
  {
    id: 'troca',
    label: 'Troca',
    description: 'Interesse em permutar por outro material',
  },
  {
    id: 'logistica_reversa',
    label: 'Logística reversa',
    description: 'Retorno ao fabricante ou cadeia produtiva',
  },
] as const;

export const reuseAvailability = [
  {
    id: 'imediata',
    label: 'Imediata',
    description: 'Disponível para retirada agora',
  },
  {
    id: 'agendada',
    label: 'Agendada',
    description: 'Disponível em data específica',
  },
  {
    id: 'periodica',
    label: 'Periódica',
    description: 'Disponível regularmente',
  },
] as const;

export const recyclableMaterials = [
  { id: 'papel', label: 'Papel e papelão', color: '#2563eb' },
  { id: 'plastico', label: 'Plástico', color: '#0ea5e9' },
  { id: 'vidro', label: 'Vidro', color: '#06b6d4' },
  { id: 'metal', label: 'Metal', color: '#64748b' },
  { id: 'eletronico', label: 'Eletrônicos', color: '#7c3aed' },
  { id: 'organico', label: 'Orgânicos (compostagem)', color: '#16a34a' },
  { id: 'outros', label: 'Outros materiais', color: '#94a3b8' },
] as const;

// Institutional messaging
export const institutionalMessages = {
  citizenRole: 'O cidadão registra, informa e sinaliza situações.',
  governmentRole: 'O poder público analisa, prioriza e executa as ações.',
  partnerRole: 'Parceiros podem ofertar reaproveitamento de materiais.',
  notEmergency: 'Este canal não substitui serviços emergenciais.',
  noGuarantee: 'O registro não garante coleta imediata.',
  dataUse: 'Os dados são utilizados para priorização, planejamento e transparência.',
  privacyNote: 'Sua localização exata não é exibida publicamente.',
  dangerousNote: 'Para resíduos perigosos, procure pontos de coleta específicos ou entre em contato com a prefeitura.',
} as const;
