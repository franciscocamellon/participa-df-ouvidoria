import { useState, useEffect, useRef } from "react";
import { Camera, MapPin, AlertCircle, Check, WifiOff, Upload, Video, Mic, Square, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { occurrenceCategories, urgencyLevels, appInfo } from "@/config/app.config";
import { useOccurrenceStore } from "@/stores/occurrenceStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAriaAnnounce } from "@/components/ui/AriaLiveRegion";
import type { Coordinates, OccurrenceFormData, OccurrenceCategoryId, UrgencyLevelId } from "@/types/occurrence";
import { useCreateOccurrenceMutation, type CreateOmbudsmanPayload } from "@/services/apiService";
import { mapApiOmbudsmanToOccurrence } from "@/services/occurrenceMapper";
import { queueOccurrence } from "@/services/offlineSyncService";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { ProtocolSuccessModal } from "./ProtocolSuccessModal";
import { useAudioRecorder, formatRecordingTime } from "@/hooks/useAudioRecorder";

const FORM_DRAFT_KEY = "occurrence_form_draft";

// File size limits in bytes
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25 MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface OccurrenceModalProps {
  coordinates: Coordinates;
  onClose: () => void;
}

type StoredUser = { id: string; fullName?: string; email?: string };

function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function OccurrenceModal({ coordinates, onClose }: OccurrenceModalProps) {
  const upsertOccurrence = useOccurrenceStore((state) => state.upsertOccurrence);
  const { isOnline } = useOnlineStatus();
  const navigate = useNavigate();
  const { announce } = useAriaAnnounce();

  const createMutation = useCreateOccurrenceMutation();
  const user = getStoredUser();
  const isLoggedIn = !!user?.id;

  // Audio recorder hook
  const audioRecorder = useAudioRecorder();

  // Refs for focus management
  const firstCategoryRef = useRef<HTMLButtonElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Try to restore draft from localStorage
  const getInitialFormData = (): OccurrenceFormData => {
    try {
      const draft = localStorage.getItem(FORM_DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        localStorage.removeItem(FORM_DRAFT_KEY);
        return {
          ...parsed,
          location: {
            longitude: Number(coordinates.longitude.toFixed(5)),
            latitude: Number(coordinates.latitude.toFixed(5)),
            approxAddress: coordinates.approxAddress ?? "",
          },
        };
      }
    } catch {
      // Ignore parse errors
    }
    return {
      category: "",
      description: "",
      urgency: "LOW",
      anonymous: false,
      privacyConsent: false,
      currentStatus: "RECEIVED",
      location: {
        longitude: Number(coordinates.longitude.toFixed(5)),
        latitude: Number(coordinates.latitude.toFixed(5)),
        approxAddress: coordinates.approxAddress ?? "",
      },
    };
  };

  const [formData, setFormData] = useState<OccurrenceFormData>(getInitialFormData);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoAltText, setPhotoAltText] = useState<string>("");
  const [step, setStep] = useState<"category" | "details" | "urgency">("category");
  const [successProtocol, setSuccessProtocol] = useState<string | null>(null);

  // Video state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Audio state (uses hook, but we store locally for UI)
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  // Attachment errors
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  // Status announcement region
  const [attachmentStatus, setAttachmentStatus] = useState<string>("");

  // Restore step if we have a draft with data
  useEffect(() => {
    if (formData.category && formData.description) {
      setStep("urgency");
    } else if (formData.category) {
      setStep("details");
    }
  }, []);

  // Focus management when step changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === "category" && firstCategoryRef.current) {
        firstCategoryRef.current.focus();
      } else if (step === "details" && descriptionRef.current) {
        descriptionRef.current.focus();
      } else if (step === "urgency" && backButtonRef.current) {
        backButtonRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [step]);

  // Cleanup video preview URL on unmount
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [videoPreview, audioPreviewUrl]);

  const handleCategorySelect = (categoryId: OccurrenceCategoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
    setStep("details");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate size
      if (file.size > MAX_PHOTO_SIZE) {
        setAttachmentError(`Foto muito grande (${formatFileSize(file.size)}). Máximo: 5 MB. Arquivo grande — envie depois no Wi-Fi.`);
        setAttachmentStatus("Erro: foto muito grande.");
        return;
      }
      setAttachmentError(null);
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
      setAttachmentStatus("Foto anexada com sucesso.");
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate size
      if (file.size > MAX_VIDEO_SIZE) {
        setAttachmentError(`Vídeo muito grande (${formatFileSize(file.size)}). Máximo: 25 MB. Arquivo grande — envie depois no Wi-Fi.`);
        setAttachmentStatus("Erro: vídeo muito grande.");
        return;
      }
      setAttachmentError(null);
      setVideoFile(file);
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      setVideoPreview(URL.createObjectURL(file));
      setAttachmentStatus("Vídeo anexado com sucesso.");
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    setAttachmentStatus("Vídeo removido.");
  };

  const handleStartAudioRecording = async () => {
    setAttachmentError(null);
    await audioRecorder.startRecording();
  };

  const handleStopAudioRecording = () => {
    audioRecorder.stopRecording();
  };

  const handleCancelAudioRecording = () => {
    audioRecorder.cancelRecording();
  };

  // When audio recording is complete, validate and store
  useEffect(() => {
    if (audioRecorder.audioBlob && audioRecorder.audioUrl) {
      // Validate size
      if (audioRecorder.audioBlob.size > MAX_AUDIO_SIZE) {
        setAttachmentError(`Áudio muito grande (${formatFileSize(audioRecorder.audioBlob.size)}). Máximo: 10 MB. Arquivo grande — envie depois no Wi-Fi.`);
        setAttachmentStatus("Erro: áudio muito grande.");
        audioRecorder.clearRecording();
        return;
      }
      setAttachmentError(null);
      setAudioFile(audioRecorder.audioBlob);
      setAudioPreviewUrl(audioRecorder.audioUrl);
      setAttachmentStatus("Áudio gravado com sucesso.");
    }
  }, [audioRecorder.audioBlob, audioRecorder.audioUrl]);

  const handleRemoveAudio = () => {
    audioRecorder.clearRecording();
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    setAudioFile(null);
    setAudioPreviewUrl(null);
    setAttachmentStatus("Áudio removido.");
  };

  const buildCreatePayload = (): CreateOmbudsmanPayload => {
    const user = getStoredUser();

    // Append photo alt text to description if provided
    let finalDescription = formData.description;
    if (photoAltText.trim() && photoPreview) {
      finalDescription += `\n\n[Descrição da imagem]: ${photoAltText.trim()}`;
    }

    // Collect attachment URLs from photo, video, and audio previews
    const attachmentUrls: string[] = [];
    if (photoPreview) attachmentUrls.push(photoPreview);
    if (videoPreview) attachmentUrls.push(videoPreview);
    if (audioPreviewUrl) attachmentUrls.push(audioPreviewUrl);

    return {
      category: formData.category as never,
      description: finalDescription,
      urgency: formData.urgency,
      currentStatus: "RECEIVED",
      anonymous: !user?.id,
      privacyConsent: formData.privacyConsent,
      reporterIdentityId: user?.id ?? null,
      location: {
        longitude: Number(coordinates.longitude.toFixed(5)),
        latitude: Number(coordinates.latitude.toFixed(5)),
        approxAddress: coordinates.approxAddress ?? "",
      },
      attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
    };
  };

  const handleSubmit = async () => {
    if (!formData.category || !formData.description.trim()) {
      const errorMsg = "Por favor, preencha todos os campos obrigatórios.";
      toast.error(errorMsg);
      announce(errorMsg, "assertive");
      return;
    }

    if (!formData.privacyConsent) {
      const errorMsg = "É necessário aceitar a política de privacidade.";
      toast.error(errorMsg);
      announce(errorMsg, "assertive");
      return;
    }

    // If not logged in and not anonymous, save draft and redirect to login
    if (!isLoggedIn && !formData.anonymous) {
      try {
        localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(formData));
      } catch {
        // Ignore storage errors
      }
      toast.info("Faça login para enviar o registro ou marque como anônimo.");
      onClose();
      navigate("/login");
      return;
    }

    const payload = buildCreatePayload();

    // Check if trying to submit with attachments while offline
    const hasAttachments = formData.photo || videoFile || audioFile;
    if (!isOnline && hasAttachments) {
      toast.warning("Anexos exigem conexão. O registro será salvo sem os anexos.");
    }

    // OFFLINE PATH: queue for later sync
    if (!isOnline) {
      queueOccurrence(payload);
      toast.success("Registro salvo offline e será sincronizado ao reconectar.", {
        icon: <WifiOff className="h-4 w-4" />,
        description: "Você pode continuar usando o app normalmente.",
      });
      onClose();
      return;
    }

    // ONLINE PATH: normal API call
    try {
      const created = await createMutation.mutateAsync(payload);

      const storedUser = getStoredUser();
      const mapped = mapApiOmbudsmanToOccurrence(created);
      const mappedWithUser = storedUser?.id ? { ...mapped, userId: storedUser.id } : mapped;

      upsertOccurrence(mappedWithUser);

      // Show success modal with protocol if available
      if (created.protocolNumber) {
        setSuccessProtocol(created.protocolNumber);
        toast.success("Ocorrência registrada com sucesso!");
      } else {
        toast.success("Ocorrência registrada com sucesso!", {
          description: 'Acompanhe o status em "Meus registros".',
        });
        onClose();
      }
    } catch (error) {
      console.error("Erro ao criar ocorrência:", error);
      toast.error("Não foi possível registrar a ocorrência.");
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessProtocol(null);
    onClose();
  };

  const selectedCategory = occurrenceCategories.find((c) => c.id === formData.category);

  // Check if we have any attachments for offline indicator
  const hasAnyAttachment = !!photoPreview || !!videoFile || !!audioFile;

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="sm:max-w-lg max-h-[85vh] overflow-auto p-0"
          aria-describedby="occurrence-modal-description"
        >
          {/* Header */}
          <DialogHeader className="sticky top-0 bg-background border-b border-border px-4 py-3 z-10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-action/20 flex items-center justify-center"
                aria-hidden="true"
              >
                <MapPin
                  className="h-5 w-5 text-action-foreground"
                  style={{ color: "hsl(45, 93%, 40%)" }}
                />
              </div>
              <div>
                <DialogTitle className="font-heading font-semibold text-foreground">
                  Registrar ocorrência
                </DialogTitle>
                <DialogDescription id="occurrence-modal-description">
                  Localização: {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-4">
            {/* Aria live region for attachment status */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {attachmentStatus}
            </div>

            {/* Step: Category Selection */}
            {step === "category" && (
              <fieldset className="space-y-3 animate-fade-in">
                <legend className="sr-only">Selecione a categoria da ocorrência</legend>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione a categoria que melhor descreve a situação:
                </p>

                <div className="grid gap-2" role="radiogroup" aria-label="Categorias de ocorrência">
                  {occurrenceCategories.map((category, index) => (
                    <button
                      key={category.id}
                      ref={index === 0 ? firstCategoryRef : undefined}
                      onClick={() => handleCategorySelect(category.id)}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors text-left group focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      disabled={createMutation.isPending}
                      aria-label={`${category.label}: ${category.description}`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: `${category.color}20` }}
                        aria-hidden="true"
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      </div>

                      <div>
                        <p className="font-medium text-foreground text-sm">{category.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Step: Details */}
            {step === "details" && selectedCategory && (
              <div className="space-y-4 animate-fade-in">
                {/* Selected category indicator */}
                <div
                  className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ backgroundColor: `${selectedCategory.color}10` }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedCategory.color }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">{selectedCategory.label}</span>
                  <button
                    onClick={() => setStep("category")}
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-1"
                    disabled={createMutation.isPending}
                    aria-label="Alterar categoria selecionada"
                  >
                    Alterar
                  </button>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da ocorrência *</Label>
                  <Textarea
                    ref={descriptionRef}
                    id="description"
                    placeholder="Descreva brevemente a situação observada..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px] resize-none"
                    maxLength={500}
                    disabled={createMutation.isPending}
                    aria-describedby="description-hint"
                  />
                  <p id="description-hint" className="text-xs text-muted-foreground text-right">
                    {formData.description.length}/500 caracteres
                  </p>
                </div>

                {/* Attachments Section */}
                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium">Anexos (opcional)</legend>
                  
                  {/* Attachment error */}
                  {attachmentError && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20" role="alert">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <p className="text-xs text-destructive">{attachmentError}</p>
                    </div>
                  )}

                  {/* Offline pending indicator */}
                  {!isOnline && hasAnyAttachment && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
                      <WifiOff className="h-4 w-4 text-warning" aria-hidden="true" />
                      <span className="text-xs text-warning-foreground">Pendente de envio</span>
                    </div>
                  )}

                  {/* Attachment Grid - 2x2 */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Photo - Take photo */}
                    <label className="flex flex-col items-center justify-center gap-1.5 px-3 py-4 border border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <Camera className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <span className="text-xs text-muted-foreground text-center">Tirar foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoChange}
                        className="sr-only"
                        aria-label="Tirar foto com câmera"
                        disabled={createMutation.isPending}
                      />
                    </label>

                    {/* Photo - Upload */}
                    <label className="flex flex-col items-center justify-center gap-1.5 px-3 py-4 border border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <Upload className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <span className="text-xs text-muted-foreground text-center">Carregar foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                        aria-label="Carregar foto da galeria"
                        disabled={createMutation.isPending}
                      />
                    </label>

                    {/* Video */}
                    <label className="flex flex-col items-center justify-center gap-1.5 px-3 py-4 border border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <Video className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <span className="text-xs text-muted-foreground text-center">Gravar vídeo</span>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        capture="environment"
                        onChange={handleVideoChange}
                        className="sr-only"
                        aria-label="Gravar ou carregar vídeo"
                        disabled={createMutation.isPending}
                      />
                    </label>

                    {/* Audio */}
                    <button
                      type="button"
                      onClick={handleStartAudioRecording}
                      disabled={audioRecorder.isRecording || createMutation.isPending}
                      className="flex flex-col items-center justify-center gap-1.5 px-3 py-4 border border-dashed border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Gravar áudio"
                    >
                      <Mic className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <span className="text-xs text-muted-foreground text-center">Gravar áudio</span>
                    </button>
                  </div>

                  {/* Audio recorder error */}
                  {audioRecorder.error && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20" role="alert">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <p className="text-xs text-destructive">{audioRecorder.error}</p>
                    </div>
                  )}

                  {/* Audio Recording UI */}
                  {audioRecorder.isRecording && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" aria-hidden="true" />
                      <span className="text-sm font-mono text-destructive font-medium">
                        {formatRecordingTime(audioRecorder.recordingTime)}
                      </span>
                      <div className="flex-1" />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={handleStopAudioRecording}
                        className="gap-1"
                        aria-label="Parar gravação"
                      >
                        <Square className="h-3 w-3" aria-hidden="true" />
                        Parar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelAudioRecording}
                        aria-label="Cancelar gravação"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  )}

                  {/* Photo Preview */}
                  {photoPreview && (
                    <div className="space-y-2">
                      <div className="relative w-full max-w-[200px] rounded-lg overflow-hidden">
                        <img
                          src={photoPreview}
                          alt={photoAltText || "Pré-visualização da foto anexada à solicitação"}
                          className="w-full h-auto object-cover"
                        />
                        <button
                          onClick={() => {
                            setPhotoPreview(null);
                            setPhotoAltText("");
                            setFormData((prev) => ({ ...prev, photo: undefined }));
                            setAttachmentStatus("Foto removida.");
                          }}
                          className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center focus-visible:ring-2 focus-visible:ring-ring"
                          disabled={createMutation.isPending}
                          aria-label="Remover foto anexada"
                          type="button"
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                        {!isOnline && (
                          <span className="absolute bottom-1 left-1 text-[10px] bg-warning/90 text-warning-foreground px-1.5 py-0.5 rounded">
                            Pendente
                          </span>
                        )}
                      </div>
                      {/* Photo alt text field for accessibility */}
                      <div className="space-y-1">
                        <Label htmlFor="photo-alt-text" className="text-xs">
                          Descrição da imagem (acessibilidade)
                        </Label>
                        <Input
                          id="photo-alt-text"
                          type="text"
                          placeholder="Ex: Buraco na calçada próximo ao poste"
                          value={photoAltText}
                          onChange={(e) => setPhotoAltText(e.target.value)}
                          maxLength={150}
                          disabled={createMutation.isPending}
                          aria-describedby="photo-alt-hint"
                          className="text-sm"
                        />
                        <p id="photo-alt-hint" className="text-xs text-muted-foreground">
                          Opcional. Descreva o que aparece na foto para pessoas com deficiência visual.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Video Preview */}
                  {videoPreview && videoFile && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="h-4 w-4" aria-hidden="true" />
                        <span className="truncate flex-1">{videoFile.name}</span>
                        <span className="text-xs">({formatFileSize(videoFile.size)})</span>
                        {!isOnline && (
                          <span className="text-[10px] bg-warning/90 text-warning-foreground px-1.5 py-0.5 rounded">
                            Pendente
                          </span>
                        )}
                      </div>
                      <div className="relative w-full max-w-[280px] rounded-lg overflow-hidden bg-muted">
                        <video
                          src={videoPreview}
                          controls
                          muted
                          playsInline
                          className="w-full h-auto"
                          aria-label="Pré-visualização do vídeo anexado"
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleRemoveVideo}
                        disabled={createMutation.isPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Remover vídeo
                      </Button>
                    </div>
                  )}

                  {/* Audio Preview */}
                  {audioPreviewUrl && audioFile && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mic className="h-4 w-4" aria-hidden="true" />
                        <span>Áudio gravado</span>
                        <span className="text-xs">({formatFileSize(audioFile.size)})</span>
                        {!isOnline && (
                          <span className="text-[10px] bg-warning/90 text-warning-foreground px-1.5 py-0.5 rounded">
                            Pendente
                          </span>
                        )}
                      </div>
                      <audio
                        src={audioPreviewUrl}
                        controls
                        className="w-full max-w-[280px]"
                        aria-label="Pré-visualização do áudio gravado"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleRemoveAudio}
                        disabled={createMutation.isPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Remover áudio
                      </Button>
                    </div>
                  )}
                </fieldset>

                <Button
                  onClick={() => setStep("urgency")}
                  className="w-full"
                  disabled={!formData.description.trim() || createMutation.isPending}
                >
                  Continuar
                </Button>
              </div>
            )}

            {/* Step: Urgency & Consent */}
            {step === "urgency" && (
              <div className="space-y-4 animate-fade-in">
                <button
                  ref={backButtonRef}
                  onClick={() => setStep("details")}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-1"
                  disabled={createMutation.isPending}
                  aria-label="Voltar para etapa de detalhes"
                >
                  ← Voltar
                </button>

                {/* Urgency level */}
                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium">Qual a urgência desta situação?</legend>
                  <RadioGroup
                    value={formData.urgency}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, urgency: value as UrgencyLevelId }))
                    }
                    className="space-y-2"
                    aria-describedby="urgency-help"
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
                          aria-hidden="true"
                        />
                      </label>
                    ))}
                  </RadioGroup>
                </fieldset>

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
                      Li e concordo com a{" "}
                      <a href="/politica-de-privacidade" className="text-accent hover:underline">
                        Política de Privacidade
                      </a>{" "}
                      e os{" "}
                      <a href="/termos-de-uso" className="text-accent hover:underline">
                        Termos de Uso
                      </a>
                      . Entendo que este registro será usado para fins de coordenação urbana.
                    </label>
                  </div>

                  {/* Anonymous checkbox - only show when NOT logged in */}
                  {!isLoggedIn && (
                    <div className="flex items-start gap-3 mt-2">
                      <Checkbox
                        id="anonymous"
                        checked={formData.anonymous}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, anonymous: checked === true }))
                        }
                      />
                      <label htmlFor="anonymous" className="text-sm leading-relaxed cursor-pointer">
                        Registrar ocorrência anônima
                      </label>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">{appInfo.privacyNote}</p>
                </div>

                {/* Warning */}
                <div
                  className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20"
                  role="alert"
                >
                  <AlertCircle
                    className="h-4 w-4 text-warning mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-xs text-warning-foreground">
                    Esta plataforma não é canal de emergência. Em situações de risco, ligue 190, 193 ou
                    192.
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full gap-2"
                  disabled={!formData.privacyConsent || createMutation.isPending}
                  aria-describedby="submit-status"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {createMutation.isPending ? "Enviando..." : "Enviar registro"}
                </Button>
                <div id="submit-status" className="sr-only" aria-live="polite">
                  {createMutation.isPending ? "Enviando solicitação, por favor aguarde." : ""}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ProtocolSuccessModal protocolNumber={successProtocol} onClose={handleSuccessModalClose} />
    </>
  );
}
