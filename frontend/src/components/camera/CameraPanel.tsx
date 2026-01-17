import { useState, useEffect } from 'react';
import { X, ExternalLink, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Camera as CameraType } from '@/types/occurrence';

interface CameraPanelProps {
  camera: CameraType;
  onClose: () => void;
}

export function CameraPanel({ camera, onClose }: CameraPanelProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Timeout for loading stream
    const timeout = setTimeout(() => {
      if (isLoading) {
        setTimeoutReached(true);
        setHasError(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const handleStreamLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleStreamError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const showFallback = !camera.streamUrl || hasError || camera.status !== 'online';

  return (
    <div className="absolute right-4 top-4 w-[360px] max-w-[calc(100%-2rem)] z-20 animate-fade-in">
      <div className="bg-card rounded-xl shadow-civic-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <Camera className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="font-heading font-medium text-foreground text-sm">
                {camera.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Visualização pública de apoio situacional
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Stream area */}
        <div className="relative aspect-video bg-muted">
          {showFallback ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center mb-3">
                {camera.status === 'maintenance' ? (
                  <AlertCircle className="h-6 w-6 text-warning" />
                ) : (
                  <Camera className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              
              <p className="text-sm font-medium text-foreground mb-1">
                {camera.status === 'maintenance' 
                  ? 'Câmera em manutenção'
                  : 'Stream temporariamente indisponível'}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {camera.status === 'maintenance'
                  ? 'Esta câmera está passando por manutenção programada.'
                  : timeoutReached 
                    ? 'O carregamento excedeu o tempo limite.'
                    : 'Não foi possível carregar a transmissão ao vivo.'}
              </p>

              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => window.open(camera.externalUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Abrir no site
              </Button>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                </div>
              )}
              <iframe
                src={camera.streamUrl!}
                className="w-full h-full"
                onLoad={handleStreamLoad}
                onError={handleStreamError}
                allow="autoplay; encrypted-media"
                sandbox="allow-same-origin allow-scripts"
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className={`w-2 h-2 rounded-full ${
                camera.status === 'online' ? 'bg-success' : 
                camera.status === 'maintenance' ? 'bg-warning' : 'bg-muted-foreground'
              }`}
            />
            <span className="text-xs text-muted-foreground capitalize">
              {camera.status === 'online' ? 'Online' : 
               camera.status === 'maintenance' ? 'Manutenção' : 'Offline'}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1.5 text-xs h-7"
            onClick={() => window.open(camera.externalUrl, '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
            Fonte externa
          </Button>
        </div>
      </div>
    </div>
  );
}
