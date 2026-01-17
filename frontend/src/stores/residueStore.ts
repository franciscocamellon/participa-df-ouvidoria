import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResidueReport, ReuseOffer, ResidueStatusId } from '@/types/residue';

// Mock data for visual demonstration
const mockResidueReports: ResidueReport[] = [
  {
    id: 'res-001',
    type: 'reciclavel',
    origin: 'via_publica',
    description: 'Materiais recicláveis acumulados próximo ao ponto de ônibus.',
    coordinates: { lng: -47.8915, lat: -15.7965 },
    approximateAddress: 'Setor Comercial Sul, Quadra 2',
    volume: 'medio',
    condition: 'acumulado',
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    status: 'em_analise',
    statusHistory: [
      { status: 'registrado', timestamp: new Date('2024-01-15T08:30:00'), note: 'Registro recebido' },
      { status: 'em_analise', timestamp: new Date('2024-01-15T10:15:00'), note: 'Em avaliação pela equipe técnica' },
    ],
    createdAt: new Date('2024-01-15T08:30:00'),
    updatedAt: new Date('2024-01-15T10:15:00'),
    userId: 'user-001',
  },
  {
    id: 'res-002',
    type: 'entulho',
    origin: 'via_publica',
    description: 'Entulho de construção depositado em terreno baldio.',
    coordinates: { lng: -47.8925, lat: -15.7978 },
    approximateAddress: 'Asa Sul, proximidades da 308',
    volume: 'grande',
    condition: 'recorrente',
    status: 'programado',
    statusHistory: [
      { status: 'registrado', timestamp: new Date('2024-01-14T14:00:00') },
      { status: 'em_analise', timestamp: new Date('2024-01-14T16:30:00') },
      { status: 'programado', timestamp: new Date('2024-01-15T09:00:00'), note: 'Incluído na programação semanal' },
    ],
    createdAt: new Date('2024-01-14T14:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00'),
    userId: 'user-002',
  },
  {
    id: 'res-003',
    type: 'volumoso',
    origin: 'domiciliar',
    description: 'Móveis antigos aguardando descarte adequado.',
    coordinates: { lng: -47.8935, lat: -15.7955 },
    approximateAddress: 'SCS Quadra 5',
    volume: 'grande',
    condition: 'acumulado',
    status: 'registrado',
    statusHistory: [
      { status: 'registrado', timestamp: new Date('2024-01-15T11:30:00'), note: 'Aguardando análise' },
    ],
    createdAt: new Date('2024-01-15T11:30:00'),
    updatedAt: new Date('2024-01-15T11:30:00'),
    userId: 'user-003',
  },
  {
    id: 'res-004',
    type: 'verde',
    origin: 'via_publica',
    description: 'Galhos e folhas de poda acumulados.',
    coordinates: { lng: -47.8905, lat: -15.7940 },
    approximateAddress: 'Quadra 3, próximo à praça',
    volume: 'medio',
    condition: 'acumulado',
    status: 'coletado',
    statusHistory: [
      { status: 'registrado', timestamp: new Date('2024-01-12T15:00:00') },
      { status: 'em_analise', timestamp: new Date('2024-01-12T17:00:00') },
      { status: 'programado', timestamp: new Date('2024-01-13T08:00:00') },
      { status: 'coletado', timestamp: new Date('2024-01-14T11:30:00'), note: 'Coletado pela equipe de poda' },
    ],
    createdAt: new Date('2024-01-12T15:00:00'),
    updatedAt: new Date('2024-01-14T11:30:00'),
    userId: 'user-001',
  },
  {
    id: 'res-005',
    type: 'domiciliar',
    origin: 'via_publica',
    description: 'Sacos de lixo fora do horário de coleta.',
    coordinates: { lng: -47.8895, lat: -15.7988 },
    approximateAddress: 'Quadra 8, em frente ao comércio',
    volume: 'pequeno',
    condition: 'espalhado',
    status: 'registrado',
    statusHistory: [
      { status: 'registrado', timestamp: new Date('2024-01-15T12:00:00') },
    ],
    createdAt: new Date('2024-01-15T12:00:00'),
    updatedAt: new Date('2024-01-15T12:00:00'),
    userId: 'user-004',
  },
];

const mockReuseOffers: ReuseOffer[] = [
  {
    id: 'reuse-001',
    materialType: 'papel',
    description: 'Papelão e papel de escritório, aproximadamente 200kg por semana.',
    coordinates: { lng: -47.8880, lat: -15.7950 },
    approximateAddress: 'Edifício Empresarial, Asa Sul',
    organizationName: 'Empresa Alpha LTDA',
    contactInfo: 'sustentabilidade@alpha.com.br',
    estimatedQuantity: '150-200 kg/semana',
    interest: 'doacao',
    availability: 'periodica',
    isActive: true,
    createdAt: new Date('2024-01-10T10:00:00'),
    updatedAt: new Date('2024-01-10T10:00:00'),
    userId: 'empresa-001',
  },
  {
    id: 'reuse-002',
    materialType: 'plastico',
    description: 'Garrafas PET e embalagens plásticas limpas.',
    coordinates: { lng: -47.8945, lat: -15.7935 },
    approximateAddress: 'Restaurante SCS',
    organizationName: 'Restaurante Sabor & Cia',
    contactInfo: '(61) 9999-8888',
    estimatedQuantity: '50-80 kg/semana',
    interest: 'doacao',
    availability: 'periodica',
    isActive: true,
    createdAt: new Date('2024-01-08T14:00:00'),
    updatedAt: new Date('2024-01-08T14:00:00'),
    userId: 'empresa-002',
  },
  {
    id: 'reuse-003',
    materialType: 'metal',
    description: 'Latas de alumínio e sucata metálica.',
    coordinates: { lng: -47.8860, lat: -15.7970 },
    approximateAddress: 'Setor de Indústrias',
    organizationName: 'Galpão Industrial',
    estimatedQuantity: '300+ kg disponível',
    interest: 'logistica_reversa',
    availability: 'imediata',
    isActive: true,
    createdAt: new Date('2024-01-05T08:00:00'),
    updatedAt: new Date('2024-01-15T08:00:00'),
    userId: 'empresa-003',
  },
];

interface ResidueState {
  residueReports: ResidueReport[];
  reuseOffers: ReuseOffer[];
  addResidueReport: (report: Omit<ResidueReport, 'id' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>) => void;
  addReuseOffer: (offer: Omit<ReuseOffer, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => void;
  updateResidueStatus: (id: string, status: ResidueStatusId, note?: string) => void;
  deleteResidueReport: (id: string) => void;
  deleteReuseOffer: (id: string) => void;
}

export const useResidueStore = create<ResidueState>()(
  persist(
    (set) => ({
      residueReports: mockResidueReports,
      reuseOffers: mockReuseOffers,
      
      addResidueReport: (reportData) => {
        const now = new Date();
        const newReport: ResidueReport = {
          ...reportData,
          id: `res-${Date.now()}`,
          status: 'registrado',
          statusHistory: [{ 
            status: 'registrado', 
            timestamp: now, 
            note: 'Registro recebido. Será analisado pela equipe técnica.' 
          }],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          residueReports: [newReport, ...state.residueReports],
        }));
      },
      
      addReuseOffer: (offerData) => {
        const now = new Date();
        const newOffer: ReuseOffer = {
          ...offerData,
          id: `reuse-${Date.now()}`,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          reuseOffers: [newOffer, ...state.reuseOffers],
        }));
      },
      
      updateResidueStatus: (id, status, note) => {
        set((state) => ({
          residueReports: state.residueReports.map((report) =>
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
      
      deleteResidueReport: (id) => {
        set((state) => ({
          residueReports: state.residueReports.filter((r) => r.id !== id),
        }));
      },
      
      deleteReuseOffer: (id) => {
        set((state) => ({
          reuseOffers: state.reuseOffers.filter((o) => o.id !== id),
        }));
      },
    }),
    {
      name: 'mediacao-residuos-v2',
    }
  )
);
