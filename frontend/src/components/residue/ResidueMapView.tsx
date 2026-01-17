import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapConfig } from '@/config/app.config';
import { residueTypes, residueStatuses } from '@/config/residue.config';
import { useResidueStore } from '@/stores/residueStore';
import { MapControls } from '@/components/map/MapControls';
import { ResidueReportModal } from '@/components/residue/ResidueReportModal';
import { ReuseOfferModal } from '@/components/residue/ReuseOfferModal';
import { ResidueDetailPanel } from '@/components/residue/ResidueDetailPanel';
import { ReuseDetailPanel } from '@/components/residue/ReuseDetailPanel';
import type { ResidueReport, ReuseOffer, Coordinates } from '@/types/residue';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const getResidueIconSvg = (typeId: string) => {
  const type = residueTypes.find(t => t.id === typeId);
  const color = type?.color || '#64748b';
  
  const icons: Record<string, string> = {
    domiciliar: `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="${color}" stroke-width="2" fill="none"/><polyline points="9 22 9 12 15 12 15 22" stroke="${color}" stroke-width="2" fill="none"/>`,
    reciclavel: `<path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 00-.001-1.78l-1.936-3.33M9.5 5L12 2l2.5 3" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M12 5v6.5M7.196 9.5l5.5 9.5M16.822 12.5l-5.5 9.5" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`,
    volumoso: `<path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3M4 11v9a2 2 0 002 2h12a2 2 0 002-2v-9" stroke="${color}" stroke-width="2" fill="none"/><path d="M4 11h16M9 4v7M15 4v7" stroke="${color}" stroke-width="2"/>`,
    entulho: `<rect x="2" y="6" width="20" height="12" rx="2" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 6v12M2 12h20" stroke="${color}" stroke-width="2"/>`,
    verde: `<path d="M12 22c4-4 8-7.582 8-12a8 8 0 10-16 0c0 4.418 4 8 8 12z" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 12a3 3 0 100-6 3 3 0 000 6z" stroke="${color}" stroke-width="2" fill="none"/>`,
    perigoso: `<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="${color}" stroke-width="2" fill="none"/><line x1="12" y1="9" x2="12" y2="13" stroke="${color}" stroke-width="2"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="${color}" stroke-width="2"/>`,
  };
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${icons[typeId] || icons.domiciliar}</svg>`;
};

interface ResidueMapViewProps {
  activeFilters?: string[];
}

export function ResidueMapView({ activeFilters = [] }: ResidueMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  
  const { residueReports, reuseOffers } = useResidueStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates | null>(null);
  const [selectedResidue, setSelectedResidue] = useState<ResidueReport | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<ReuseOffer | null>(null);

  // Filter reports based on active filters
  const filteredReports = residueReports.filter(report => {
    if (activeFilters.length === 0) return true;
    return activeFilters.includes(report.type) || activeFilters.includes(report.status);
  });

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
      if (target.closest('.residue-marker') || target.closest('.reuse-marker')) return;
      
      setSelectedCoordinates({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      setIsModalOpen(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update residue markers
  useEffect(() => {
    if (!map.current) return;

    const currentIds = new Set(filteredReports.map(r => r.id));
    
    // Remove old markers
    markersRef.current.forEach((marker, id) => {
      if (id.startsWith('res-') && !currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add/update markers
    filteredReports.forEach((report) => {
      if (markersRef.current.has(report.id)) return;
      
      const type = residueTypes.find(t => t.id === report.type);
      const status = residueStatuses.find(s => s.id === report.status);
      
      const el = document.createElement('div');
      el.className = 'residue-marker';
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
          ${getResidueIconSvg(report.type)}
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
        setSelectedResidue(report);
        setSelectedOffer(null);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([report.coordinates.lng, report.coordinates.lat])
        .addTo(map.current!);
      
      markersRef.current.set(report.id, marker);
    });
  }, [filteredReports]);

  // Update reuse offer markers
  useEffect(() => {
    if (!map.current) return;

    const currentIds = new Set(reuseOffers.map(o => o.id));
    
    // Remove old markers
    markersRef.current.forEach((marker, id) => {
      if (id.startsWith('reuse-') && !currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add/update markers
    reuseOffers.forEach((offer) => {
      if (markersRef.current.has(offer.id)) return;
      
      const el = document.createElement('div');
      el.className = 'reuse-marker';
      el.innerHTML = `
        <div style="
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          border: 3px solid white;
          border-radius: 10px;
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
        setSelectedResidue(null);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([offer.coordinates.lng, offer.coordinates.lat])
        .addTo(map.current!);
      
      markersRef.current.set(offer.id, marker);
    });
  }, [reuseOffers]);

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

      {/* Residue Report Modal */}
      {isModalOpen && selectedCoordinates && (
        <ResidueReportModal
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

      {/* Reuse Offer Modal */}
      {isOfferModalOpen && selectedCoordinates && (
        <ReuseOfferModal
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

      {/* Residue Detail Panel */}
      {selectedResidue && (
        <ResidueDetailPanel
          report={selectedResidue}
          onClose={() => setSelectedResidue(null)}
        />
      )}

      {/* Reuse Detail Panel */}
      {selectedOffer && (
        <ReuseDetailPanel
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </div>
  );
}
