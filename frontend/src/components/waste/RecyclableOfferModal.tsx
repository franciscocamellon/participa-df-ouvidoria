import { useState } from 'react';
import { X, Recycle, MapPin, Camera, ChevronRight, Trash2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useWasteStore } from '@/stores/wasteStore';
import { wasteTypes, wasteVolumeLevels, wasteRecurrenceLevels, recyclableAvailability } from '@/config/waste.config';
import { useToast } from '@/hooks/use-toast';
import type { Coordinates, RecyclableOfferFormData, WasteTypeId, WasteVolumeId, WasteRecurrenceId, RecyclableAvailabilityId } from '@/types/waste';
import { cn } from '@/lib/utils';

interface RecyclableOfferModalProps {
  coordinates: Coordinates;
  onClose: () => void;
  onSwitchToReport: () => void;
}

type Step = 'type' | 'details' | 'availability';

// Filter only recyclable types
const recyclableTypes = wasteTypes.filter(t => 
  ['reciclaveis_mistos', 'papel', 'plastico', 'vidro', 'metal', 'eletroeletronicos'].includes(t.id)
);

export function RecyclableOfferModal({ coordinates, onClose, onSwitchToReport }: RecyclableOfferModalProps) {
  const { toast } = useToast();
  const { addRecyclableOffer } = useWasteStore();
  const [step, setStep] = useState<Step>('type');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<RecyclableOfferFormData>({
    type: '',
    description: '',
    companyName: '',
    contactInfo: '',
    volume: 'medio',
    recurrence: 'frequente',
    availability: 'periodica',
  });

  const handleTypeSelect = (typeId: WasteTypeId) => {
    setFormData(prev => ({ ...prev, type: typeId }));
    setStep('details');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.companyName) return;
    
    addRecyclableOffer({
      type: formData.type as WasteTypeId,
      description: formData.description,
      coordinates,
      companyName: formData.companyName,
      contactInfo: formData.contactInfo,
      volume: formData.volume,
      recurrence: formData.recurrence,
      availability: formData.availability,
      photoUrl: photoPreview || undefined,
      userId: 'current-user',
    });

    toast({
      title: 'Oferta registrada',
      description: 'Sua oferta de recicláveis foi cadastrada com sucesso!',
    });
    
    onClose();
  };

  const selectedType = wasteTypes.find(t => t.id === formData.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl shadow-civic-xl border border-border w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Recycle className="h-5 w-5 text-success" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-foreground">Oferta de recicláveis</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 'type' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Selecione o tipo de material:</p>
              <div className="grid grid-cols-2 gap-2">
                {recyclableTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id as WasteTypeId)}
                    className="p-3 rounded-xl border border-border hover:border-success hover:bg-success/5 text-left transition-all group"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${type.color}15` }}
                    >
                      <Recycle className="h-4 w-4" style={{ color: type.color }} />
                    </div>
                    <p className="text-sm font-medium text-foreground group-hover:text-success">{type.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{type.description}</p>
                  </button>
                ))}
              </div>

              {/* Switch to report */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={onSwitchToReport}
                  className="w-full p-3 rounded-xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 flex items-center gap-3 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-destructive">Registrar lixo</p>
                    <p className="text-xs text-muted-foreground">Reportar descarte irregular</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>
          )}

          {step === 'details' && selectedType && (
            <div className="space-y-4">
              {/* Selected type */}
              <button
                onClick={() => setStep('type')}
                className="w-full p-3 rounded-xl border border-border flex items-center gap-3 hover:bg-muted/50"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${selectedType.color}15` }}
                >
                  <Recycle className="h-4 w-4" style={{ color: selectedType.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{selectedType.label}</p>
                </div>
                <span className="text-xs text-muted-foreground">Alterar</span>
              </button>

              {/* Company info */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Nome da empresa/instituição *
                </Label>
                <Input
                  id="companyName"
                  placeholder="Ex: Empresa ABC LTDA"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contato (opcional)</Label>
                <Input
                  id="contactInfo"
                  placeholder="Email ou telefone"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição do material</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o tipo e condição do material..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* Photo */}
              <div className="space-y-2">
                <Label>Foto (opcional)</Label>
                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover" />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setPhotoPreview(null);
                        setFormData(prev => ({ ...prev, photo: undefined }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-success hover:bg-success/5 transition-colors">
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Adicionar foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>

              <Button 
                onClick={() => setStep('availability')} 
                className="w-full gap-2"
                disabled={!formData.companyName}
              >
                Continuar
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 'availability' && (
            <div className="space-y-5">
              {/* Volume */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Volume estimado</Label>
                <RadioGroup
                  value={formData.volume}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, volume: v as WasteVolumeId }))}
                  className="grid grid-cols-2 gap-2"
                >
                  {wasteVolumeLevels.map((level) => (
                    <label
                      key={level.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                        formData.volume === level.id
                          ? "border-success bg-success/5"
                          : "border-border hover:border-success/50"
                      )}
                    >
                      <RadioGroupItem value={level.id} id={`vol-${level.id}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{level.label}</p>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Recurrence */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Frequência de geração</Label>
                <RadioGroup
                  value={formData.recurrence}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, recurrence: v as WasteRecurrenceId }))}
                  className="grid grid-cols-2 gap-2"
                >
                  {wasteRecurrenceLevels.slice(1).map((level) => (
                    <label
                      key={level.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                        formData.recurrence === level.id
                          ? "border-success bg-success/5"
                          : "border-border hover:border-success/50"
                      )}
                    >
                      <RadioGroupItem value={level.id} id={`rec-${level.id}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{level.label}</p>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Disponibilidade para coleta</Label>
                <RadioGroup
                  value={formData.availability}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, availability: v as RecyclableAvailabilityId }))}
                  className="space-y-2"
                >
                  {recyclableAvailability.map((level) => (
                    <label
                      key={level.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                        formData.availability === level.id
                          ? "border-success bg-success/5"
                          : "border-border hover:border-success/50"
                      )}
                    >
                      <RadioGroupItem value={level.id} id={`avail-${level.id}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{level.label}</p>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'availability' && (
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleSubmit} className="flex-1 gap-2 bg-success hover:bg-success/90">
                <Recycle className="h-4 w-4" />
                Cadastrar oferta
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
