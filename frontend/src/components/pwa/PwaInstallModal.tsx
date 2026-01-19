import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share, Plus, Smartphone } from "lucide-react";

type Platform = "ios" | "android" | "desktop" | "unknown";

interface PwaInstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInstall: () => void;
  isInstallAvailable: boolean;
  platform: Platform;
}

export function PwaInstallModal({
  open,
  onOpenChange,
  onInstall,
  isInstallAvailable,
  platform,
}: PwaInstallModalProps) {
  const handleInstall = () => {
    onInstall();
    onOpenChange(false);
  };

  const handleDismiss = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Instalar o app</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Você pode instalar o Participa DF • Ouvidoria no seu dispositivo para
            acesso rápido e uso como app.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {isInstallAvailable ? (
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleInstall}
                className="w-full gap-2"
                size="lg"
                autoFocus
              >
                <Download className="h-4 w-4" />
                Instalar app
              </Button>
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="w-full"
                size="lg"
              >
                Agora não
              </Button>
            </div>
          ) : platform === "ios" ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">
                  No Safari, siga estes passos:
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      1
                    </span>
                    <span className="flex items-center gap-1">
                      Toque em{" "}
                      <Share className="h-4 w-4 inline text-primary" />{" "}
                      <span className="font-medium">Compartilhar</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      2
                    </span>
                    <span className="flex items-center gap-1">
                      Selecione{" "}
                      <Plus className="h-4 w-4 inline text-primary" />{" "}
                      <span className="font-medium">Adicionar à Tela de Início</span>
                    </span>
                  </li>
                </ol>
              </div>
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="w-full"
                size="lg"
                autoFocus
              >
                Entendi
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="w-full"
              size="lg"
              autoFocus
            >
              Fechar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
