// Waste Management Module Configuration

export const wasteTypes = [
  {
    id: 'descarte_irregular',
    label: 'Descarte irregular em via pública',
    icon: 'trash-2',
    color: '#dc2626',
    description: 'Lixo descartado indevidamente em locais públicos',
  },
  {
    id: 'ponto_viciado',
    label: 'Ponto viciado recorrente',
    icon: 'map-pin-x',
    color: '#b91c1c',
    description: 'Local com descarte irregular frequente',
  },
  {
    id: 'entulho_volumosos',
    label: 'Entulho e volumosos',
    icon: 'package',
    color: '#9333ea',
    description: 'Restos de construção, móveis, eletrodomésticos',
  },
  {
    id: 'organicos',
    label: 'Orgânicos acumulados',
    icon: 'leaf',
    color: '#16a34a',
    description: 'Restos de alimentos, folhas, matéria orgânica',
  },
  {
    id: 'reciclaveis_mistos',
    label: 'Recicláveis mistos',
    icon: 'recycle',
    color: '#0891b2',
    description: 'Materiais recicláveis diversos misturados',
  },
  {
    id: 'papel',
    label: 'Papel e papelão',
    icon: 'file-text',
    color: '#2563eb',
    description: 'Jornais, caixas, papel de escritório',
  },
  {
    id: 'plastico',
    label: 'Plástico',
    icon: 'flask-conical',
    color: '#0ea5e9',
    description: 'Garrafas PET, embalagens plásticas',
  },
  {
    id: 'vidro',
    label: 'Vidro',
    icon: 'wine',
    color: '#06b6d4',
    description: 'Garrafas, potes, vidros em geral',
  },
  {
    id: 'metal',
    label: 'Metal',
    icon: 'circle-dot',
    color: '#64748b',
    description: 'Latas de alumínio, sucata metálica',
  },
  {
    id: 'eletroeletronicos',
    label: 'Eletroeletrônicos',
    icon: 'smartphone',
    color: '#7c3aed',
    description: 'Equipamentos eletrônicos, baterias',
  },
  {
    id: 'outros',
    label: 'Outros',
    icon: 'help-circle',
    color: '#94a3b8',
    description: 'Outros tipos de resíduos',
  },
] as const;

export const wasteSeverityLevels = [
  {
    id: 'leve',
    label: 'Leve',
    color: '#16a34a',
    description: 'Impacto mínimo, pode aguardar',
  },
  {
    id: 'moderado',
    label: 'Moderado',
    color: '#f59e0b',
    description: 'Requer atenção em breve',
  },
  {
    id: 'grave',
    label: 'Grave',
    color: '#ea580c',
    description: 'Impacto significativo, prioridade',
  },
  {
    id: 'critico',
    label: 'Crítico',
    color: '#dc2626',
    description: 'Risco imediato à saúde ou ambiente',
  },
] as const;

export const wasteVolumeLevels = [
  {
    id: 'pequeno',
    label: 'Pequeno',
    description: 'Até 1 saco de lixo (50L)',
  },
  {
    id: 'medio',
    label: 'Médio',
    description: '2-5 sacos ou 1 carrinho de mão',
  },
  {
    id: 'grande',
    label: 'Grande',
    description: 'Mais de 5 sacos ou volume de uma caçamba pequena',
  },
  {
    id: 'muito_grande',
    label: 'Muito grande',
    description: 'Volume de caçamba grande ou mais',
  },
] as const;

export const wasteRiskLevels = [
  {
    id: 'nenhum',
    label: 'Nenhum',
    color: '#64748b',
    description: 'Sem riscos identificados',
  },
  {
    id: 'baixo',
    label: 'Baixo',
    color: '#16a34a',
    description: 'Risco mínimo, precaução básica',
  },
  {
    id: 'medio',
    label: 'Médio',
    color: '#f59e0b',
    description: 'Risco moderado, atenção necessária',
  },
  {
    id: 'alto',
    label: 'Alto',
    color: '#dc2626',
    description: 'Risco significativo à saúde/ambiente',
  },
] as const;

export const wasteRecurrenceLevels = [
  {
    id: 'primeira_vez',
    label: 'Primeira vez',
    description: 'Nunca havia descarte aqui antes',
  },
  {
    id: 'ocasional',
    label: 'Ocasional',
    description: 'Acontece às vezes neste local',
  },
  {
    id: 'frequente',
    label: 'Frequente',
    description: 'Acontece toda semana',
  },
  {
    id: 'cronico',
    label: 'Crônico',
    description: 'Problema constante, ponto viciado',
  },
] as const;

export const wasteStatuses = [
  {
    id: 'novo',
    label: 'Novo',
    color: '#64748b',
    description: 'Registro recebido, aguardando triagem.',
  },
  {
    id: 'triado',
    label: 'Triado',
    color: '#0891b2',
    description: 'Registro avaliado e classificado.',
  },
  {
    id: 'agendado',
    label: 'Agendado',
    color: '#7c3aed',
    description: 'Coleta programada para data específica.',
  },
  {
    id: 'em_rota',
    label: 'Em rota',
    color: '#f59e0b',
    description: 'Equipe a caminho para coleta.',
  },
  {
    id: 'coletado',
    label: 'Coletado',
    color: '#0ea5e9',
    description: 'Material recolhido do local.',
  },
  {
    id: 'encaminhado',
    label: 'Encaminhado',
    color: '#8b5cf6',
    description: 'Enviado para destinação adequada.',
  },
  {
    id: 'reciclado',
    label: 'Reciclado/Tratado',
    color: '#16a34a',
    description: 'Material processado corretamente.',
  },
  {
    id: 'fechado',
    label: 'Fechado',
    color: '#22c55e',
    description: 'Processo concluído com sucesso.',
  },
] as const;

export const recyclableAvailability = [
  {
    id: 'imediata',
    label: 'Imediata',
    description: 'Disponível para coleta agora',
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
