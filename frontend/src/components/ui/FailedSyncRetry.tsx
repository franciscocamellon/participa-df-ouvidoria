import { useState, useEffect } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  getFailedOccurrences, 
  retryQueuedOccurrence, 
  QUEUE_UPDATED_EVENT,
  type QueuedOccurrence 
} from "@/services/offlineSyncService";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Shows failed sync items with retry button
 * Only visible when there are failed items
 */
export function FailedSyncRetry() {
  const [failedItems, setFailedItems] = useState<QueuedOccurrence[]>([]);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateFailedItems = () => {
      setFailedItems(getFailedOccurrences());
    };

    updateFailedItems();
    window.addEventListener(QUEUE_UPDATED_EVENT, updateFailedItems);
    
    return () => {
      window.removeEventListener(QUEUE_UPDATED_EVENT, updateFailedItems);
    };
  }, []);

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    
    try {
      const success = await retryQueuedOccurrence(id);
      
      if (success) {
        toast({
          title: "Sincronizado!",
          description: "Registro enviado com sucesso.",
        });
        // Refresh occurrences list
        await queryClient.invalidateQueries({ queryKey: ["occurrences"] });
      } else {
        toast({
          title: "Falha na sincronização",
          description: "Não foi possível enviar. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setRetryingId(null);
    }
  };

  if (failedItems.length === 0) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2 text-destructive text-sm font-medium">
        <AlertCircle className="h-4 w-4" />
        <span>Falha na sincronização ({failedItems.length})</span>
      </div>
      
      <div className="space-y-1.5">
        {failedItems.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between gap-2 text-xs bg-background/50 rounded px-2 py-1.5"
          >
            <span className="text-muted-foreground truncate flex-1">
              {item.payload.description?.slice(0, 40) || "Ocorrência"}{item.payload.description && item.payload.description.length > 40 ? "..." : ""}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => handleRetry(item.id)}
              disabled={retryingId === item.id}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${retryingId === item.id ? "animate-spin" : ""}`} />
              {retryingId === item.id ? "Enviando..." : "Tentar novamente"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
