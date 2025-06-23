'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, GeoJSON, Marker } from 'react-leaflet';
import { Feature, Geometry } from 'geojson';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useGeoData } from '@/app/hooks/useGeoData';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface WahlkreisProperties {
  iso: string;
  name: string;
  mandate?: string;
}

type WahlkreisFeature = Feature<Geometry, WahlkreisProperties>;

// Region groupings for drill-down functionality - All Austrian Bundesländer
const REGION_GROUPS = {
  'WIEN': {
    name: 'W',
    fullName: 'Wien',
    districts: ['9A', '9B', '9C', '9D', '9E', '9f', '9G'],
    bounds: [[48.12, 16.25], [48.32, 16.45]] as L.LatLngBoundsExpression,
    zoom: 11
  },
  'NIEDEROESTERREICH': {
    name: 'NÖ',
    fullName: 'Niederösterreich',
    districts: ['3A', '3B', '3C', '3D', '3E', '3F', '3G'],
    bounds: [[47.3, 14.2], [48.9, 17.1]] as L.LatLngBoundsExpression,
    zoom: 8
  },
  'OBEROESTERREICH': {
    name: 'OÖ',
    fullName: 'Oberösterreich',
    districts: ['4A', '4B', '4C', '4D', '4E'],
    bounds: [[47.7, 13.0], [48.8, 15.1]] as L.LatLngBoundsExpression,
    zoom: 8
  },
  'SALZBURG': {
    name: 'S',
    fullName: 'Salzburg',
    districts: ['5A', '5B', '5C'],
    bounds: [[46.8, 12.1], [47.9, 13.9]] as L.LatLngBoundsExpression,
    zoom: 12
  },
  'STEIERMARK': {
    name: 'ST',
    fullName: 'Steiermark',
    districts: ['6A', '6B', '6C', '6D'],
    bounds: [[46.6, 13.6], [47.8, 16.2]] as L.LatLngBoundsExpression,
    zoom: 8
  },
  'TIROL': {
    name: 'T',
    fullName: 'Tirol',
    districts: ['7A', '7B', '7C', '7D', '7E'],
    bounds: [[46.8, 10.5], [47.7, 12.9]] as L.LatLngBoundsExpression,
    zoom: 8
  },
  'VORARLBERG': {
    name: 'V',
    fullName: 'Vorarlberg',
    districts: ['8A', '8B'],
    bounds: [[47.0, 9.4], [47.6, 10.3]] as L.LatLngBoundsExpression,
    zoom: 9
  },
  'KAERNTEN': {
    name: 'K',
    fullName: 'Kärnten',
    districts: ['2A', '2B', '2C', '2D'],
    bounds: [[46.4, 12.8], [47.1, 15.0]] as L.LatLngBoundsExpression,
    zoom: 9
  },
  'BURGENLAND': {
    name: 'B',
    fullName: 'Burgenland',
    districts: ['1A', '1B'],
    bounds: [[46.8, 16.0], [47.9, 17.3]] as L.LatLngBoundsExpression,
    zoom: 9
  }
};

type RegionKey = keyof typeof REGION_GROUPS;

interface DrillDownState {
  currentRegion: RegionKey | null;
  originalBounds: L.LatLngBoundsExpression;
  originalZoom: number;
}

//done to fix nextjs build
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

// Loading component
const MapLoadingSpinner = () => (
  <div className="w-full h-116 flex items-center justify-center bg-transparent rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading map data...</p>
    </div>
  </div>
);

// Error component
const MapErrorDisplay = ({ error }: { error: string }) => (
  <div className="w-full h-116 flex items-center justify-center bg-destructive/10 rounded-lg">
    <div className="text-center">
      <p className="text-destructive mb-2">Error loading map data</p>
      <p className="text-sm text-muted-foreground">{error}</p>
    </div>
  </div>
);

// Back button component
const BackButton = ({ onBack, regionName }: { onBack: () => void; regionName: string }) => (
  <div className="absolute top-4 left-4 z-[1000]">
    <Button
      onClick={onBack}
      variant="outline"
      size="sm"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back from {regionName}
    </Button>
  </div>
);

// District label marker component
const DistrictLabel = ({ feature, map, isDrillDown }: { feature: WahlkreisFeature; map: L.Map | null; isDrillDown: boolean }) => {
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
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; height: 100%;">
        <div style="font-size: 12px; font-weight: bold; color: var(--foreground); text-shadow: 0 1px 2px rgba(255,255,255,0.8); line-height: 1.2;">
          ${feature.properties.iso}
        </div>
        ${isDrillDown ? `<div style="font-size: 10px; font-weight: 500; color: var(--foreground); opacity: 0.8; text-shadow: 0 1px 2px rgba(255,255,255,0.8); max-width: 80px; text-align: center; line-height: 1.1; margin-top: 2px;">${feature.properties.name}</div>` : ''}
      </div>
    `,
    iconSize: [80, 40],
    iconAnchor: [40, 20],
  });

  return <Marker position={position} icon={divIcon} interactive={false} />;
};

// Combined region marker
const RegionLabel = ({ regionKey, regionData, map }: { regionKey: RegionKey; regionData: typeof REGION_GROUPS[RegionKey]; map: L.Map | null }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!map) return;
    
    const bounds = regionData.bounds as [[number, number], [number, number]];
    const boundsObj = L.latLngBounds(bounds);
    const center = boundsObj.getCenter();
    setPosition([center.lat, center.lng]);
  }, [regionData.bounds, map]);

  if (!position) return null;

  const divIcon = L.divIcon({
    className: 'region-label-marker',
    html: `
      <div style="display: flex; align-items: center; justify-content: center; text-align: center; width: 100%; height: 100%;">
        <div style="font-size: 18px; font-weight: bold; color: var(--foreground); text-shadow: 0 1px 2px rgba(255,255,255,0.8);">
          ${regionData.name}
        </div>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 15],
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
  maxZoom: 12,
};

export function SimpleMap({ selectedDistrict, setSelectedDistrict }: { selectedDistrict: string | null, setSelectedDistrict: (district: string | null) => void }) {
  const { geoData, loading, error } = useGeoData('/data/geojson/wahlkreise.json');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [drillDown, setDrillDown] = useState<DrillDownState>({
    currentRegion: null,
    originalBounds: MAP_CONFIG.maxBounds,
    originalZoom: MAP_CONFIG.zoom
  });
  
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  // Callback to handle when map is ready
  const handleMapRef = (map: L.Map | null) => {
    if (map && !mapReady) {
      mapRef.current = map;
      setMapReady(true);
    }
  };

  // Check if a district belongs to a region group
  const getDistrictRegion = (iso: string): RegionKey | null => {
    for (const [regionKey, regionData] of Object.entries(REGION_GROUPS)) {
      if (regionData.districts.includes(iso)) {
        return regionKey as RegionKey;
      }
    }
    return null;
  };

  // Get districts to display based on drill-down state
  const getDisplayDistricts = () => {
    if (!geoData) return [];
    
    if (drillDown.currentRegion) {
      // Show only districts in the current region
      const regionData = REGION_GROUPS[drillDown.currentRegion];
      return geoData.features.filter((feature: WahlkreisFeature) => 
        regionData.districts.includes(feature.properties.iso)
      );
    } else {
      // Show districts that are not in grouped regions, plus combined regions
      return geoData.features.filter((feature: WahlkreisFeature) => 
        !getDistrictRegion(feature.properties.iso)
      );
    }
  };

  // Get combined regions to display
  const getCombinedRegions = () => {
    if (drillDown.currentRegion || !geoData) return [];
    
    return Object.entries(REGION_GROUPS).map(([key, data]) => ({
      key: key as RegionKey,
      data,
      // Create a combined feature for styling
      combinedFeature: {
        type: 'Feature' as const,
        properties: { iso: key, name: data.name },
        geometry: {
          type: 'MultiPolygon' as const,
          coordinates: geoData.features
            .filter((f: WahlkreisFeature) => data.districts.includes(f.properties.iso))
            .map((f: WahlkreisFeature) => {
              if (f.geometry.type === 'Polygon') {
                return [f.geometry.coordinates];
              } else if (f.geometry.type === 'MultiPolygon') {
                return f.geometry.coordinates;
              }
              return [];
            })
            .flat()
        }
      } as WahlkreisFeature
    }));
  };

  // Handle drill down into a region
  const handleDrillDown = (regionKey: RegionKey) => {
    if (!mapRef.current) return;
    
    const regionData = REGION_GROUPS[regionKey];
    setDrillDown({
      currentRegion: regionKey,
      originalBounds: MAP_CONFIG.maxBounds,
      originalZoom: MAP_CONFIG.zoom
    });
    
    // Use setTimeout to ensure the GeoJSON has rendered before fitting bounds
    setTimeout(() => {
      if (mapRef.current) {
        // Calculate better bounds based on actual district geometries
        const regionDistricts = geoData?.features.filter((feature: WahlkreisFeature) => 
          regionData.districts.includes(feature.properties.iso)
        );
        
        if (regionDistricts && regionDistricts.length > 0) {
          // Create a temporary layer to calculate actual bounds
          const tempLayer = L.geoJSON(regionDistricts as any);
          const actualBounds = tempLayer.getBounds();
          
          // Fit to actual bounds with padding
          mapRef.current.fitBounds(actualBounds, { 
            padding: [50, 50],
            maxZoom: regionData.zoom 
          });
        } else {
          // Fallback to predefined bounds
          mapRef.current.fitBounds(regionData.bounds, { padding: [20, 20] });
        }
      }
    }, 100);
  };

  // Handle going back to overview
  const handleBack = () => {
    if (!mapRef.current) return;
    
    setDrillDown({
      currentRegion: null,
      originalBounds: MAP_CONFIG.maxBounds,
      originalZoom: MAP_CONFIG.zoom
    });
    
    // Reset to original view
    mapRef.current.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
    setSelectedDistrict(null);
  };

  // District styling based on state
  const getDistrictStyle = (feature?: WahlkreisFeature, isRegionGroup = false) => {
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

    // Selected districts get special color (both regions and districts)
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

    // Hover state - different color for visual feedback
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

    // Default state - same blue color for both regions and districts
    return {
      fillColor: '#6366f1', // indigo-500
      weight: 1,
      opacity: 0.8,
      color: '#4f46e5', // indigo-600
      fillOpacity: 0.3,
      dashArray: '',
    };
  };

  // Handle district interactions
  const handleDistrictFeature = (feature: WahlkreisFeature, layer: L.Layer, isRegionGroup = false) => {
    if (!feature.properties) return;

    const { iso, name } = feature.properties;

    // Mouse events - hover effects with same colors, only weight changes
    layer.on({
      mouseover: () => {
        if (selectedDistrict !== iso) { // Only change hover if not selected
          setHoveredDistrict(iso);
          (layer as L.Path).setStyle(getDistrictStyle(feature, isRegionGroup));
        }
      },
      mouseout: () => {
        setHoveredDistrict(null);
        (layer as L.Path).setStyle(getDistrictStyle(feature, isRegionGroup));
      },
      click: () => {
        if (isRegionGroup) {
          // Drill down into region
          handleDrillDown(iso as RegionKey);
        } else {
          // Regular district selection
          setSelectedDistrict(iso === selectedDistrict ? null : iso);
          // Update all layers to reflect new selection
          if (geoJsonRef.current) {
            geoJsonRef.current.eachLayer((layer: any) => {
              if (layer.feature) {
                layer.setStyle(getDistrictStyle(layer.feature));
              }
            });
          }
        }
      },
    });
  };

  if (loading || !geoData) return <MapLoadingSpinner />;
  if (error) return <MapErrorDisplay error={error} />;

  const displayDistricts = getDisplayDistricts();
  const combinedRegions = getCombinedRegions();

  return (
    <div className="w-full h-116 overflow-hidden bg-transparent relative">
      {/* Back button */}
      {drillDown.currentRegion && (
        <BackButton 
          onBack={handleBack} 
          regionName={REGION_GROUPS[drillDown.currentRegion].fullName}
        />
      )}
      
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
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
        ref={handleMapRef}
      >
        {/* Regular districts */}
        {displayDistricts.length > 0 && (
          <GeoJSON
            key={`districts-${drillDown.currentRegion || 'overview'}`}
            ref={geoJsonRef}
            data={{
              type: 'FeatureCollection',
              features: displayDistricts
            } as any}
            style={getDistrictStyle}
            onEachFeature={(feature, layer) => handleDistrictFeature(feature, layer, false)}
          />
        )}
        
        {/* Combined regions (only in overview mode) */}
        {combinedRegions.map(({ key, data, combinedFeature }) => (
          <GeoJSON
            key={`region-${key}`}
            data={combinedFeature}
            style={(feature) => getDistrictStyle(feature, true)}
            onEachFeature={(feature, layer) => handleDistrictFeature(feature, layer, true)}
          />
        ))}
        
        {/* District labels */}
        {mapReady && displayDistricts.map((feature: WahlkreisFeature) => (
          <DistrictLabel 
            key={feature.properties?.iso} 
            feature={feature} 
            map={mapRef.current}
            isDrillDown={!!drillDown.currentRegion}
          />
        ))}
        
        {/* Region labels (only in overview mode) */}
        {mapReady && !drillDown.currentRegion && combinedRegions.map(({ key, data }) => (
          <RegionLabel
            key={`region-label-${key}`}
            regionKey={key}
            regionData={data}
            map={mapRef.current}
          />
        ))}
      </MapContainer>
    </div>
  );
}
