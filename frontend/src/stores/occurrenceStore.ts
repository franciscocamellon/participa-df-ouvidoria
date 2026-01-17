import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Occurrence, OccurrenceFormData, Coordinates, OccurrenceStatusId } from '@/types/occurrence';

interface OccurrenceState {
  occurrences: Occurrence[];
  selectedOccurrence: Occurrence | null;
  isCreating: boolean;
  pendingCoordinates: Coordinates | null;
  
  // Actions
  addOccurrence: (data: OccurrenceFormData, coordinates: Coordinates) => Occurrence;
  deleteOccurrence: (id: string) => void;
  updateOccurrenceDescription: (id: string, description: string) => void;
  updateOccurrenceStatus: (id: string, status: OccurrenceStatusId, note?: string) => void;
  selectOccurrence: (occurrence: Occurrence | null) => void;
  setIsCreating: (isCreating: boolean) => void;
  setPendingCoordinates: (coordinates: Coordinates | null) => void;
  getUserOccurrences: (userId: string) => Occurrence[];
}

// Generate unique ID
const generateId = () => `occ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Mock user ID for demo purposes
export const DEMO_USER_ID = 'user_demo_001';

// Mock data - pre-populated occurrences around coordinate -15.7971748, -47.8921653
const mockOccurrences: Occurrence[] = [
  {
    id: 'occ_mock_001',
    category: 'LIGHTING',
    description: 'Poste de iluminação apagado há mais de uma semana. Área fica muito escura à noite, gerando insegurança.',
    coordinates: { longitude: -47.8925, latitude: -15.7968, approxAddress: ''  },
    urgency: 'HIGH',
    currentStatus: 'FORWARDED',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-10T08:30:00'), note: 'Registro criado pelo cidadão.' },
      { status: 'TRIAGE', timestamp: new Date('2024-01-10T14:15:00'), note: 'Em análise pela equipe de triagem.' },
      { status: 'FORWARDED', timestamp: new Date('2024-01-11T09:00:00'), note: 'Encaminhado para CEB - Companhia Energética de Brasília.' },
    ],
    createdAt: new Date('2024-01-10T08:30:00'),
    updatedAt: new Date('2024-01-11T09:00:00'),
    userId: DEMO_USER_ID,
    privacyConsent: true,
  },
  {
    id: 'occ_mock_002',
    category: 'ACCESSIBILITY',
    description: 'Rampa de acessibilidade danificada na calçada. Cadeirantes não conseguem passar com segurança.',
    coordinates: { longitude: -47.8918, latitude: -15.7975, approxAddress: ''  },
    urgency: 'HIGH',
    currentStatus: 'IN_EXECUTION',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-08T10:00:00'), note: 'Registro criado pelo cidadão.' },
      { status: 'TRIAGE', timestamp: new Date('2024-01-08T15:30:00'), note: 'Prioridade alta devido a impacto em acessibilidade.' },
      { status: 'FORWARDED', timestamp: new Date('2024-01-09T08:00:00'), note: 'Encaminhado para Secretaria de Obras.' },
      { status: 'IN_EXECUTION', timestamp: new Date('2024-01-12T10:00:00'), note: 'Equipe de manutenção iniciou os reparos.' },
    ],
    createdAt: new Date('2024-01-08T10:00:00'),
    updatedAt: new Date('2024-01-12T10:00:00'),
    userId: DEMO_USER_ID,
    privacyConsent: true,
  },
  {
    id: 'occ_mock_003',
    category: 'WASTE_DISPOSAL',
    description: 'Acúmulo de entulho e resíduos de construção na calçada. Obstruindo a passagem de pedestres.',
    coordinates: { longitude: -47.8930, latitude: -15.7980, approxAddress: ''  },
    urgency: 'MEDIUM',
    currentStatus: 'TRIAGE',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-14T14:00:00'), note: 'Registro criado pelo cidadão.' },
      { status: 'TRIAGE', timestamp: new Date('2024-01-14T16:30:00'), note: 'Avaliando melhor encaminhamento.' },
    ],
    createdAt: new Date('2024-01-14T14:00:00'),
    updatedAt: new Date('2024-01-14T16:30:00'),
    userId: 'user_demo_002',
    privacyConsent: true,
  },
  {
    id: 'occ_mock_004',
    category: 'URBAN_MAINTENANCE',
    description: 'Lixeiras transbordando e mato alto na área verde. Necessita limpeza urgente.',
    coordinates: { longitude: -47.8912, latitude: -15.7965, approxAddress: ''  },
    urgency: 'MEDIUM',
    currentStatus: 'COMPLETED',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-05T09:00:00'), note: 'Registro criado pelo cidadão.' },
      { status: 'TRIAGE', timestamp: new Date('2024-01-05T11:00:00'), note: 'Encaminhamento rápido.' },
      { status: 'FORWARDED', timestamp: new Date('2024-01-05T14:00:00'), note: 'Encaminhado para SLU.' },
      { status: 'IN_EXECUTION', timestamp: new Date('2024-01-06T08:00:00'), note: 'Equipe de limpeza no local.' },
      { status: 'COMPLETED', timestamp: new Date('2024-01-06T12:00:00'), note: 'Limpeza realizada com sucesso.' },
    ],
    createdAt: new Date('2024-01-05T09:00:00'),
    updatedAt: new Date('2024-01-06T12:00:00'),
    userId: DEMO_USER_ID,
    privacyConsent: true,
  },
  {
    id: 'occ_mock_005',
    category: 'URBAN_FURNITURE',
    description: 'Banco de praça quebrado e com parafusos expostos. Risco de acidente para usuários.',
    coordinates: { longitude: -47.8935, latitude: -15.7972, approxAddress: ''  },
    urgency: 'MEDIUM',
    currentStatus: 'RECEIVED',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-15T11:30:00'), note: 'Registro criado pelo cidadão.' },
    ],
    createdAt: new Date('2024-01-15T11:30:00'),
    updatedAt: new Date('2024-01-15T11:30:00'),
    userId: 'user_demo_003',
    privacyConsent: true,
  },
  {
    id: 'occ_mock_006',
    category: 'VULNERABILITY',
    description: 'Pessoa em situação de rua necessitando de acolhimento. Localizada próximo ao ponto de ônibus.',
    coordinates: { longitude: -47.8908, latitude: -15.7978, approxAddress: ''  },
    urgency: 'HIGH',
    currentStatus: 'FORWARDED',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-13T07:00:00'), note: 'Registro criado pelo cidadão.' },
      { status: 'TRIAGE', timestamp: new Date('2024-01-13T08:30:00'), note: 'Prioridade para atendimento social.' },
      { status: 'FORWARDED', timestamp: new Date('2024-01-13T09:00:00'), note: 'Encaminhado para equipe de Assistência Social.' },
    ],
    createdAt: new Date('2024-01-13T07:00:00'),
    updatedAt: new Date('2024-01-13T09:00:00'),
    userId: DEMO_USER_ID,
    privacyConsent: true,
  },
  {
    id: 'occ_mock_007',
    category: 'ENVIRONMENTAL',
    description: 'Árvore com galhos secos ameaçando cair sobre a calçada. Risco para pedestres.',
    coordinates: { longitude: -47.8940, latitude: -15.7960, approxAddress: ''  },
    urgency: 'HIGH',
    currentStatus: 'IN_EXECUTION',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-11T16:00:00'), note: 'Registro criado pelo cidadão.' },
      { status: 'TRIAGE', timestamp: new Date('2024-01-11T17:00:00'), note: 'Urgente - risco de queda.' },
      { status: 'FORWARDED', timestamp: new Date('2024-01-12T08:00:00'), note: 'Encaminhado para NOVACAP.' },
      { status: 'IN_EXECUTION', timestamp: new Date('2024-01-14T09:00:00'), note: 'Equipe de poda agendada.' },
    ],
    createdAt: new Date('2024-01-11T16:00:00'),
    updatedAt: new Date('2024-01-14T09:00:00'),
    userId: 'user_demo_002',
    privacyConsent: true,
  },
  {
    id: 'occ_mock_008',
    category: 'INCIDENT',
    description: 'Bueiro sem tampa na via. Sinalização improvisada pelos moradores.',
    coordinates: { longitude: -47.8922, latitude: -15.7985, approxAddress: ''  },
    urgency: 'HIGH',
    currentStatus: 'COMPLETED',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-07T13:00:00'), note: 'Registro criado pelo cidadão.' },
      { status: 'TRIAGE', timestamp: new Date('2024-01-07T13:30:00'), note: 'Emergência - risco de acidentes.' },
      { status: 'FORWARDED', timestamp: new Date('2024-01-07T14:00:00'), note: 'Encaminhado para CAESB.' },
      { status: 'IN_EXECUTION', timestamp: new Date('2024-01-07T16:00:00'), note: 'Equipe no local.' },
      { status: 'COMPLETED', timestamp: new Date('2024-01-07T18:00:00'), note: 'Tampa substituída.' },
    ],
    createdAt: new Date('2024-01-07T13:00:00'),
    updatedAt: new Date('2024-01-07T18:00:00'),
    userId: DEMO_USER_ID,
    privacyConsent: true,
  },
  {
    id: 'occ_mock_009',
    category: 'LIGHTING',
    description: 'Três postes consecutivos sem funcionamento na passarela. Área perigosa à noite.',
    coordinates: { longitude: -47.8915, latitude: -15.7958, approxAddress: ''  },
    urgency: 'HIGH',
    currentStatus: 'SCHEDULED',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-09T19:00:00'), note: 'Registro criado pelo cidadão.' },
      { status: 'TRIAGE', timestamp: new Date('2024-01-10T09:00:00'), note: 'Avaliado pela equipe.' },
      { status: 'SCHEDULED', timestamp: new Date('2024-01-10T14:00:00'), note: 'Incluído no cronograma de manutenção preventiva da CEB para próxima semana.' },
    ],
    createdAt: new Date('2024-01-09T19:00:00'),
    updatedAt: new Date('2024-01-10T14:00:00'),
    userId: 'user_demo_003',
    privacyConsent: true,
  },
  {
    id: 'occ_mock_010',
    category: 'ACCESSIBILITY',
    description: 'Calçada com piso tátil danificado em frente ao comércio local.',
    coordinates: { longitude: -47.8928, latitude: -15.7950, approxAddress: ''  },
    urgency: 'MEDIUM',
    currentStatus: 'TRIAGE',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-15T08:00:00'), note: 'Registro criado pelo cidadão.' },
      { status: 'TRIAGE', timestamp: new Date('2024-01-15T10:00:00'), note: 'Em análise para encaminhamento.' },
    ],
    createdAt: new Date('2024-01-15T08:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
    userId: DEMO_USER_ID,
    privacyConsent: true,
  },
  {
    id: 'occ_mock_011',
    category: 'WASTE_DISPOSAL',
    description: 'Descarte irregular de móveis velhos próximo à esquina. Atrai vetores.',
    coordinates: { longitude: -47.8905, latitude: -15.7970, approxAddress: ''  },
    urgency: 'MEDIUM',
    currentStatus: 'RECEIVED',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-16T09:00:00'), note: 'Registro criado pelo cidadão.' },
    ],
    createdAt: new Date('2024-01-16T09:00:00'),
    updatedAt: new Date('2024-01-16T09:00:00'),
    userId: DEMO_USER_ID,
    privacyConsent: true,
  },
  {
    id: 'occ_mock_012',
    category: 'URBAN_MAINTENANCE',
    description: 'Falta de manutenção na área verde. Mato alto dificultando visibilidade.',
    coordinates: { longitude: -47.8945, latitude: -15.7968, approxAddress: '' },
    urgency: 'LOW',
    currentStatus: 'FORWARDED',
    statusHistory: [
      { status: 'RECEIVED', timestamp: new Date('2024-01-12T14:00:00'), note: 'Registro criado pelo cidadão.' },
      { status: 'TRIAGE', timestamp: new Date('2024-01-12T16:00:00'), note: 'Avaliado pela equipe.' },
      { status: 'FORWARDED', timestamp: new Date('2024-01-13T09:00:00'), note: 'Encaminhado para equipe de zeladoria.' },
    ],
    createdAt: new Date('2024-01-12T14:00:00'),
    updatedAt: new Date('2024-01-13T09:00:00'),
    userId: 'user_demo_002',
    privacyConsent: true,
  },
];

export const useOccurrenceStore = create<OccurrenceState>()(
  persist(
    (set, get) => ({
      occurrences: mockOccurrences,
      selectedOccurrence: null,
      isCreating: false,
      pendingCoordinates: null,

      addOccurrence: (data, coordinates) => {
        const now = new Date();
        const newOccurrence: Occurrence = {
          id: generateId(),
          category: data.category as Occurrence['category'],
          description: data.description,
          coordinates,
          urgency: data.urgency,
          photoUrl: data.photo ? URL.createObjectURL(data.photo) : undefined,
          currentStatus: 'RECEIVED',
          statusHistory: [
            {
              status: 'RECEIVED',
              timestamp: now,
              note: 'Registro criado pelo cidadão.',
            },
          ],
          createdAt: now,
          updatedAt: now,
          userId: DEMO_USER_ID,
          privacyConsent: data.privacyConsent,
        };

        set((state) => ({
          occurrences: [...state.occurrences, newOccurrence],
          isCreating: false,
          pendingCoordinates: null,
        }));

        return newOccurrence;
      },

      deleteOccurrence: (id) => {
        set((state) => ({
          occurrences: state.occurrences.filter((occ) => occ.id !== id),
          selectedOccurrence: state.selectedOccurrence?.id === id ? null : state.selectedOccurrence,
        }));
      },

      updateOccurrenceDescription: (id, description) => {
        set((state) => ({
          occurrences: state.occurrences.map((occ) =>
            occ.id === id && occ.currentStatus === 'RECEIVED'
              ? { ...occ, description, updatedAt: new Date() }
              : occ
          ),
        }));
      },

      updateOccurrenceStatus: (id, status, note) => {
        set((state) => ({
          occurrences: state.occurrences.map((occ) =>
            occ.id === id
              ? {
                  ...occ,
                  status,
                  statusHistory: [
                    ...occ.statusHistory,
                    { status, timestamp: new Date(), note },
                  ],
                  updatedAt: new Date(),
                }
              : occ
          ),
        }));
      },

      selectOccurrence: (occurrence) => {
        set({ selectedOccurrence: occurrence });
      },

      setIsCreating: (isCreating) => {
        set({ isCreating });
      },

      setPendingCoordinates: (coordinates) => {
        set({ pendingCoordinates: coordinates });
      },

      getUserOccurrences: (userId) => {
        return get().occurrences.filter((occ) => occ.userId === userId);
      },
    }),
    {
      name: 'mediacao-occurrences',
      version: 3, // Increment to reset persisted data with new icons
      partialize: (state) => ({ occurrences: state.occurrences }),
    }
  )
);
