import { useState } from 'react';
import { X, Camera, MapPin, AlertCircle, Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { occurrenceCategories, urgencyLevels, appInfo } from '@/config/app.config';
import { useOccurrenceStore } from '@/stores/occurrenceStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Coordinates, OccurrenceFormData, OccurrenceCategoryId, UrgencyLevelId } from '@/types/occurrence';
import {createOccurrence} from "@/services/apiService.ts";

interface OccurrenceModalProps {
  coordinates: Coordinates;
  onClose: () => void;
}

export function OccurrenceModal({ coordinates, onClose }: OccurrenceModalProps) {
  const addOccurrence = useOccurrenceStore((state) => state.addOccurrence);

  const [formData, setFormData] = useState<OccurrenceFormData>({
    category: '',
    description: '',
    urgency: 'LOW',
    privacyConsent: false,
    currentStatus: "RECEIVED",
    location: {
      longitude: Number(coordinates.latitude.toFixed(5)),
      latitude: Number(coordinates.longitude.toFixed(5)),
      approxAddress: ''
    }
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [step, setStep] = useState<'category' | 'details' | 'urgency'>('category');

  const handleCategorySelect = (categoryId: OccurrenceCategoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
    setStep('details');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!formData.category || !formData.description.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!formData.privacyConsent) {
      toast.error('É necessário aceitar a política de privacidade.');
      return;
    }

    // const occurrence = addOccurrence(formData, coordinates);
    const occurrence = createOccurrence("/api/v1/ombudsmans", "POST", formData);
    // console.log(occurrence);
    toast.success('Ocorrência registrada com sucesso!', {
      description: 'Acompanhe o status em "Meus registros".',
    });
    onClose();
  };

  const selectedCategory = occurrenceCategories.find((c) => c.id === formData.category);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg max-h-[85vh] overflow-auto bg-card rounded-t-2xl sm:rounded-2xl shadow-civic-xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-action/20 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-action-foreground" style={{ color: 'hsl(45, 93%, 40%)' }} />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-foreground">Registrar ocorrência</h2>
              <p className="text-xs text-muted-foreground">
                {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Step: Category Selection */}
          {step === 'category' && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm text-muted-foreground mb-4">
                Selecione a categoria que melhor descreve a situação:
              </p>
              <div className="grid gap-2">
                {occurrenceCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors text-left group"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{category.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Details */}
          {step === 'details' && selectedCategory && (
            <div className="space-y-4 animate-fade-in">
              {/* Selected category indicator */}
              <div 
                className="flex items-center gap-2 p-2 rounded-lg"
                style={{ backgroundColor: `${selectedCategory.color}10` }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                <span className="text-sm font-medium">{selectedCategory.label}</span>
                <button 
                  onClick={() => setStep('category')}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                >
                  Alterar
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição da ocorrência *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva brevemente a situação observada..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.description.length}/500
                </p>
              </div>

              {/* Photo upload */}
              <div className="space-y-2">
                <Label>Foto (opcional)</Label>
                <div className="flex items-center gap-3">
                  {photoPreview ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          setPhotoPreview(null);
                          setFormData((prev) => ({ ...prev, photo: undefined }));
                        }}
                        className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
                      <Camera className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Adicionar foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button 
                onClick={() => setStep('urgency')} 
                className="w-full"
                disabled={!formData.description.trim()}
              >
                Continuar
              </Button>
            </div>
          )}

          {/* Step: Urgency & Consent */}
          {step === 'urgency' && (
            <div className="space-y-4 animate-fade-in">
              <button 
                onClick={() => setStep('details')}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                ← Voltar
              </button>

              {/* Urgency level */}
              <div className="space-y-3">
                <Label>Qual a urgência desta situação?</Label>
                <RadioGroup
                  value={formData.urgency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, urgency: value as UrgencyLevelId }))}
                  className="space-y-2"
                >
                  {urgencyLevels.map((level) => (
                    <label
                      key={level.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        formData.urgency === level.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      <RadioGroupItem value={level.id} id={level.id} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{level.label}</p>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: level.color }}
                      />
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Privacy consent */}
              <div className="p-3 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="privacy"
                    checked={formData.privacyConsent}
                    onCheckedChange={(checked) => 
                      setFormData((prev) => ({ ...prev, privacyConsent: checked === true }))
                    }
                  />
                  <label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                    Li e concordo com a{' '}
                    <a href="/sobre" className="text-accent hover:underline">política de privacidade</a>.
                    Entendo que este registro será usado para fins de coordenação urbana.
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {appInfo.privacyNote}
                </p>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-xs text-warning-foreground">
                  Esta plataforma não é canal de emergência. Em situações de risco, ligue 190, 193 ou 192.
                </p>
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full gap-2"
                disabled={!formData.privacyConsent}
              >
                <Check className="h-4 w-4" />
                Enviar registro
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
