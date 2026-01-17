// Application Configuration
// All configurable values should be defined here

export const mapConfig = {
  // Default center at -15.7971748, -47.8921653
  defaultCenter: {
    lng: -47.8921653,
    lat: -15.7971748,
  },
  defaultZoom: 17,
  maxZoom: 19,
  minZoom: 10,
  // Bounding box for the area of interest
  bounds: {
    sw: { lng: -47.92, lat: -15.82 },
    ne: { lng: -47.85, lat: -15.77 },
  },
  style: 'mapbox://styles/mapbox/light-v11',
};

export const occurrenceCategories = [
  {
    id: 'URBAN_MAINTENANCE',
    label: 'Zeladoria e limpeza urbana',
    icon: 'broom',
    color: '#0891b2',
    description: 'Lixo acumulado, necessidade de varrição, mato alto',
  },
  {
    id: 'LIGHTING',
    label: 'Iluminação pública',
    icon: 'lightbulb',
    color: '#f59e0b',
    description: 'Postes apagados, lâmpadas queimadas, fiação exposta',
  },
  {
    id: 'WASTE_DISPOSAL',
    label: 'Descarte irregular',
    icon: 'trash',
    color: '#dc2626',
    description: 'Entulho, móveis descartados, resíduos volumosos',
  },
  {
    id: 'URBAN_FURNITURE',
    label: 'Danos ao mobiliário urbano',
    icon: 'construction',
    color: '#7c3aed',
    description: 'Bancos, lixeiras, placas danificadas',
  },
  {
    id: 'INCIDENT',
    label: 'Incidente urbano de baixa complexidade',
    icon: 'alert-triangle',
    color: '#ea580c',
    description: 'Situações pontuais que requerem atenção',
  },
  {
    id: 'ACCESSIBILITY',
    label: 'Acessibilidade e calçadas',
    icon: 'accessibility',
    color: '#0284c7',
    description: 'Rampas, calçadas irregulares, obstáculos',
  },
  {
    id: 'VULNERABILITY',
    label: 'Vulnerabilidade social e encaminhamento',
    icon: 'heart-handshake',
    color: '#be185d',
    description: 'Pessoas em situação de vulnerabilidade',
  },
  {
    id: 'ENVIRONMENTAL',
    label: 'Risco ambiental urbano',
    icon: 'tree-deciduous',
    color: '#16a34a',
    description: 'Árvores em risco, alagamentos, erosão',
  },
] as const;

export const occurrenceStatuses = [
  {
    id: 'RECEIVED',
    label: 'Recebido',
    description: 'Seu registro foi recebido e está aguardando análise inicial.',
    color: '#64748b',
  },
  {
    id: 'TRIAGE',
    label: 'Em triagem',
    description: 'Estamos avaliando a melhor forma de encaminhar sua solicitação.',
    color: '#0891b2',
  },
  {
    id: 'FORWARDED',
    label: 'Encaminhado',
    description: 'Sua solicitação foi direcionada ao órgão ou equipe responsável.',
    color: '#7c3aed',
  },
  {
    id: 'IN_EXECUTION',
    label: 'Em execução',
    description: 'A equipe responsável está trabalhando na resolução.',
    color: '#f59e0b',
  },
  {
    id: 'COMPLETED',
    label: 'Concluído',
    description: 'A situação foi resolvida. Obrigado por contribuir!',
    color: '#16a34a',
  },
  {
    id: 'SCHEDULED',
    label: 'Sem ação imediata / Programado',
    description: 'Esta situação foi avaliada e será tratada em momento oportuno ou já está contemplada em planejamento existente.',
    color: '#94a3b8',
  },
] as const;

export const urgencyLevels = [
  {
    id: 'LOW',
    label: 'Baixa',
    description: 'Pode aguardar alguns dias',
    color: '#16a34a',
  },
  {
    id: 'MEDIUM',
    label: 'Média',
    description: 'Requer atenção em breve',
    color: '#f59e0b',
  },
  {
    id: 'HIGH',
    label: 'Alta',
    description: 'Necessita atenção prioritária',
    color: '#dc2626',
  },
] as const;

// Camera sources configuration
export const cameraSources = [
  {
    id: 'cam-01',
    name: 'Praça Central - Vista Norte',
    coordinates: { longitude: -47.8830, latitude: -15.7935, approxAddress: '' },
    streamUrl: null, // When null, shows fallback
    externalUrl: 'https://www.skylinewebcams.com/',
    status: 'online',
  },
  {
    id: 'cam-02',
    name: 'Estação de Metrô',
    coordinates: { longitude: -47.8815, latitude: -15.7950, approxAddress: '' },
    streamUrl: null,
    externalUrl: 'https://www.skylinewebcams.com/',
    status: 'online',
  },
  {
    id: 'cam-03',
    name: 'Área Comercial',
    coordinates: { longitude: -47.8840, latitude: -15.7945, approxAddress: '' },
    streamUrl: null,
    externalUrl: 'https://www.skylinewebcams.com/',
    status: 'maintenance',
  },
] as const;

export const appInfo = {
  name: 'Mediação Territorial Integrada',
  version: '1.0.0-pilot',
  emergencyDisclaimer: 'Esta plataforma NÃO é canal de emergência. Em situações de risco, ligue 190 (Polícia), 193 (Bombeiros) ou 192 (SAMU).',
  privacyNote: 'Seus dados são tratados com respeito à LGPD. Não compartilhamos informações pessoais sem consentimento.',
};
