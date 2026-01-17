import { X, Recycle, MapPin, Building2, Phone, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { wasteTypes, wasteVolumeLevels, wasteRecurrenceLevels, recyclableAvailability } from '@/config/waste.config';
import type { RecyclableOffer } from '@/types/waste';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecyclableDetailPanelProps {
  offer: RecyclableOffer;
  onClose: () => void;
}

export function RecyclableDetailPanel({ offer, onClose }: RecyclableDetailPanelProps) {
  const type = wasteTypes.find(t => t.id === offer.type);
  const volume = wasteVolumeLevels.find(v => v.id === offer.volume);
  const recurrence = wasteRecurrenceLevels.find(r => r.id === offer.recurrence);
  const availability = recyclableAvailability.find(a => a.id === offer.availability);

  return (
    <div className="absolute right-4 top-4 w-[400px] max-w-[calc(100%-2rem)] z-20 animate-slide-in-right">
      <div className="bg-card rounded-2xl shadow-civic-xl border border-success/20 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-success/10 to-success/5 p-4 border-b border-success/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Recycle className="h-6 w-6 text-success" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success text-white">
                    Oferta disponível
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-foreground mt-1">{type?.label}</h3>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Company */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
            <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{offer.companyName}</p>
              {offer.address && (
                <p className="text-xs text-muted-foreground mt-1">{offer.address}</p>
              )}
            </div>
          </div>

          {/* Contact */}
          {offer.contactInfo && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{offer.contactInfo}</p>
            </div>
          )}

          {/* Description */}
          {offer.description && (
            <div className="p-3 rounded-xl bg-success/5 border border-success/10">
              <p className="text-sm text-foreground">{offer.description}</p>
            </div>
          )}

          {/* Photo */}
          {offer.photoUrl && (
            <img 
              src={offer.photoUrl} 
              alt="Material" 
              className="w-full h-40 object-cover rounded-xl"
            />
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="h-3 w-3" />
                <p className="text-xs">Volume</p>
              </div>
              <p className="text-sm font-medium">{volume?.label}</p>
              <p className="text-xs text-muted-foreground">{volume?.description}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" />
                <p className="text-xs">Frequência</p>
              </div>
              <p className="text-sm font-medium">{recurrence?.label}</p>
            </div>
          </div>

          {/* Availability */}
          <div className="p-3 rounded-xl bg-success/5 border border-success/20">
            <p className="text-xs text-muted-foreground mb-1">Disponibilidade</p>
            <p className="text-sm font-semibold text-success">{availability?.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{availability?.description}</p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Cadastrado em {format(new Date(offer.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border">
          <Button className="w-full gap-2 bg-success hover:bg-success/90">
            <Phone className="h-4 w-4" />
            Entrar em contato
          </Button>
        </div>
      </div>
    </div>
  );
}
