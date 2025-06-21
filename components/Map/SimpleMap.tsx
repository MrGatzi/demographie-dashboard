'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, GeoJSON, Marker } from 'react-leaflet';
import { Feature, Geometry } from 'geojson';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useGeoData } from '@/app/hooks/useGeoData';

interface WahlkreisProperties {
  iso: string;
  name: string;
}

type WahlkreisFeature = Feature<Geometry, WahlkreisProperties>;

// Loading component
const MapLoadingSpinner = () => (
  <div className="w-full h-[600px] flex items-center justify-center bg-muted/50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading map data...</p>
    </div>
  </div>
);

// Error component
const MapErrorDisplay = ({ error }: { error: string }) => (
  <div className="w-full h-[600px] flex items-center justify-center bg-destructive/10 rounded-lg">
    <div className="text-center">
      <p className="text-destructive mb-2">Error loading map data</p>
      <p className="text-sm text-muted-foreground">{error}</p>
    </div>
  </div>
);

// District label marker component
const DistrictLabel = ({ feature, map }: { feature: WahlkreisFeature; map: L.Map | null }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!map || !feature.geometry) return;

    const layer = L.geoJSON(feature);
    const bounds = layer.getBounds();
    const center = bounds.getCenter();
    setPosition([center.lat, center.lng]);
  }, [feature, map]);

  if (!position) return null;

  const divIcon = L.divIcon({
    className: 'district-label-marker',
    html: `
      <div class="flex flex-col items-center justify-center pointer-events-none">
        <div class="text-xs font-bold text-foreground drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          ${feature.properties.iso}
        </div>
        <div class="text-[10px] font-medium text-foreground/80 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] max-w-[80px] text-center truncate">
          ${feature.properties.name}
        </div>
      </div>
    `,
    iconSize: [80, 40],
    iconAnchor: [40, 20],
  });

  return <Marker position={position} icon={divIcon} interactive={false} />;
};

// Map configuration
const MAP_CONFIG = {
  center: [47.7, 13.3] as [number, number],
  zoom: 7,
  style: { 
    height: '100%', 
    width: '100%', 
    backgroundColor: 'rgb(var(--background))',
  },
  maxBounds: [[46.0, 9.5], [49.0, 17.0]] as L.LatLngBoundsExpression,
  minZoom: 6,
  maxZoom: 10,
};

export function SimpleMap({ selectedDistrict, setSelectedDistrict }: { selectedDistrict: string | null, setSelectedDistrict: (district: string | null) => void }) {
  const { geoData, loading, error } = useGeoData('/data/geojson/wahlkreise.json');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  // District styling based on state
  const getDistrictStyle = (feature?: WahlkreisFeature) => {
    if (!feature?.properties) {
      return {
        fillColor: '#6366f1',
        weight: 1,
        opacity: 1,
        color: '#4f46e5',
        fillOpacity: 0.4,
      };
    }

    const isSelected = selectedDistrict === feature.properties.iso;
    const isHovered = hoveredDistrict === feature.properties.iso;

    // Different colors for different states
    if (isSelected) {
      return {
        fillColor: '#10b981', // emerald-500 - selected color
        weight: 2,
        opacity: 1,
        color: '#059669', // emerald-600
        fillOpacity: 0.6,
        dashArray: '',
      };
    }

    if (isHovered) {
      return {
        fillColor: '#6366f1', // indigo-500 - hover color
        weight: 2,
        opacity: 1,
        color: '#4f46e5', // indigo-600
        fillOpacity: 0.5,
        dashArray: '',
      };
    }

    // Default state
    return {
      fillColor: '#6366f1',
      weight: 1,
      opacity: 0.8,
      color: '#4f46e5',
      fillOpacity: 0.3,
      dashArray: '',
    };
  };

  // Handle district interactions
  const handleDistrictFeature = (feature: WahlkreisFeature, layer: L.Layer) => {
    if (!feature.properties) return;

    const { iso, name } = feature.properties;

    // Mouse events
    layer.on({
      mouseover: () => {
        if (selectedDistrict !== iso) { // Only change hover if not selected
          setHoveredDistrict(iso);
          (layer as L.Path).setStyle(getDistrictStyle(feature));
        }
      },
      mouseout: () => {
        setHoveredDistrict(null);
        (layer as L.Path).setStyle(getDistrictStyle(feature));
      },
      click: () => {
        setSelectedDistrict(iso === selectedDistrict ? null : iso);
        // Update all layers to reflect new selection
        if (geoJsonRef.current) {
          geoJsonRef.current.eachLayer((layer: any) => {
            if (layer.feature) {
              layer.setStyle(getDistrictStyle(layer.feature));
            }
          });
        }
      },
    });
  };

  if (loading || !geoData) return <MapLoadingSpinner />;
  if (error) return <MapErrorDisplay error={error} />;

  return (
    <div className="w-full h-[600px] overflow-hidden bg-transparent">
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        style={MAP_CONFIG.style}
        className="z-0 leaflet-clean"
        zoomControl={false}
        attributionControl={false}
        maxBounds={MAP_CONFIG.maxBounds}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        boxZoom={false}
        keyboard={true}
        ref={mapRef}
      >
        <GeoJSON
          ref={geoJsonRef}
          data={geoData}
          style={getDistrictStyle}
          onEachFeature={handleDistrictFeature}
        />
        
        {/* Add district labels */}
        {geoData.features.map((feature: WahlkreisFeature) => (
          <DistrictLabel 
            key={feature.properties?.iso} 
            feature={feature} 
            map={mapRef.current}
          />
        ))}
      </MapContainer>
    </div>
  );
}
