import { create } from "zustand";
import type { Coordinates, Occurrence, OccurrenceFormData, OccurrenceStatusId } from "@/types/occurrence";

interface OccurrenceState {
  occurrences: Occurrence[];
  selectedOccurrence: Occurrence | null;
  isCreating: boolean;
  pendingCoordinates: Coordinates | null;

  // Actions
  setOccurrences: (items: Occurrence[]) => void;
  upsertOccurrence: (item: Occurrence) => void;

  // Local-only helper (kept for demo/offline flows)
  addOccurrence: (data: OccurrenceFormData, coordinates: Coordinates) => Occurrence;

  deleteOccurrence: (id: string) => void;
  updateOccurrenceDescription: (id: string, description: string) => void;
  updateOccurrenceStatus: (id: string, status: OccurrenceStatusId, note?: string) => void;
  selectOccurrence: (occurrence: Occurrence | null) => void;
  setIsCreating: (isCreating: boolean) => void;
  setPendingCoordinates: (coordinates: Coordinates | null) => void;

  // Helper
  getUserOccurrences: (reporterIdentityId: string) => Occurrence[];
}

// Generate unique ID (used only for local/demo creation)
const generateId = () => `occ_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

export const useOccurrenceStore = create<OccurrenceState>()((set, get) => ({
  occurrences: [],
  selectedOccurrence: null,
  isCreating: false,
  pendingCoordinates: null,

  setOccurrences: (items) => {
    set((state) => {
      const selectedId = state.selectedOccurrence?.id;
      const nextSelected = selectedId ? (items.find((o) => o.id === selectedId) ?? null) : null;

      return {
        occurrences: items,
        selectedOccurrence: nextSelected,
      };
    });
  },

  upsertOccurrence: (item) => {
    set((state) => {
      const idx = state.occurrences.findIndex((o) => o.id === item.id);
      const next =
          idx >= 0 ? state.occurrences.map((o) => (o.id === item.id ? item : o)) : [...state.occurrences, item];

      const selected = state.selectedOccurrence?.id === item.id ? item : state.selectedOccurrence;

      return {
        occurrences: next,
        selectedOccurrence: selected,
      };
    });
  },

  // Local-only helper (kept for demo/offline flows)
  // NOTE: reporterIdentityId is null because local creation is not linked to a real user.
  addOccurrence: (data, coordinates) => {
    const now = new Date();

    const newOccurrence: Occurrence = {
      id: generateId(),
      category: data.category as Occurrence["category"],
      description: data.description,
      coordinates,
      urgency: data.urgency,
      photoUrl: data.photo ? URL.createObjectURL(data.photo) : undefined,
      currentStatus: "RECEIVED",
      statusHistory: [
        {
          status: "RECEIVED",
          changedAt: now,
          note: "Registro criado localmente (demo).",
        },
      ],
      createdAt: now,
      updatedAt: now,
      reporterIdentityId: null,
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
          occ.id === id && occ.currentStatus === "RECEIVED" ? { ...occ, description, updatedAt: new Date() } : occ
      ),
    }));
  },

  updateOccurrenceStatus: (id, status, note) => {
    set((state) => ({
      occurrences: state.occurrences.map((occ) =>
          occ.id === id
              ? {
                ...occ,
                currentStatus: status,
                statusHistory: [...occ.statusHistory, { status, changedAt: new Date(), note }],
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

  getUserOccurrences: (reporterIdentityId) => {
    return get().occurrences.filter((occ) => occ.reporterIdentityId === reporterIdentityId);
  },
}));
