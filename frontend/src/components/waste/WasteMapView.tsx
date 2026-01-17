import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapConfig } from '@/config/app.config';
import { wasteTypes, wasteStatuses } from '@/config/waste.config';
import { useWasteStore } from '@/stores/wasteStore';
import { MapControls } from '@/components/map/MapControls';
import { WasteReportModal } from '@/components/waste/WasteReportModal';
import { RecyclableOfferModal } from '@/components/waste/RecyclableOfferModal';
import { WasteDetailPanel } from '@/components/waste/WasteDetailPanel';
import { RecyclableDetailPanel } from '@/components/waste/RecyclableDetailPanel';
import type { WasteReport, RecyclableOffer, Coordinates } from '@/types/waste';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const getWasteIconSvg = (typeId: string) => {
  const type = wasteTypes.find(t => t.id === typeId);
  const color = type?.color || '#64748b';
  
  const icons: Record<string, string> = {
    descarte_irregular: `<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    ponto_viciado: `<path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" stroke="${color}" stroke-width="2" fill="none"/><line x1="8" y1="12" x2="16" y2="12" stroke="${color}" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="16" stroke="${color}" stroke-width="2" transform="rotate(45 12 12)"/>`,
    entulho_volumosos: `<path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="${color}" stroke-width="2" fill="none"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="${color}" stroke-width="2" fill="none"/><line x1="12" y1="22.08" x2="12" y2="12" stroke="${color}" stroke-width="2"/>`,
    organicos: `<path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" stroke="${color}" stroke-width="2" fill="none"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="${color}" stroke-width="2" fill="none"/>`,
    reciclaveis_mistos: `<path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 00-.001-1.78l-1.936-3.33M9.5 5L12 2l2.5 3" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M12 5v6.5" stroke="${color}" stroke-width="2"/><path d="M7.196 9.5l5.5 9.5" stroke="${color}" stroke-width="2" stroke-linecap="round"/><path d="M16.822 12.5l-5.5 9.5" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`,
    papel: `<path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" stroke="${color}" stroke-width="2" fill="none"/><polyline points="14 2 14 8 20 8" stroke="${color}" stroke-width="2" fill="none"/><line x1="16" y1="13" x2="8" y2="13" stroke="${color}" stroke-width="2"/><line x1="16" y1="17" x2="8" y2="17" stroke="${color}" stroke-width="2"/>`,
    plastico: `<path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M7.89 9.311a10.75 10.75 0 008.22 0M12 22v-6M10 22h4" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M8 22h8M6 9.3h12a1 1 0 01.87 1.48l-3.65 6.52a2 2 0 01-1.74 1h-2.96a2 2 0 01-1.74-1L5.13 10.78A1 1 0 016 9.3z" stroke="${color}" stroke-width="2" fill="none"/>`,
    vidro: `<path d="M8 22h8M7 10h10M12 15v7M12 15a5 5 0 005-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 005 5z" stroke="${color}" stroke-width="2" fill="none"/>`,
    metal: `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="${color}" stroke-width="2" fill="none"/>`,
    eletroeletronicos: `<rect width="14" height="20" x="5" y="2" rx="2" ry="2" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 18h.01" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`,
    outros: `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 17h.01" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`,
  };
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${icons[typeId] || icons.outros}</svg>`;
};

const getRecyclableIconSvg = () => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 00-.001-1.78l-1.936-3.33M9.5 5L12 2l2.5 3" stroke="#16a34a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M12 5v6.5" stroke="#16a34a" stroke-width="2"/>
    <path d="M7.196 9.5l5.5 9.5" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/>
    <path d="M16.822 12.5l-5.5 9.5" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
};

interface WasteMapViewProps {
  showPanel?: boolean;
}

export function WasteMapView({ showPanel = true }: WasteMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  
  const { wasteReports, recyclableOffers } = useWasteStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates | null>(null);
  const [selectedWaste, setSelectedWaste] = useState<WasteReport | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<RecyclableOffer | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapConfig.style,
      center: [mapConfig.defaultCenter.lng, mapConfig.defaultCenter.lat],
      zoom: mapConfig.defaultZoom,
      maxZoom: mapConfig.maxZoom,
      minZoom: mapConfig.minZoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    // Handle map clicks for new registrations
    map.current.on('click', (e) => {
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest('.waste-marker') || target.closest('.recyclable-marker')) return;
      
      setSelectedCoordinates({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      setIsModalOpen(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update waste markers
  useEffect(() => {
    if (!map.current) return;

    const currentIds = new Set(wasteReports.map(w => w.id));
    
    // Remove old markers
    markersRef.current.forEach((marker, id) => {
      if (id.startsWith('waste-') && !currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add/update markers
    wasteReports.forEach((report) => {
      if (markersRef.current.has(report.id)) return;
      
      const type = wasteTypes.find(t => t.id === report.type);
      const status = wasteStatuses.find(s => s.id === report.status);
      
      const el = document.createElement('div');
      el.className = 'waste-marker';
      el.innerHTML = `
        <div style="
          width: 44px;
          height: 44px;
          background: white;
          border: 3px solid ${type?.color || '#64748b'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          position: relative;
        ">
          ${getWasteIconSvg(report.type)}
          <div style="
            position: absolute;
            bottom: -4px;
            right: -4px;
            width: 14px;
            height: 14px;
            background: ${status?.color || '#64748b'};
            border: 2px solid white;
            border-radius: 50%;
          "></div>
        </div>
      `;
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedWaste(report);
        setSelectedOffer(null);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([report.coordinates.lng, report.coordinates.lat])
        .addTo(map.current!);
      
      markersRef.current.set(report.id, marker);
    });
  }, [wasteReports]);

  // Update recyclable markers
  useEffect(() => {
    if (!map.current) return;

    const currentIds = new Set(recyclableOffers.map(o => o.id));
    
    // Remove old markers
    markersRef.current.forEach((marker, id) => {
      if (id.startsWith('offer-') && !currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add/update markers
    recyclableOffers.forEach((offer) => {
      if (markersRef.current.has(offer.id)) return;
      
      const el = document.createElement('div');
      el.className = 'recyclable-marker';
      el.innerHTML = `
        <div style="
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          border: 3px solid white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
          cursor: pointer;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 00-.001-1.78l-1.936-3.33M9.5 5L12 2l2.5 3"/>
            <path d="M12 5v6.5"/>
          </svg>
        </div>
      `;
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedOffer(offer);
        setSelectedWaste(null);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([offer.coordinates.lng, offer.coordinates.lat])
        .addTo(map.current!);
      
      markersRef.current.set(offer.id, marker);
    });
  }, [recyclableOffers]);

  const handleZoomIn = useCallback(() => map.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => map.current?.zoomOut(), []);
  const handleGeolocate = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        map.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 17,
        });
      });
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onGeolocate={handleGeolocate}
      />

      {/* Waste Report Modal */}
      {isModalOpen && selectedCoordinates && (
        <WasteReportModal
          coordinates={selectedCoordinates}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCoordinates(null);
          }}
          onSwitchToOffer={() => {
            setIsModalOpen(false);
            setIsOfferModalOpen(true);
          }}
        />
      )}

      {/* Recyclable Offer Modal */}
      {isOfferModalOpen && selectedCoordinates && (
        <RecyclableOfferModal
          coordinates={selectedCoordinates}
          onClose={() => {
            setIsOfferModalOpen(false);
            setSelectedCoordinates(null);
          }}
          onSwitchToReport={() => {
            setIsOfferModalOpen(false);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Waste Detail Panel */}
      {selectedWaste && (
        <WasteDetailPanel
          report={selectedWaste}
          onClose={() => setSelectedWaste(null)}
        />
      )}

      {/* Recyclable Detail Panel */}
      {selectedOffer && (
        <RecyclableDetailPanel
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </div>
  );
}
