import { useState, useEffect } from "react";
import { getPendingCount, QUEUE_UPDATED_EVENT } from "@/services/offlineSyncService";

/**
 * Hook to track the number of pending offline occurrences
 * Listens to custom events dispatched when queue changes
 */
export function usePendingSyncCount(): number {
  const [count, setCount] = useState(() => getPendingCount());

  useEffect(() => {
    const handleQueueUpdate = () => {
      setCount(getPendingCount());
    };

    window.addEventListener(QUEUE_UPDATED_EVENT, handleQueueUpdate);
    
    return () => {
      window.removeEventListener(QUEUE_UPDATED_EVENT, handleQueueUpdate);
    };
  }, []);

  return count;
}
