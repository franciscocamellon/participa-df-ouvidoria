// Type definitions for occurrences and related entities

export type OccurrenceCategoryId =
  | "URBAN_MAINTENANCE" //'zeladoria'
  | "LIGHTING" //'iluminacao'
  | "WASTE_DISPOSAL" //'descarte'
  | "URBAN_FURNITURE" //'mobiliario'
  | "INCIDENT" //'incidente'
  | "ACCESSIBILITY" //'acessibilidade'
  | "VULNERABILITY" //'vulnerabilidade'
  | "ENVIRONMENTAL"; //'ambiental';

export type OccurrenceStatusId =
  | "RECEIVED" //'recebido'
  | "TRIAGE" //'triagem'
  | "FORWARDED" //'encaminhado'
  | "IN_EXECUTION" //'execucao'
  | "COMPLETED" //'concluido'
  | "SCHEDULED"; //'programado';

export type UrgencyLevelId = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Coordinates {
  longitude: number;
  latitude: number;
  approxAddress: string;
}

export interface StatusHistoryEntry {
  status: OccurrenceStatusId;
  changedAt: Date;
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
  reporterIdentityId: string | null;
  privacyConsent: boolean;
}

export interface OccurrenceFormData {
  category: OccurrenceCategoryId | "";
  description: string;
  urgency: UrgencyLevelId;
  anonymous: boolean;
  privacyConsent: boolean;
  currentStatus?: OccurrenceStatusId;

  // backend payload style
  reporterIdentityId?: string | null;

  location: {
    longitude: number;
    latitude: number;
    approxAddress?: string;
  };

  // futura foto (multipart)
  photo?: File;
}

export interface ApiOmbudsmanLocation {
  longitude: number;
  latitude: number;
  approxAddress?: string;
}

export interface ApiOmbudsman {
  id: string;
  protocolNumber?: string;
  category?: OccurrenceCategoryId;
  description?: string;
  urgency?: UrgencyLevelId;
  currentStatus?: OccurrenceStatusId;

  anonymous?: boolean | null;
  privacyConsent?: boolean;

  destinationAgencyId?: string | null;
  reporterIdentityId?: string | null;

  attachmentIds?: string[];
  statusHistory?: { status?: OccurrenceStatusId; changedAt?: string; note?: string }[];
  izaTriageResultId?: string | null;

  location?: ApiOmbudsmanLocation;

  createdAt?: string; // ISO
  updatedAt?: string; // ISO
}

/**
 * Page wrapper do Spring (Page<T>) que você está recebendo.
 */
export interface ApiPage<T> {
  content: T[];
  pageable?: unknown;
  last?: boolean;
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  sort?: unknown;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}
