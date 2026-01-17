import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WasteReport, RecyclableOffer, WasteStatusId } from '@/types/waste';

// Mock data for rich visual mockup
const mockWasteReports: WasteReport[] = [
  {
    id: 'waste-001',
    type: 'descarte_irregular',
    description: 'Grande quantidade de sacos de lixo descartados na esquina, bloqueando parcialmente a calçada.',
    coordinates: { lng: -47.8915, lat: -15.7965 },
    address: 'Rua das Flores, 123 - Setor Comercial Sul',
    region: 'SCS Quadra 2',
    severity: 'moderado',
    volume: 'medio',
    risk: 'baixo',
    recurrence: 'frequente',
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    status: 'triado',
    statusHistory: [
      { status: 'novo', timestamp: new Date('2024-01-15T08:30:00'), note: 'Registro recebido via aplicativo' },
      { status: 'triado', timestamp: new Date('2024-01-15T10:15:00'), note: 'Classificado como prioridade média', responsibleId: 'func-001' },
    ],
    createdAt: new Date('2024-01-15T08:30:00'),
    updatedAt: new Date('2024-01-15T10:15:00'),
    userId: 'user-001',
  },
  {
    id: 'waste-002',
    type: 'entulho_volumosos',
    description: 'Entulho de construção e móveis velhos abandonados no terreno baldio.',
    coordinates: { lng: -47.8925, lat: -15.7978 },
    address: 'Av. Principal, 456 - Asa Sul',
    region: 'Asa Sul',
    severity: 'grave',
    volume: 'grande',
    risk: 'medio',
    recurrence: 'cronico',
    photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    status: 'agendado',
    statusHistory: [
      { status: 'novo', timestamp: new Date('2024-01-14T14:00:00'), note: 'Registro recebido' },
      { status: 'triado', timestamp: new Date('2024-01-14T16:30:00'), note: 'Requer caçamba especial' },
      { status: 'agendado', timestamp: new Date('2024-01-15T09:00:00'), note: 'Coleta agendada para 17/01', responsibleId: 'func-002' },
    ],
    createdAt: new Date('2024-01-14T14:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00'),
    userId: 'user-002',
  },
  {
    id: 'waste-003',
    type: 'ponto_viciado',
    description: 'Local com descarte irregular constante, próximo ao ponto de ônibus.',
    coordinates: { lng: -47.8935, lat: -15.7955 },
    address: 'Quadra 5, Lote 10 - SCS',
    region: 'SCS Quadra 5',
    severity: 'critico',
    volume: 'muito_grande',
    risk: 'alto',
    recurrence: 'cronico',
    status: 'em_rota',
    statusHistory: [
      { status: 'novo', timestamp: new Date('2024-01-13T07:00:00') },
      { status: 'triado', timestamp: new Date('2024-01-13T09:00:00'), note: 'Prioridade máxima' },
      { status: 'agendado', timestamp: new Date('2024-01-14T08:00:00') },
      { status: 'em_rota', timestamp: new Date('2024-01-15T11:30:00'), note: 'Equipe Alpha a caminho', responsibleId: 'func-003' },
    ],
    createdAt: new Date('2024-01-13T07:00:00'),
    updatedAt: new Date('2024-01-15T11:30:00'),
    userId: 'user-003',
  },
  {
    id: 'waste-004',
    type: 'eletroeletronicos',
    description: 'Monitores e CPUs antigos descartados próximo à lixeira comum.',
    coordinates: { lng: -47.8905, lat: -15.7940 },
    address: 'Rua do Comércio, 789',
    severity: 'moderado',
    volume: 'pequeno',
    risk: 'medio',
    recurrence: 'primeira_vez',
    status: 'coletado',
    statusHistory: [
      { status: 'novo', timestamp: new Date('2024-01-12T15:00:00') },
      { status: 'triado', timestamp: new Date('2024-01-12T17:00:00') },
      { status: 'agendado', timestamp: new Date('2024-01-13T08:00:00') },
      { status: 'em_rota', timestamp: new Date('2024-01-14T10:00:00') },
      { status: 'coletado', timestamp: new Date('2024-01-14T11:30:00'), note: 'Coletado e enviado para reciclagem', evidenceUrl: 'https://example.com/evidence.jpg' },
    ],
    createdAt: new Date('2024-01-12T15:00:00'),
    updatedAt: new Date('2024-01-14T11:30:00'),
    userId: 'user-001',
  },
  {
    id: 'waste-005',
    type: 'organicos',
    description: 'Restos de feira acumulados há dias, gerando mau cheiro.',
    coordinates: { lng: -47.8895, lat: -15.7988 },
    address: 'Feira Livre - Quadra 8',
    severity: 'grave',
    volume: 'grande',
    risk: 'medio',
    recurrence: 'frequente',
    status: 'novo',
    statusHistory: [
      { status: 'novo', timestamp: new Date('2024-01-15T12:00:00'), note: 'Registro recebido' },
    ],
    createdAt: new Date('2024-01-15T12:00:00'),
    updatedAt: new Date('2024-01-15T12:00:00'),
    userId: 'user-004',
  },
];

const mockRecyclableOffers: RecyclableOffer[] = [
  {
    id: 'offer-001',
    type: 'papel',
    description: 'Papelão e papel de escritório acumulado, aproximadamente 200kg por semana.',
    coordinates: { lng: -47.8880, lat: -15.7950 },
    address: 'Edifício Empresarial Alpha, Asa Sul',
    companyName: 'Alpha Comércio LTDA',
    contactInfo: 'contato@alpha.com.br | (61) 3333-4444',
    volume: 'grande',
    recurrence: 'frequente',
    availability: 'periodica',
    isActive: true,
    createdAt: new Date('2024-01-10T10:00:00'),
    updatedAt: new Date('2024-01-10T10:00:00'),
    userId: 'empresa-001',
  },
  {
    id: 'offer-002',
    type: 'plastico',
    description: 'Garrafas PET e embalagens plásticas limpas, coleta semanal.',
    coordinates: { lng: -47.8945, lat: -15.7935 },
    address: 'Restaurante Sabor & Cia, SCS',
    companyName: 'Sabor & Cia Restaurantes',
    contactInfo: '(61) 9999-8888',
    volume: 'medio',
    recurrence: 'frequente',
    availability: 'periodica',
    isActive: true,
    createdAt: new Date('2024-01-08T14:00:00'),
    updatedAt: new Date('2024-01-08T14:00:00'),
    userId: 'empresa-002',
  },
  {
    id: 'offer-003',
    type: 'metal',
    description: 'Latas de alumínio compactadas, disponível para coleta imediata.',
    coordinates: { lng: -47.8860, lat: -15.7970 },
    address: 'Galpão Industrial, Setor de Indústrias',
    companyName: 'MetalRecicla',
    volume: 'muito_grande',
    recurrence: 'cronico',
    availability: 'imediata',
    isActive: true,
    createdAt: new Date('2024-01-05T08:00:00'),
    updatedAt: new Date('2024-01-15T08:00:00'),
    userId: 'empresa-003',
  },
];

interface WasteState {
  wasteReports: WasteReport[];
  recyclableOffers: RecyclableOffer[];
  addWasteReport: (report: Omit<WasteReport, 'id' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>) => void;
  addRecyclableOffer: (offer: Omit<RecyclableOffer, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => void;
  updateWasteStatus: (id: string, status: WasteStatusId, note?: string) => void;
  deleteWasteReport: (id: string) => void;
  deleteRecyclableOffer: (id: string) => void;
}

export const useWasteStore = create<WasteState>()(
  persist(
    (set) => ({
      wasteReports: mockWasteReports,
      recyclableOffers: mockRecyclableOffers,
      
      addWasteReport: (reportData) => {
        const now = new Date();
        const newReport: WasteReport = {
          ...reportData,
          id: `waste-${Date.now()}`,
          status: 'novo',
          statusHistory: [{ status: 'novo', timestamp: now, note: 'Registro recebido via aplicativo' }],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          wasteReports: [newReport, ...state.wasteReports],
        }));
      },
      
      addRecyclableOffer: (offerData) => {
        const now = new Date();
        const newOffer: RecyclableOffer = {
          ...offerData,
          id: `offer-${Date.now()}`,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          recyclableOffers: [newOffer, ...state.recyclableOffers],
        }));
      },
      
      updateWasteStatus: (id, status, note) => {
        set((state) => ({
          wasteReports: state.wasteReports.map((report) =>
            report.id === id
              ? {
                  ...report,
                  status,
                  statusHistory: [
                    ...report.statusHistory,
                    { status, timestamp: new Date(), note },
                  ],
                  updatedAt: new Date(),
                }
              : report
          ),
        }));
      },
      
      deleteWasteReport: (id) => {
        set((state) => ({
          wasteReports: state.wasteReports.filter((r) => r.id !== id),
        }));
      },
      
      deleteRecyclableOffer: (id) => {
        set((state) => ({
          recyclableOffers: state.recyclableOffers.filter((o) => o.id !== id),
        }));
      },
    }),
    {
      name: 'mediacao-waste-v1',
    }
  )
);
