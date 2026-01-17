// Type definitions for Residue Management Module (Resíduos)
// Aligned with PNRS and municipal solid waste governance

export type ResidueTypeId = 
  | 'domiciliar'
  | 'reciclavel'
  | 'volumoso'
  | 'entulho'
  | 'verde'
  | 'perigoso';

export type ResidueOriginId = 'domiciliar' | 'via_publica' | 'comercio';

export type ResidueConditionId = 'acumulado' | 'espalhado' | 'recorrente';

export type ResidueVolumeId = 'pequeno' | 'medio' | 'grande' | 'muito_grande';

export type ResidueStatusId = 
  | 'registrado'
  | 'em_analise'
  | 'programado'
  | 'coletado'
  | 'arquivado';

export type ReuseInterestId = 'doacao' | 'troca' | 'logistica_reversa';

export type ReuseAvailabilityId = 'imediata' | 'agendada' | 'periodica';

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface ResidueStatusHistoryEntry {
  status: ResidueStatusId;
  timestamp: Date;
  note?: string;
  responsibleId?: string;
}

// Residue report (citizen registration)
export interface ResidueReport {
  id: string;
  type: ResidueTypeId;
  origin: ResidueOriginId;
  description: string;
  coordinates: Coordinates;
  approximateAddress?: string;
  volume: ResidueVolumeId;
  condition: ResidueConditionId;
  photoUrl?: string;
  status: ResidueStatusId;
  statusHistory: ResidueStatusHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Reuse offer (private/voluntary opportunity)
export interface ReuseOffer {
  id: string;
  materialType: string;
  description: string;
  coordinates: Coordinates;
  approximateAddress?: string;
  organizationName: string;
  contactInfo?: string;
  estimatedQuantity: string;
  interest: ReuseInterestId;
  availability: ReuseAvailabilityId;
  validUntil?: Date;
  photoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ResidueReportFormData {
  type: ResidueTypeId | '';
  origin: ResidueOriginId;
  description: string;
  volume: ResidueVolumeId;
  condition: ResidueConditionId;
  photo?: File;
}

export interface ReuseOfferFormData {
  materialType: string;
  description: string;
  organizationName: string;
  contactInfo: string;
  estimatedQuantity: string;
  interest: ReuseInterestId;
  availability: ReuseAvailabilityId;
  validUntil?: string;
  photo?: File;
}
