// Type definitions for occurrences and related entities

export type OccurrenceCategoryId = 
  | 'URBAN_MAINTENANCE' //'zeladoria'
  | 'LIGHTING' //'iluminacao'
  | 'WASTE_DISPOSAL' //'descarte'
  | 'URBAN_FURNITURE' //'mobiliario'
  | 'INCIDENT' //'incidente'
  | 'ACCESSIBILITY' //'acessibilidade'
  | 'VULNERABILITY' //'vulnerabilidade'
  | 'ENVIRONMENTAL' //'ambiental';

export type OccurrenceStatusId = 
  | 'RECEIVED' //'recebido'
  | 'TRIAGE' //'triagem'
  | 'FORWARDED' //'encaminhado'
  | 'IN_EXECUTION' //'execucao'
  | 'COMPLETED' //'concluido'
  | 'SCHEDULED' //'programado';

export type UrgencyLevelId = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Coordinates {
  longitude: number;
  latitude: number;
  approxAddress: string;
}

export interface StatusHistoryEntry {
  status: OccurrenceStatusId;
  timestamp: Date;
  note?: string;
}

export interface Occurrence {
  id: string;
  category: OccurrenceCategoryId;
  description: string;
  coordinates: Coordinates;
  urgency: UrgencyLevelId;
  photoUrl?: string;
  currentStatus: OccurrenceStatusId;
  statusHistory: StatusHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  privacyConsent: boolean;
}

export interface OccurrenceFormData {
  category: OccurrenceCategoryId | '';
  description: string;
  urgency: UrgencyLevelId;
  photo?: File;
  privacyConsent: boolean;
  currentStatus: OccurrenceStatusId;
  location: Coordinates;
}

export interface Camera {
  id: string;
  name: string;
  coordinates: Coordinates;
  streamUrl: string | null;
  externalUrl: string;
  status: 'online' | 'offline' | 'maintenance';
}
