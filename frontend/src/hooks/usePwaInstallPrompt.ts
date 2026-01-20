import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type Platform = "ios" | "android" | "desktop" | "unknown";

function detectPlatform(): Platform {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /ipad|iphone|ipod/.test(userAgent) && !(window as any).MSStream;
  const isAndroid = /android/.test(userAgent);
  
  if (isIOS) return "ios";
  if (isAndroid) return "android";
  if (/windows|macintosh|linux/.test(userAgent) && !/mobile/.test(userAgent)) return "desktop";
  return "unknown";
}

export function usePwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallAvailable, setIsInstallAvailable] = useState(false);
  const [platform] = useState<Platform>(() => detectPlatform());

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallAvailable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallAvailable(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallAvailable(false);
    }
  }, [deferredPrompt]);

  return {
    isInstallAvailable,
    promptInstall,
    platform,
  };
}
