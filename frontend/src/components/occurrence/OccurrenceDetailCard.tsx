import { 
  X, Clock, Edit2, Save, Trash2,
  Lightbulb, Trash, Construction, AlertTriangle, 
  Accessibility, HeartHandshake, TreeDeciduous, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { occurrenceCategories, occurrenceStatuses, urgencyLevels } from '@/config/app.config';
import { useOccurrenceStore } from '@/stores/occurrenceStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Occurrence } from '@/types/occurrence';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Map category IDs to icons
const categoryIcons: Record<string, React.ReactNode> = {
  zeladoria: <Sparkles className="h-5 w-5 text-white" />,
  iluminacao: <Lightbulb className="h-5 w-5 text-white" />,
  descarte: <Trash className="h-5 w-5 text-white" />,
  mobiliario: <Construction className="h-5 w-5 text-white" />,
  incidente: <AlertTriangle className="h-5 w-5 text-white" />,
  acessibilidade: <Accessibility className="h-5 w-5 text-white" />,
  vulnerabilidade: <HeartHandshake className="h-5 w-5 text-white" />,
  ambiental: <TreeDeciduous className="h-5 w-5 text-white" />,
};

interface OccurrenceDetailCardProps {
  occurrence: Occurrence;
  onClose: () => void;
}

export function OccurrenceDetailCard({ occurrence, onClose }: OccurrenceDetailCardProps) {
  const updateOccurrenceDescription = useOccurrenceStore((state) => state.updateOccurrenceDescription);
  const deleteOccurrence = useOccurrenceStore((state) => state.deleteOccurrence);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(occurrence.description);

  const category = occurrenceCategories.find((c) => c.id === occurrence.category);
  const status = occurrenceStatuses.find((s) => s.id === occurrence.status);
  const urgency = urgencyLevels.find((u) => u.id === occurrence.urgency);

  const canEdit = occurrence.status === 'recebido';

  const handleSaveDescription = () => {
    if (editedDescription.trim()) {
      updateOccurrenceDescription(occurrence.id, editedDescription.trim());
      setIsEditing(false);
      toast.success('Descrição atualizada.');
    }
  };

  const handleDelete = () => {
    deleteOccurrence(occurrence.id);
    onClose();
    toast.success('Ocorrência excluída.');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="absolute left-4 top-4 bottom-4 w-[380px] max-w-[calc(100%-2rem)] z-20 animate-fade-in">
      <div className="h-full bg-card rounded-xl shadow-civic-xl border border-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: category?.color }}
            >
              {categoryIcons[occurrence.category] || (
                <div className="w-4 h-4 rounded-full bg-white/30" />
              )}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground text-sm">
                {category?.label}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatDate(occurrence.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" aria-label="Excluir">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir ocorrência?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. A ocorrência será removida permanentemente do sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Status badge */}
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: `${status?.color}15`,
              color: status?.color,
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: status?.color }}
            />
            {status?.label}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Descrição
              </h4>
              {canEdit && !isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="h-7 text-xs gap-1"
                >
                  <Edit2 className="h-3 w-3" />
                  Editar
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="min-h-[80px] resize-none"
                  maxLength={500}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveDescription} className="gap-1">
                    <Save className="h-3 w-3" />
                    Salvar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedDescription(occurrence.description);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-foreground">{occurrence.description}</p>
            )}
          </div>

          {/* Photo */}
          {occurrence.photoUrl && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Foto anexada
              </h4>
              <img 
                src={occurrence.photoUrl} 
                alt="Foto da ocorrência" 
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Urgency */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Urgência
            </h4>
            <div 
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-sm"
              style={{ 
                backgroundColor: `${urgency?.color}15`,
                color: urgency?.color,
              }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: urgency?.color }}
              />
              {urgency?.label}
            </div>
          </div>

          {/* Status history */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Histórico
            </h4>
            <div className="space-y-3">
              {occurrence.statusHistory.map((entry, index) => {
                const entryStatus = occurrenceStatuses.find((s) => s.id === entry.status);
                return (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: entryStatus?.color }}
                      />
                      {index < occurrence.statusHistory.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="text-sm font-medium text-foreground">
                        {entryStatus?.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(entry.timestamp)}
                      </p>
                      {entry.note && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current status explanation */}
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">
              {status?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
