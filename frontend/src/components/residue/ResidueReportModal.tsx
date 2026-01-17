import { useState } from 'react';
import { X, Package, MapPin, Camera, ChevronRight, Recycle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useResidueStore } from '@/stores/residueStore';
import { residueTypes, residueOrigins, residueVolumes, residueConditions, institutionalMessages } from '@/config/residue.config';
import { useToast } from '@/hooks/use-toast';
import type { Coordinates, ResidueReportFormData, ResidueTypeId, ResidueOriginId, ResidueVolumeId, ResidueConditionId } from '@/types/residue';
import { cn } from '@/lib/utils';

interface ResidueReportModalProps {
  coordinates: Coordinates;
  onClose: () => void;
  onSwitchToOffer: () => void;
}

type Step = 'type' | 'details' | 'context';

export function ResidueReportModal({ coordinates, onClose, onSwitchToOffer }: ResidueReportModalProps) {
  const { toast } = useToast();
  const { addResidueReport } = useResidueStore();
  const [step, setStep] = useState<Step>('type');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ResidueReportFormData>({
    type: '',
    origin: 'via_publica',
    description: '',
    volume: 'medio',
    condition: 'acumulado',
  });

  const handleTypeSelect = (typeId: ResidueTypeId) => {
    const type = residueTypes.find(t => t.id === typeId);
    if (type?.infoOnly) {
      toast({
        title: 'Resíduo perigoso',
        description: institutionalMessages.dangerousNote,
        variant: 'destructive',
      });
      return;
    }
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
    if (!formData.type) return;
    
    addResidueReport({
      type: formData.type as ResidueTypeId,
      origin: formData.origin,
      description: formData.description,
      coordinates,
      volume: formData.volume,
      condition: formData.condition,
      photoUrl: photoPreview || undefined,
      userId: 'current-user',
    });

    toast({
      title: 'Registro enviado',
      description: 'Seu registro foi recebido e será analisado pela equipe técnica.',
    });
    
    onClose();
  };

  const selectedType = residueTypes.find(t => t.id === formData.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-foreground">Registrar resíduo</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Localização aproximada selecionada
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Institutional notice */}
        <div className="px-4 py-2 bg-info/5 border-b border-info/10">
          <p className="text-[11px] text-info flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{institutionalMessages.citizenRole} {institutionalMessages.governmentRole}</span>
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 'type' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Selecione o tipo de resíduo:</p>
              <div className="grid grid-cols-2 gap-2">
                {residueTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id as ResidueTypeId)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all group",
                      type.infoOnly 
                        ? "border-destructive/30 bg-destructive/5 hover:bg-destructive/10" 
                        : "border-border hover:border-primary hover:bg-primary/5"
                    )}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${type.color}15` }}
                    >
                      {type.infoOnly ? (
                        <AlertTriangle className="h-4 w-4" style={{ color: type.color }} />
                      ) : (
                        <Package className="h-4 w-4" style={{ color: type.color }} />
                      )}
                    </div>
                    <p className={cn(
                      "text-sm font-medium",
                      type.infoOnly ? "text-destructive" : "text-foreground group-hover:text-primary"
                    )}>
                      {type.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{type.description}</p>
                    {type.infoOnly && (
                      <p className="text-[10px] text-destructive/80 mt-1">Apenas informativo</p>
                    )}
                  </button>
                ))}
              </div>

              {/* Switch to reuse offer */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={onSwitchToOffer}
                  className="w-full p-3 rounded-xl bg-success/5 border border-success/20 hover:bg-success/10 flex items-center gap-3 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Recycle className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-success">Ofertar material para reaproveitamento</p>
                    <p className="text-xs text-muted-foreground">Empresas e organizações</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-success" />
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
                  <Package className="h-4 w-4" style={{ color: selectedType.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{selectedType.label}</p>
                </div>
                <span className="text-xs text-muted-foreground">Alterar</span>
              </button>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva brevemente a situação encontrada..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[80px] resize-none"
                  maxLength={500}
                />
                <p className="text-[10px] text-muted-foreground text-right">{formData.description.length}/500</p>
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
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
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

              <Button onClick={() => setStep('context')} className="w-full gap-2">
                Continuar
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 'context' && (
            <div className="space-y-5">
              {/* Origin */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Onde foi encontrado?</Label>
                <RadioGroup
                  value={formData.origin}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, origin: v as ResidueOriginId }))}
                  className="space-y-2"
                >
                  {residueOrigins.map((origin) => (
                    <label
                      key={origin.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                        formData.origin === origin.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value={origin.id} id={origin.id} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{origin.label}</p>
                        <p className="text-xs text-muted-foreground">{origin.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Volume */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Volume estimado</Label>
                <RadioGroup
                  value={formData.volume}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, volume: v as ResidueVolumeId }))}
                  className="grid grid-cols-2 gap-2"
                >
                  {residueVolumes.map((level) => (
                    <label
                      key={level.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                        formData.volume === level.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value={level.id} id={`vol-${level.id}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium flex items-center gap-1">
                          <span>{level.visualHint}</span>
                          {level.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Condition */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Condição</Label>
                <RadioGroup
                  value={formData.condition}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, condition: v as ResidueConditionId }))}
                  className="space-y-2"
                >
                  {residueConditions.map((condition) => (
                    <label
                      key={condition.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                        formData.condition === condition.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value={condition.id} id={`cond-${condition.id}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{condition.label}</p>
                        <p className="text-xs text-muted-foreground">{condition.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'context' && (
          <div className="p-4 border-t border-border">
            <p className="text-[10px] text-muted-foreground mb-3 text-center">
              {institutionalMessages.noGuarantee}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleSubmit} className="flex-1 gap-2">
                <Package className="h-4 w-4" />
                Enviar registro
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
