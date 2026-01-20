import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { cn } from "@/lib/utils";

export function ConnectionBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();

  // Don't show anything if always online
  if (isOnline && !wasOffline) return null;

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "fixed top-14 left-0 right-0 z-40 px-4 py-2 text-sm font-medium transition-all duration-300",
        "flex items-center justify-center gap-2",
        isOnline
          ? "bg-emerald-500/90 text-white"
          : "bg-amber-500/90 text-white"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" aria-hidden="true" />
          <span>Conexão restabelecida! Sincronizando dados...</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" aria-hidden="true" />
          <span>Você está offline. Exibindo dados armazenados localmente.</span>
          <button
            onClick={handleRetry}
            className="ml-2 inline-flex items-center gap-1 rounded bg-white/20 px-2 py-0.5 text-xs hover:bg-white/30 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1"
            aria-label="Tentar reconectar à internet"
          >
            <RefreshCw className="h-3 w-3" aria-hidden="true" />
            Tentar novamente
          </button>
        </>
      )}
    </div>
  );
}
