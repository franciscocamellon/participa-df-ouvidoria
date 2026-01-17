// Type definitions for waste management module

export type WasteTypeId = 
  | 'descarte_irregular'
  | 'ponto_viciado'
  | 'entulho_volumosos'
  | 'organicos'
  | 'reciclaveis_mistos'
  | 'papel'
  | 'plastico'
  | 'vidro'
  | 'metal'
  | 'eletroeletronicos'
  | 'outros';

export type WasteSeverityId = 'leve' | 'moderado' | 'grave' | 'critico';

export type WasteVolumeId = 'pequeno' | 'medio' | 'grande' | 'muito_grande';

export type WasteRiskId = 'nenhum' | 'baixo' | 'medio' | 'alto';

export type WasteRecurrenceId = 'primeira_vez' | 'ocasional' | 'frequente' | 'cronico';

export type WasteStatusId = 
  | 'novo'
  | 'triado'
  | 'agendado'
  | 'em_rota'
  | 'coletado'
  | 'encaminhado'
  | 'reciclado'
  | 'fechado';

export type RecyclableAvailabilityId = 'imediata' | 'agendada' | 'periodica';

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface WasteStatusHistoryEntry {
  status: WasteStatusId;
  timestamp: Date;
  note?: string;
  responsibleId?: string;
  evidenceUrl?: string;
}

// Waste report (problem/issue)
export interface WasteReport {
  id: string;
  type: WasteTypeId;
  description: string;
  coordinates: Coordinates;
  address?: string;
  region?: string;
  severity: WasteSeverityId;
  volume: WasteVolumeId;
  risk: WasteRiskId;
  recurrence: WasteRecurrenceId;
  photoUrl?: string;
  status: WasteStatusId;
  statusHistory: WasteStatusHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Recyclable offer (opportunity)
export interface RecyclableOffer {
  id: string;
  type: WasteTypeId;
  description: string;
  coordinates: Coordinates;
  address?: string;
  companyName: string;
  contactInfo?: string;
  volume: WasteVolumeId;
  recurrence: WasteRecurrenceId;
  availability: RecyclableAvailabilityId;
  photoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface WasteReportFormData {
  type: WasteTypeId | '';
  description: string;
  severity: WasteSeverityId;
  volume: WasteVolumeId;
  risk: WasteRiskId;
  recurrence: WasteRecurrenceId;
  photo?: File;
}

export interface RecyclableOfferFormData {
  type: WasteTypeId | '';
  description: string;
  companyName: string;
  contactInfo: string;
  volume: WasteVolumeId;
  recurrence: WasteRecurrenceId;
  availability: RecyclableAvailabilityId;
  photo?: File;
}
