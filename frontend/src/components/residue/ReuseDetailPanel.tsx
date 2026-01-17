import { X, MapPin, Building2, Recycle, Phone, Mail, Clock, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { recyclableMaterials, reuseInterests, reuseAvailability } from '@/config/residue.config';
import type { ReuseOffer } from '@/types/residue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReuseDetailPanelProps {
  offer: ReuseOffer;
  onClose: () => void;
}

export function ReuseDetailPanel({ offer, onClose }: ReuseDetailPanelProps) {
  const material = recyclableMaterials.find(m => m.id === offer.materialType);
  const interest = reuseInterests.find(i => i.id === offer.interest);
  const availability = reuseAvailability.find(a => a.id === offer.availability);

  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 sm:w-96 z-20 bg-card rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col animate-slide-up">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between gap-3 bg-success/5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
            <Recycle className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Oferta de reaproveitamento</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs border-success/30 bg-success/10 text-success">
                {material?.label}
              </Badge>
              {offer.isActive && (
                <Badge variant="outline" className="text-xs border-success/30 text-success">
                  Ativa
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Photo */}
        {offer.photoUrl && (
          <div className="rounded-xl overflow-hidden">
            <img 
              src={offer.photoUrl} 
              alt="Foto do material" 
              className="w-full h-40 object-cover"
            />
          </div>
        )}

        {/* Organization */}
        <div className="p-3 rounded-xl bg-success/5 border border-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-success" />
            <p className="font-medium text-foreground">{offer.organizationName}</p>
          </div>
          {offer.contactInfo && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              {offer.contactInfo.includes('@') ? (
                <Mail className="h-3.5 w-3.5" />
              ) : (
                <Phone className="h-3.5 w-3.5" />
              )}
              {offer.contactInfo}
            </p>
          )}
        </div>

        {/* Description */}
        {offer.description && (
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-sm text-foreground">{offer.description}</p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Localização aproximada</p>
              <p className="text-sm text-foreground">{offer.approximateAddress || 'Não informado'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-lg bg-muted/30">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Quantidade</p>
              <p className="text-sm font-medium">{offer.estimatedQuantity || 'Não informado'}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Interesse</p>
              <p className="text-sm font-medium">{interest?.label}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-success/5 border border-success/10 col-span-2">
              <p className="text-[10px] uppercase tracking-wide text-success/80 mb-0.5">Disponibilidade</p>
              <p className="text-sm font-medium text-success">{availability?.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{availability?.description}</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Cadastrado em {format(new Date(offer.createdAt), "dd/MM/yyyy", { locale: ptBR })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-success/5">
        <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
          <Package2 className="h-3 w-3" />
          Esta oferta não configura coleta pública municipal
        </p>
      </div>
    </div>
  );
}
