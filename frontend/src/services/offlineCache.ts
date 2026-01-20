import type { Occurrence } from "@/types/occurrence";

const CACHE_KEY = "mti_occurrences_cache";
const CACHE_TIMESTAMP_KEY = "mti_occurrences_cache_timestamp";
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedData {
  occurrences: Occurrence[];
  timestamp: number;
}

/**
 * Save occurrences to localStorage for offline access
 */
export function cacheOccurrences(occurrences: Occurrence[]): void {
  try {
    const data: CachedData = {
      occurrences,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(data.timestamp));
  } catch (error) {
    console.warn("Failed to cache occurrences:", error);
  }
}

/**
 * Retrieve cached occurrences from localStorage
 * Returns null if cache is expired or doesn't exist
 */
export function getCachedOccurrences(): Occurrence[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedData = JSON.parse(cached);
    
    // Check if cache is expired
    if (Date.now() - data.timestamp > CACHE_MAX_AGE_MS) {
      clearOccurrencesCache();
      return null;
    }

    // Rehydrate Date objects
    return data.occurrences.map((occ) => ({
      ...occ,
      createdAt: new Date(occ.createdAt),
      updatedAt: new Date(occ.updatedAt),
      statusHistory: occ.statusHistory.map((entry) => ({
        ...entry,
        changedAt: new Date(entry.changedAt),
      })),
    }));
  } catch (error) {
    console.warn("Failed to read cached occurrences:", error);
    return null;
  }
}

/**
 * Get cache timestamp for display purposes
 */
export function getCacheTimestamp(): Date | null {
  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return null;
    return new Date(parseInt(timestamp, 10));
  } catch {
    return null;
  }
}

/**
 * Clear the occurrences cache
 */
export function clearOccurrencesCache(): void {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
}

/**
 * Check if we have valid cached data
 */
export function hasCachedOccurrences(): boolean {
  return getCachedOccurrences() !== null;
}
