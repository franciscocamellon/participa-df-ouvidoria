import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "@/config/mapbox";
import { mapConfig, occurrenceCategories } from "@/config/app.config";
import { useOccurrenceStore } from "@/stores/occurrenceStore";
import { MapControls } from "./MapControls";
import { OccurrenceModal } from "@/components/occurrence/OccurrenceModal";
import { OccurrenceDetailCard } from "@/components/occurrence/OccurrenceDetailCard";
import { toast } from "sonner";

// SVG icons for each category (rendered as strings for DOM injection)
const getCategoryIconSvg = (categoryId: string): string => {
  const icons: Record<string, string> = {
    URBAN_MAINTENANCE: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
    LIGHTING: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    WASTE_DISPOSAL: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
    URBAN_FURNITURE: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
    INCIDENT: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
    ACCESSIBILITY: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>`,
    VULNERABILITY: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>`,
    ENVIRONMENTAL: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z"/><path d="M12 19v3"/></svg>`,
  };
  return (
    icons[categoryId] ||
    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/></svg>`
  );
};

interface MapViewProps {
  showCameras?: boolean;
}

export function MapView({ showCameras = false }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  const [isMapReady, setIsMapReady] = useState(false);
  const {
    occurrences,
    selectedOccurrence,
    isCreating,
    pendingCoordinates,
    selectOccurrence,
    setIsCreating,
    setPendingCoordinates,
  } = useOccurrenceStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapConfig.style,
      center: [mapConfig.defaultCenter.lng, mapConfig.defaultCenter.lat],
      zoom: mapConfig.defaultZoom,
      maxZoom: mapConfig.maxZoom,
      minZoom: mapConfig.minZoom,
    });

    map.current.on("load", () => {
      setIsMapReady(true);
    });

    // Handle map click for creating occurrences
    map.current.on("click", (e) => {
      // Check if clicked on a marker by looking at the target
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest(".occurrence-marker") || target.closest(".camera-marker")) {
        return; // Don't create occurrence if clicking on a marker
      }

      setPendingCoordinates({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, approxAddress: "" });
      setIsCreating(true);
      selectOccurrence(null);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update occurrence markers - using a Map to track markers by ID
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    const currentMarkerIds = new Set(markersRef.current.keys());
    const newOccurrenceIds = new Set(occurrences.map((o) => o.id));

    // Remove markers that no longer exist
    currentMarkerIds.forEach((id) => {
      if (!newOccurrenceIds.has(id)) {
        const marker = markersRef.current.get(id);
        marker?.remove();
        markersRef.current.delete(id);
      }
    });

    // Add or update markers
    occurrences.forEach((occurrence) => {
      const category = occurrenceCategories.find((c) => c.id === occurrence.category);
      if (!category) return;

      // Skip if marker already exists with same position
      const existingMarker = markersRef.current.get(occurrence.id);
      if (existingMarker) {
        return;
      }

      // Get SVG icon based on category
      const iconSvg = getCategoryIconSvg(occurrence.category);

      // Create marker element
      const el = document.createElement("div");
      el.className = "occurrence-marker";
      el.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: ${category.color};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 12px rgba(0,0,0,0.25);
        border: 3px solid white;
        cursor: pointer;
      `;

      // Add icon
      el.innerHTML = iconSvg;

      // Hover effects
      el.addEventListener("mouseenter", () => {
        el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.45)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.boxShadow = "0 3px 12px rgba(0,0,0,0.25)";
      });

      // Click handler - get fresh occurrence data
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        // Get the latest occurrence data from store
        const currentOccurrence = useOccurrenceStore.getState().occurrences.find((o) => o.id === occurrence.id);
        if (currentOccurrence) {
          selectOccurrence(currentOccurrence);
          setIsCreating(false);
        }
      });

      // Create marker at fixed geographic coordinates
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([occurrence.coordinates.longitude, occurrence.coordinates.latitude])
        .addTo(map.current!);

      markersRef.current.set(occurrence.id, marker);
    });
  }, [occurrences, isMapReady, selectOccurrence, setIsCreating]);

  const handleZoomIn = useCallback(() => {
    map.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    map.current?.zoomOut();
  }, []);

  const handleGeolocate = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.current?.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 16,
            duration: 1500,
          });
        },
        () => {
          toast.error("Não foi possível obter sua localização.");
        },
      );
    } else {
      toast.error("Geolocalização não suportada pelo navegador.");
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsCreating(false);
    setPendingCoordinates(null);
  }, [setIsCreating, setPendingCoordinates]);

  const handleCloseDetail = useCallback(() => {
    selectOccurrence(null);
  }, [selectOccurrence]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Map Controls */}
      <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onGeolocate={handleGeolocate} />

      {/* Occurrence Creation Modal */}
      {isCreating && pendingCoordinates && (
        <OccurrenceModal coordinates={pendingCoordinates} onClose={handleCloseModal} />
      )}

      {/* Occurrence Detail Card */}
      {selectedOccurrence && <OccurrenceDetailCard occurrence={selectedOccurrence} onClose={handleCloseDetail} />}

      {/* Click instruction */}
      {!isCreating && !selectedOccurrence && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-2 text-sm text-muted-foreground animate-fade-in">
          Clique no mapa para registrar uma ocorrência
        </div>
      )}

      {/* Occurrence count indicator */}
      <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2 text-sm">
        <span className="font-medium text-foreground">{occurrences.length}</span>
        <span className="text-muted-foreground ml-1">ocorrências registradas</span>
      </div>
    </div>
  );
}
