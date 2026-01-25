import { CursorHighlightOverlay } from "@/components/a11y/CursorHighlightOverlay";
import { ReadingGuideOverlay } from "@/components/a11y/ReadingGuideOverlay";
import { ReadingMaskOverlay } from "@/components/a11y/ReadingMaskOverlay";
import { FocusSpotlightOverlay } from "@/components/a11y/FocusSpotlightOverlay";
import { VirtualKeyboardOverlay } from "@/components/a11y/VirtualKeyboardOverlay";
import { AltTextOverlay } from "@/components/a11y/AltTextOverlay";
import { LibrasLoader } from "@/components/a11y/LibrasLoader";

export function AcessibilidadeOverlays() {
  return (
    <>
      <LibrasLoader />
      <AltTextOverlay />
      <FocusSpotlightOverlay />
      <ReadingMaskOverlay />
      <ReadingGuideOverlay />
      <CursorHighlightOverlay />
      <VirtualKeyboardOverlay />
    </>
  );
}
