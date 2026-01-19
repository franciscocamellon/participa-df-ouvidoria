import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

// Ensure API base URL never becomes the literal string "undefined" in fetch() calls.
// Also normalize to avoid trailing slashes.
export const API_BASE_URL = (RAW_API_BASE_URL || "https://auth-hackaton.onrender.com").replace(/\/+$/, "");

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

import type { ApiOmbudsman, ApiPage } from "@/types/occurrence";

// Re-export types from the canonical location
export type { ApiOmbudsman, ApiPage } from "@/types/occurrence";

export type CreateOmbudsmanPayload = {
  protocolNumber?: string;
  category: string;
  description: string;
  urgency?: string;
  currentStatus?: string;
  anonymous?: boolean;
  privacyConsent: boolean;
  destinationAgencyId?: string | null;
  reporterIdentityId?: string | null;
  location?: {
    longitude: number;
    latitude: number;
    approxAddress?: string;
  };
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Reads token from localStorage, supports:
 * - "token" stored as raw JWT => adds "Bearer "
 * - "token" stored as "Bearer <jwt>" => uses as-is
 */
function getAuthHeader(): Record<string, string> {
  try {
    const token = localStorage.getItem("token");
    if (!token) return {};
    if (/^Bearer\s+/i.test(token)) return { Authorization: token };
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

async function apiRequest<T>(
  endpoint: string,
  opts: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
    /** If true, skip auth header (useful for public endpoints) */
    skipAuth?: boolean;
  } = {},
): Promise<T> {
  const method = opts.method ?? "GET";

  const headers: Record<string, string> = {
    accept: "application/json",
    ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
    ...(opts.skipAuth ? {} : getAuthHeader()),
    ...(opts.headers ?? {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: opts.body != null ? JSON.stringify(opts.body) : null,
    signal: opts.signal,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const parsedBody = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    const message =
      (parsedBody &&
        typeof parsedBody === "object" &&
        "message" in (parsedBody as any) &&
        String((parsedBody as any).message)) ||
      `Request failed (${response.status})`;

    throw new ApiError(message, response.status, parsedBody);
  }

  return parsedBody as T;
}

// -----------------------------
// Raw fetchers
// -----------------------------

export async function fetchOccurrencesFromApi(
  page = 0,
  size = 20,
  signal?: AbortSignal,
): Promise<ApiPage<ApiOmbudsman>> {
  return apiRequest<ApiPage<ApiOmbudsman>>(`/api/v1/ombudsmans?page=${page}&size=${size}`, { method: "GET", signal });
}

export async function createOccurrence(body: CreateOmbudsmanPayload): Promise<ApiOmbudsman> {
  return apiRequest<ApiOmbudsman>(`/api/v1/ombudsmans`, {
    method: "POST",
    body,
  });
}

export async function fetchOccurrenceByProtocol(
  protocolNumber: string,
  signal?: AbortSignal,
): Promise<ApiOmbudsman | null> {
  return apiRequest<ApiOmbudsman>(`/api/v1/ombudsmans/by-protocol/${encodeURIComponent(protocolNumber)}`, {
    method: "GET",
    signal,
    skipAuth: true,
  });
}

export async function updateOccurrenceStatus(ombudsmanId: string, newStatus: string): Promise<ApiOmbudsman> {
  return apiRequest<ApiOmbudsman>(`/api/v1/ombudsmans/${ombudsmanId}/status`, {
    method: "PUT",
    body: { currentStatus: newStatus },
  });
}

export function useUpdateOccurrenceStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ombudsmanId, newStatus }: { ombudsmanId: string; newStatus: string }) =>
      updateOccurrenceStatus(ombudsmanId, newStatus),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["occurrences"] });
    },
  });
}

// -----------------------------
// React Query hooks
// -----------------------------

export const occurrencesQueryKey = (page: number, size: number) => ["occurrences", page, size] as const;

export function useOccurrencesQuery(params: { page?: number; size?: number } = {}) {
  const page = params.page ?? 0;
  const size = params.size ?? 20;

  return useQuery({
    queryKey: occurrencesQueryKey(page, size),
    queryFn: ({ signal }) => fetchOccurrencesFromApi(page, size, signal),
    staleTime: 15_000,
    // opcional: se não tiver token, nem tenta
    enabled: !!(typeof window !== "undefined" && localStorage.getItem("token")),
  });
}

export function useCreateOccurrenceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOmbudsmanPayload) => createOccurrence(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["occurrences"] });
    },
  });
}
