import type { CreateOmbudsmanPayload } from "@/services/apiService";
import { createOccurrence } from "@/services/apiService";

const OUTBOX_KEY = "occurrence_outbox";

export type SyncStatus = "pending_sync" | "syncing" | "failed_sync";

export interface QueuedOccurrence {
  id: string;
  payload: CreateOmbudsmanPayload;
  status: SyncStatus;
  createdAt: number;
  attempts: number;
}

/**
 * Get all queued occurrences from localStorage
 */
export function getQueuedOccurrences(): QueuedOccurrence[] {
  try {
    const raw = localStorage.getItem(OUTBOX_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueuedOccurrence[];
  } catch (error) {
    console.warn("[OfflineSync] Failed to read queue:", error);
    return [];
  }
}

/**
 * Save the queue to localStorage
 */
// Custom event name for queue updates
export const QUEUE_UPDATED_EVENT = "offline-queue-updated";

function saveQueue(queue: QueuedOccurrence[]): void {
  try {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(queue));
    // Dispatch event so UI can react to queue changes
    window.dispatchEvent(new CustomEvent(QUEUE_UPDATED_EVENT));
  } catch (error) {
    console.warn("[OfflineSync] Failed to save queue:", error);
  }
}

/**
 * Add an occurrence to the offline queue
 */
export function queueOccurrence(payload: CreateOmbudsmanPayload): QueuedOccurrence {
  const queue = getQueuedOccurrences();
  
  const item: QueuedOccurrence = {
    id: `offline_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    payload,
    status: "pending_sync",
    createdAt: Date.now(),
    attempts: 0,
  };
  
  queue.push(item);
  saveQueue(queue);
  
  console.log("[OfflineSync] Queued occurrence:", item.id);
  return item;
}

/**
 * Update the status of a queued occurrence
 */
function updateQueueItem(id: string, updates: Partial<QueuedOccurrence>): void {
  const queue = getQueuedOccurrences();
  const index = queue.findIndex((item) => item.id === id);
  
  if (index !== -1) {
    queue[index] = { ...queue[index], ...updates };
    saveQueue(queue);
  }
}

/**
 * Remove an occurrence from the queue (after successful sync)
 */
function removeFromQueue(id: string): void {
  const queue = getQueuedOccurrences().filter((item) => item.id !== id);
  saveQueue(queue);
  console.log("[OfflineSync] Removed from queue:", id);
}

/**
 * Check if there are pending items in the queue
 */
export function hasPendingOccurrences(): boolean {
  return getQueuedOccurrences().length > 0;
}

/**
 * Get count of pending occurrences
 */
export function getPendingCount(): number {
  return getQueuedOccurrences().length;
}

/**
 * Process the entire queue - sync all pending occurrences
 * Returns { synced: number, failed: number }
 */
export async function processOfflineQueue(): Promise<{ synced: number; failed: number }> {
  const queue = getQueuedOccurrences();
  
  if (queue.length === 0) {
    console.log("[OfflineSync] Queue is empty, nothing to sync");
    return { synced: 0, failed: 0 };
  }
  
  console.log(`[OfflineSync] Processing queue with ${queue.length} items`);
  
  let synced = 0;
  let failed = 0;
  
  for (const item of queue) {
    updateQueueItem(item.id, { status: "syncing", attempts: item.attempts + 1 });
    
    try {
      await createOccurrence(item.payload);
      removeFromQueue(item.id);
      synced++;
      console.log(`[OfflineSync] Successfully synced: ${item.id}`);
    } catch (error) {
      console.warn(`[OfflineSync] Failed to sync ${item.id}:`, error);
      updateQueueItem(item.id, { status: "failed_sync" });
      failed++;
    }
  }
  
  console.log(`[OfflineSync] Sync complete. Synced: ${synced}, Failed: ${failed}`);
  return { synced, failed };
}

/**
 * Clear failed items from the queue (for manual retry reset)
 */
export function clearFailedItems(): void {
  const queue = getQueuedOccurrences().filter((item) => item.status !== "failed_sync");
  saveQueue(queue);
}

/**
 * Retry syncing a single queued occurrence by ID
 * Returns true if sync was successful, false otherwise
 */
export async function retryQueuedOccurrence(id: string): Promise<boolean> {
  const queue = getQueuedOccurrences();
  const item = queue.find((q) => q.id === id);
  
  if (!item) {
    console.warn(`[OfflineSync] Item not found for retry: ${id}`);
    return false;
  }
  
  updateQueueItem(id, { status: "syncing", attempts: item.attempts + 1 });
  
  try {
    await createOccurrence(item.payload);
    removeFromQueue(id);
    console.log(`[OfflineSync] Retry successful: ${id}`);
    return true;
  } catch (error) {
    console.warn(`[OfflineSync] Retry failed for ${id}:`, error);
    updateQueueItem(id, { status: "failed_sync" });
    return false;
  }
}

/**
 * Get only failed items from the queue
 */
export function getFailedOccurrences(): QueuedOccurrence[] {
  return getQueuedOccurrences().filter((item) => item.status === "failed_sync");
}
