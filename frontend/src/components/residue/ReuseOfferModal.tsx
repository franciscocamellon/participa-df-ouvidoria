import { useState } from 'react';
import { X, Recycle, MapPin, Camera, ChevronRight, Package, Building2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useResidueStore } from '@/stores/residueStore';
import { recyclableMaterials, reuseInterests, reuseAvailability, institutionalMessages } from '@/config/residue.config';
import { useToast } from '@/hooks/use-toast';
import type { Coordinates, ReuseOfferFormData, ReuseInterestId, ReuseAvailabilityId } from '@/types/residue';
import { cn } from '@/lib/utils';

interface ReuseOfferModalProps {
  coordinates: Coordinates;
  onClose: () => void;
  onSwitchToReport: () => void;
}

type Step = 'type' | 'details' | 'availability';

export function ReuseOfferModal({ coordinates, onClose, onSwitchToReport }: ReuseOfferModalProps) {
  const { toast } = useToast();
  const { addReuseOffer } = useResidueStore();
  const [step, setStep] = useState<Step>('type');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ReuseOfferFormData>({
    materialType: '',
    description: '',
    organizationName: '',
    contactInfo: '',
    estimatedQuantity: '',
    interest: 'doacao',
    availability: 'periodica',
  });

  const handleTypeSelect = (typeId: string) => {
    setFormData(prev => ({ ...prev, materialType: typeId }));
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
    if (!formData.materialType || !formData.organizationName) return;
    
    addReuseOffer({
      materialType: formData.materialType,
      description: formData.description,
      coordinates,
      organizationName: formData.organizationName,
      contactInfo: formData.contactInfo,
      estimatedQuantity: formData.estimatedQuantity,
      interest: formData.interest,
      availability: formData.availability,
      photoUrl: photoPreview || undefined,
      userId: 'current-user',
    });

    toast({
      title: 'Oferta registrada',
      description: 'Sua oferta de reaproveitamento foi cadastrada com sucesso.',
    });
    
    onClose();
  };

  const selectedMaterial = recyclableMaterials.find(t => t.id === formData.materialType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Recycle className="h-5 w-5 text-success" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-foreground">Ofertar reaproveitamento</h2>
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
        <div className="px-4 py-2 bg-success/5 border-b border-success/10">
          <p className="text-[11px] text-success flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{institutionalMessages.partnerRole} Esta oferta não configura coleta pública.</span>
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 'type' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Selecione o tipo de material:</p>
              <div className="grid grid-cols-2 gap-2">
                {recyclableMaterials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => handleTypeSelect(material.id)}
                    className="p-3 rounded-xl border border-border hover:border-success hover:bg-success/5 text-left transition-all group"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${material.color}15` }}
                    >
                      <Recycle className="h-4 w-4" style={{ color: material.color }} />
                    </div>
                    <p className="text-sm font-medium text-foreground group-hover:text-success">{material.label}</p>
                  </button>
                ))}
              </div>

              {/* Switch to report */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={onSwitchToReport}
                  className="w-full p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 flex items-center gap-3 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-primary">Registrar resíduo</p>
                    <p className="text-xs text-muted-foreground">Informar situação de resíduo</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </button>
              </div>
            </div>
          )}

          {step === 'details' && selectedMaterial && (
            <div className="space-y-4">
              {/* Selected type */}
              <button
                onClick={() => setStep('type')}
                className="w-full p-3 rounded-xl border border-border flex items-center gap-3 hover:bg-muted/50"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${selectedMaterial.color}15` }}
                >
                  <Recycle className="h-4 w-4" style={{ color: selectedMaterial.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{selectedMaterial.label}</p>
                </div>
                <span className="text-xs text-muted-foreground">Alterar</span>
              </button>

              {/* Organization info */}
              <div className="space-y-2">
                <Label htmlFor="organizationName" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Nome da organização *
                </Label>
                <Input
                  id="organizationName"
                  placeholder="Ex: Empresa ABC LTDA"
                  value={formData.organizationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
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

              <div className="space-y-2">
                <Label htmlFor="estimatedQuantity">Quantidade estimada</Label>
                <Input
                  id="estimatedQuantity"
                  placeholder="Ex: 100-150 kg/semana"
                  value={formData.estimatedQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedQuantity: e.target.value }))}
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
                disabled={!formData.organizationName}
              >
                Continuar
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 'availability' && (
            <div className="space-y-5">
              {/* Interest */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tipo de interesse</Label>
                <RadioGroup
                  value={formData.interest}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, interest: v as ReuseInterestId }))}
                  className="space-y-2"
                >
                  {reuseInterests.map((interest) => (
                    <label
                      key={interest.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all",
                        formData.interest === interest.id
                          ? "border-success bg-success/5"
                          : "border-border hover:border-success/50"
                      )}
                    >
                      <RadioGroupItem value={interest.id} id={interest.id} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{interest.label}</p>
                        <p className="text-xs text-muted-foreground">{interest.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Disponibilidade para retirada</Label>
                <RadioGroup
                  value={formData.availability}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, availability: v as ReuseAvailabilityId }))}
                  className="space-y-2"
                >
                  {reuseAvailability.map((level) => (
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
