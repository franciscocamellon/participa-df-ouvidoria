import type {
  ApiOmbudsman,
  Coordinates,
  Occurrence,
  OccurrenceCategoryId,
  OccurrenceFormData,
  OccurrenceStatusId,
  UrgencyLevelId,
} from "@/types/occurrence";

function safeDate(value?: string): Date {
  if (!value) return new Date();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function safeCoordinates(location?: ApiOmbudsman["location"]): Coordinates {
  return {
    longitude: location?.longitude ?? 0,
    latitude: location?.latitude ?? 0,
    approxAddress: location?.approxAddress ?? "",
  };
}

export function mapApiOmbudsmanToOccurrence(api: ApiOmbudsman): Occurrence {
  const createdAt = safeDate(api.createdAt);
  const updatedAt = safeDate(api.updatedAt ?? api.createdAt);

  const currentStatus = (api.currentStatus ?? "RECEIVED") as OccurrenceStatusId;

  const statusHistory =
    Array.isArray(api.statusHistory) && api.statusHistory.length > 0
      ? api.statusHistory.map((h) => ({
          status: (h.status ?? currentStatus) as OccurrenceStatusId,
          changedAt: safeDate(h.changedAt),
          note: h.note ?? "",
        }))
      : [
          {
            status: currentStatus,
            changedAt: createdAt,
            note: "Registro recebido.",
          },
        ];

  return {
    id: api.id,
    category: (api.category ?? "URBAN_MAINTENANCE") as OccurrenceCategoryId,
    description: api.description ?? "",
    coordinates: safeCoordinates(api.location),
    urgency: (api.urgency ?? "LOW") as UrgencyLevelId,
    photoUrl: undefined,
    currentStatus,
    statusHistory,
    createdAt,
    updatedAt,
    reporterIdentityId: api.reporterIdentityId ?? null,
    privacyConsent: Boolean(api.privacyConsent),
  };
}

// The API currently expects JSON; files (photo) must be handled with multipart later.
// For now we simply strip the File from the payload.
export function mapOccurrenceFormToCreatePayload(form: OccurrenceFormData) {
  const { photo, ...rest } = form;
  return rest;
}
