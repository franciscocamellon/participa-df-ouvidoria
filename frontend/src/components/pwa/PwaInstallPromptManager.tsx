import { useState, useEffect, useCallback } from "react";
import { usePwaInstallPrompt } from "@/hooks/usePwaInstallPrompt";
import { PwaInstallModal } from "./PwaInstallModal";

const STORAGE_KEY = "pwa_install_dismissed_until";
const DISMISS_DURATION_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

function isDismissed(): boolean {
  try {
    const dismissedUntil = localStorage.getItem(STORAGE_KEY);
    if (!dismissedUntil) return false;
    return Date.now() < parseInt(dismissedUntil, 10);
  } catch {
    return false;
  }
}

function setDismissed(): void {
  try {
    const dismissUntil = Date.now() + DISMISS_DURATION_MS;
    localStorage.setItem(STORAGE_KEY, dismissUntil.toString());
  } catch {
    // localStorage not available
  }
}

export function PwaInstallPromptManager() {
  const { isInstallAvailable, promptInstall, platform } = usePwaInstallPrompt();
  const [modalOpen, setModalOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Determine if we should show the prompt
  const shouldShow = useCallback(() => {
    // Already shown this session
    if (hasShown) return false;
    // User dismissed recently
    if (isDismissed()) return false;
    // PWA install is available, or on iOS (show instructions)
    return isInstallAvailable || platform === "ios";
  }, [hasShown, isInstallAvailable, platform]);

  useEffect(() => {
    if (!shouldShow()) return;

    // Show after a short delay or on first user interaction
    let timeoutId: ReturnType<typeof setTimeout>;
    let hasTriggered = false;

    const showModal = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      setModalOpen(true);
      setHasShown(true);
      cleanup();
    };

    const handleInteraction = () => {
      showModal();
    };

    const cleanup = () => {
      clearTimeout(timeoutId);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    // Show after 3 seconds or on first interaction
    timeoutId = setTimeout(showModal, 3000);
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });
    window.addEventListener("keydown", handleInteraction, { once: true });

    return cleanup;
  }, [shouldShow]);

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setDismissed();
    }
  };

  const handleInstall = async () => {
    await promptInstall();
  };

  // Only render if we should potentially show the modal
  if (!isInstallAvailable && platform !== "ios") {
    return null;
  }

  return (
    <PwaInstallModal
      open={modalOpen}
      onOpenChange={handleOpenChange}
      onInstall={handleInstall}
      isInstallAvailable={isInstallAvailable}
      platform={platform}
    />
  );
}
