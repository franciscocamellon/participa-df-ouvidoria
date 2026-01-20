import { Cloud } from "lucide-react";
import { usePendingSyncCount } from "@/hooks/usePendingSyncCount";

/**
 * Compact badge showing number of pending offline occurrences
 * Only visible when there are items waiting to sync
 */
export function PendingSyncBadge() {
  const count = usePendingSyncCount();

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-medium">
      <Cloud className="h-3.5 w-3.5" />
      <span>Pendentes: {count}</span>
    </div>
  );
}
