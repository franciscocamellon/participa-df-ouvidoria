import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useOccurrencesQuery, occurrencesQueryKey } from "@/services/apiService";
import { mapApiOmbudsmanToOccurrence } from "@/services/occurrenceMapper";
import { useOccurrenceStore } from "@/stores/occurrenceStore";
import { cacheOccurrences, getCachedOccurrences, getCacheTimestamp } from "@/services/offlineCache";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { processOfflineQueue, hasPendingOccurrences } from "@/services/offlineSyncService";

export function OccurrencesHydrator() {
  const setOccurrences = useOccurrenceStore((s) => s.setOccurrences);
  const { isOnline, wasOffline } = useOnlineStatus();
  const hasLoadedCacheRef = useRef(false);
  const isSyncingRef = useRef(false);
  const queryClient = useQueryClient();

  const { data, error, refetch } = useOccurrencesQuery({ page: 0, size: 200 });

  // Load from cache first (for fast initial render and offline support)
  useEffect(() => {
    if (hasLoadedCacheRef.current) return;
    
    const cached = getCachedOccurrences();
    if (cached && cached.length > 0) {
      setOccurrences(cached);
      hasLoadedCacheRef.current = true;
      
      if (!isOnline) {
        const timestamp = getCacheTimestamp();
        const timeAgo = timestamp 
          ? `Última atualização: ${timestamp.toLocaleDateString("pt-BR")} às ${timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
          : "";
        toast.info(`Exibindo ${cached.length} ocorrências do cache. ${timeAgo}`);
      }
    }
  }, [setOccurrences, isOnline]);

  // Update with fresh data from API
  useEffect(() => {
    if (!data?.content) return;
    
    const occurrences = data.content.map(mapApiOmbudsmanToOccurrence);
    setOccurrences(occurrences);
    
    // Cache for offline use
    cacheOccurrences(occurrences);
  }, [data, setOccurrences]);

  // Handle errors
  useEffect(() => {
    if (!error) return;
    
    // Only show error if we don't have cached data
    const cached = getCachedOccurrences();
    if (!cached || cached.length === 0) {
      toast.error("Não foi possível carregar as ocorrências da API.");
    } else if (isOnline) {
      toast.warning("Não foi possível atualizar. Exibindo dados do cache.");
    }
  }, [error, isOnline]);

  // Background sync when connection is restored
  useEffect(() => {
    if (!isOnline || !wasOffline || isSyncingRef.current) return;

    const performBackgroundSync = async () => {
      isSyncingRef.current = true;
      console.log("[BackgroundSync] Connection restored, starting sync...");

      try {
        // 1. Process offline queue first
        if (hasPendingOccurrences()) {
          console.log("[BackgroundSync] Processing offline queue...");
          const { synced, failed } = await processOfflineQueue();
          
          if (synced > 0) {
            toast.success(`${synced} registro(s) sincronizado(s) com sucesso!`);
          }
          if (failed > 0) {
            toast.warning(`${failed} registro(s) falharam. Serão tentados novamente.`);
          }
        }

        // 2. Re-fetch data to get latest from server
        console.log("[BackgroundSync] Refreshing occurrence data...");
        await queryClient.invalidateQueries({ queryKey: ["occurrences"] });
        await refetch();
        
        console.log("[BackgroundSync] Sync complete");
      } catch (error) {
        console.warn("[BackgroundSync] Error during sync:", error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    // Small delay to ensure connection is stable
    const timeoutId = setTimeout(performBackgroundSync, 1000);
    return () => clearTimeout(timeoutId);
  }, [isOnline, wasOffline, queryClient, refetch]);

  return null;
}
