import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Copy, ExternalLink, Share2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProtocolSuccessModalProps {
  protocolNumber: string | null;
  onClose: () => void;
}

/** Copy text to clipboard and show toast confirmation */
async function copyToClipboard(text: string, label: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`, { duration: 2000 });
    return true;
  } catch {
    toast.error("Não foi possível copiar.");
    return false;
  }
}

/** Share using Web Share API if available */
async function shareContent(data: ShareData): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    await navigator.share(data);
    return true;
  } catch (err) {
    // User cancelled or error
    if ((err as Error).name !== "AbortError") {
      console.error("Share error:", err);
    }
    return false;
  }
}

export function ProtocolSuccessModal({
  protocolNumber,
  onClose,
}: ProtocolSuccessModalProps) {
  const navigate = useNavigate();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [canShare, setCanShare] = useState(false);

  const isOpen = !!protocolNumber;

  const trackingUrl = protocolNumber
    ? new URL(`/acompanhar/${protocolNumber}`, window.location.origin).toString()
    : "";

  // Check Web Share API support
  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  // Focus management - focus close button on open
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  const handleCopyProtocol = () => {
    if (protocolNumber) {
      copyToClipboard(protocolNumber, "Protocolo");
    }
  };

  const handleCopyLink = () => {
    if (trackingUrl) {
      copyToClipboard(trackingUrl, "Link");
    }
  };

  const handleOpenTracking = () => {
    if (protocolNumber) {
      onClose();
      navigate(`/acompanhar/${protocolNumber}`);
    }
  };

  const handleShare = async () => {
    if (!protocolNumber) return;
    await shareContent({
      title: "Acompanhe minha solicitação",
      text: `Protocolo: ${protocolNumber}`,
      url: trackingUrl,
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  if (!protocolNumber) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md max-h-[90vh] overflow-y-auto"
        aria-describedby="protocol-success-description"
      >
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3" aria-hidden="true">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl">Solicitação registrada!</DialogTitle>
          <DialogDescription id="protocol-success-description" className="text-center">
            Guarde este protocolo para acompanhar o andamento da sua solicitação.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-4">
          {/* Protocol number display */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1" id="protocol-label">Número do protocolo</p>
            <p
              className="font-mono text-2xl font-bold tracking-wider text-foreground bg-muted px-4 py-3 rounded-lg inline-block select-all"
              aria-labelledby="protocol-label"
              role="status"
              aria-live="polite"
            >
              {protocolNumber}
            </p>
          </div>

          {/* QR Code */}
          <figure className="flex flex-col items-center gap-2">
            <div className="p-3 bg-white rounded-lg shadow-sm border">
              <QRCodeSVG
                value={trackingUrl}
                size={160}
                level="M"
                includeMargin={false}
                role="img"
                aria-label={`QR Code para acompanhar solicitação. Link: ${trackingUrl}`}
              />
            </div>
            <figcaption className="text-xs text-muted-foreground text-center max-w-[200px]">
              Escaneie para acompanhar no celular
            </figcaption>
          </figure>

          {/* Info text */}
          <p className="text-sm text-muted-foreground text-center px-2">
            Você pode acompanhar atualizações usando este protocolo, mesmo sem estar logado.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyProtocol}
              className="gap-2"
              aria-label="Copiar número do protocolo"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copiar protocolo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2"
              aria-label="Copiar link de acompanhamento"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copiar link
            </Button>
          </div>

          <Button
            onClick={handleOpenTracking}
            className="w-full gap-2"
            aria-label="Abrir página de acompanhamento"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Abrir acompanhamento
          </Button>

          {canShare && (
            <Button
              variant="secondary"
              onClick={handleShare}
              className="w-full gap-2"
              aria-label="Compartilhar protocolo"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Compartilhar
            </Button>
          )}

          <Button
            ref={closeButtonRef}
            variant="ghost"
            onClick={onClose}
            className="w-full mt-1"
            aria-label="Fechar modal"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
