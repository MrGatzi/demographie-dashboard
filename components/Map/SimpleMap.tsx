"use client";

import { useGeoData } from "@/app/hooks/useGeoData";
import { Button } from "@/components/ui/button";
import { Feature, Geometry } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, Marker } from "react-leaflet";

interface WahlkreisProperties {
  iso: string;
  name: string;
  mandate?: string;
}

type WahlkreisFeature = Feature<Geometry, WahlkreisProperties>;

// Region groupings for drill-down functionality - All Austrian Bundesländer
const REGION_GROUPS = {
  WIEN: {
    name: "W",
    fullName: "Wien",
    districts: ["9A", "9B", "9C", "9D", "9E", "9f", "9G"],
  },
  NIEDEROESTERREICH: {
    name: "NÖ",
    fullName: "Niederösterreich",
    districts: ["3A", "3B", "3C", "3D", "3E", "3F", "3G"],
  },
  OBEROESTERREICH: {
    name: "OÖ",
    fullName: "Oberösterreich",
    districts: ["4A", "4B", "4C", "4D", "4E"],
  },
  SALZBURG: {
    name: "S",
    fullName: "Salzburg",
    districts: ["5A", "5B", "5C"],
  },
  STEIERMARK: {
    name: "ST",
    fullName: "Steiermark",
    districts: ["6A", "6B", "6C", "6D"],
  },
  TIROL: {
    name: "T",
    fullName: "Tirol",
    districts: ["7A", "7B", "7C", "7D", "7E"],
  },
  VORARLBERG: {
    name: "V",
    fullName: "Vorarlberg",
    districts: ["8A", "8B"],
  },
  KAERNTEN: {
    name: "K",
    fullName: "Kärnten",
    districts: ["2A", "2B", "2C", "2D"],
  },
  BURGENLAND: {
    name: "B",
    fullName: "Burgenland",
    districts: ["1A", "1B"],
  },
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
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// Loading component
const MapLoadingSpinner = () => (
  <div className="w-full h-[50vh] sm:h-116 flex items-center justify-center bg-transparent rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading map data...</p>
    </div>
  </div>
);

// Error component
const MapErrorDisplay = ({ error }: { error: string }) => (
  <div className="w-full h-[50vh] sm:h-116 flex items-center justify-center bg-destructive/10 rounded-lg">
    <div className="text-center">
      <p className="text-destructive mb-2">Error loading map data</p>
      <p className="text-sm text-muted-foreground">{error}</p>
    </div>
  </div>
);

// Back button component
const BackButton = ({
  onBack,
  regionName,
}: {
  onBack: () => void;
  regionName: string;
}) => (
  <div className="absolute top-4 left-4 z-[1000]">
    <Button onClick={onBack} variant="outline" size="sm">
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back from {regionName}
    </Button>
  </div>
);

// District label marker component
const DistrictLabel = ({
  feature,
  map,
  isDrillDown,
}: {
  feature: WahlkreisFeature;
  map: L.Map | null;
  isDrillDown: boolean;
}) => {
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
    className: "district-label-marker",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; height: 100%;">
        <div style="font-size: ${
          isDrillDown ? "14px" : "10px"
        }; font-weight: bold; color: var(--foreground); text-shadow: 0 1px 2px rgba(255,255,255,0.8); line-height: 1.2;">
          ${feature.properties.iso}
        </div>
        ${
          isDrillDown
            ? `<div style="font-size: ${
                window.innerWidth < 640 ? "8px" : "10px"
              }; font-weight: 500; color: var(--foreground); opacity: 0.8; text-shadow: 0 1px 2px rgba(255,255,255,0.8); max-width: 80px; text-align: center; line-height: 1.1; margin-top: 2px;">${
                feature.properties.name
              }</div>`
            : ""
        }
      </div>
    `,
    iconSize: isDrillDown ? [100, 50] : [60, 30],
    iconAnchor: isDrillDown ? [50, 25] : [30, 15],
  });

  return <Marker position={position} icon={divIcon} interactive={false} />;
};

// Combined region marker
const RegionLabel = ({
  regionKey,
  regionData,
  map,
  geoData,
}: {
  regionKey: RegionKey;
  regionData: (typeof REGION_GROUPS)[RegionKey];
  map: L.Map | null;
  geoData: any;
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!map || !geoData) return;

    // Get all districts for this region
    const regionDistricts = geoData.features.filter(
      (feature: WahlkreisFeature) =>
        regionData.districts.includes(feature.properties.iso)
    );

    if (regionDistricts.length > 0) {
      // Create a temporary layer group to calculate the center
      const tempLayerGroup = L.featureGroup();
      regionDistricts.forEach((district: WahlkreisFeature) => {
        const layer = L.geoJSON(district);
        tempLayerGroup.addLayer(layer);
      });

      // Get the center of all districts combined
      const combinedBounds = tempLayerGroup.getBounds();
      const center = combinedBounds.getCenter();
      setPosition([center.lat, center.lng]);
    }
  }, [map, geoData, regionData.districts]);

  if (!position) return null;

  const divIcon = L.divIcon({
    className: "region-label-marker",
    html: `
      <div style="display: flex; align-items: center; justify-content: center; text-align: center; width: 100%; height: 100%;">
        <div style="font-size: ${
          window.innerWidth < 640 ? "14px" : "18px"
        }; font-weight: bold; color: var(--foreground); text-shadow: 0 1px 2px rgba(255,255,255,0.8);">
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
    height: "100%",
    width: "100%",
    backgroundColor: "rgb(var(--background))",
  },
  maxBounds: [
    [46.0, 9.5],
    [49.0, 17.0],
  ] as L.LatLngBoundsExpression,
  minZoom: 6,
  maxZoom: 12,
};

export function SimpleMap({
  selectedDistrict,
  setSelectedDistrict,
}: {
  selectedDistrict: string | null;
  setSelectedDistrict: (district: string | null) => void;
}) {
  const { geoData, loading, error } = useGeoData(
    "/data/geojson/wahlkreise.json"
  );
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [drillDown, setDrillDown] = useState<DrillDownState>({
    currentRegion: null,
    originalBounds: MAP_CONFIG.maxBounds,
    originalZoom: MAP_CONFIG.zoom,
  });

  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  // Handle map resize
  useEffect(() => {
    if (!mapRef.current) return;

    const handleResize = () => {
      if (!mapRef.current) return;
      mapRef.current.invalidateSize();

      // If we're in overview mode, reset to original view
      if (!drillDown.currentRegion) {
        mapRef.current.setView(
          MAP_CONFIG.center,
          window.innerWidth < 640 ? MAP_CONFIG.zoom - 1 : MAP_CONFIG.zoom,
          { animate: false }
        );
        mapRef.current.setMaxBounds(MAP_CONFIG.maxBounds);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drillDown.currentRegion]);

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
      return geoData.features.filter(
        (feature: WahlkreisFeature) =>
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
        type: "Feature" as const,
        properties: { iso: key, name: data.name },
        geometry: {
          type: "MultiPolygon" as const,
          coordinates: geoData.features
            .filter((f: WahlkreisFeature) =>
              data.districts.includes(f.properties.iso)
            )
            .map((f: WahlkreisFeature) => {
              if (f.geometry.type === "Polygon") {
                return [f.geometry.coordinates];
              } else if (f.geometry.type === "MultiPolygon") {
                return f.geometry.coordinates;
              }
              return [];
            })
            .flat(),
        },
      } as WahlkreisFeature,
    }));
  };

  // Handle drill down into a region
  const handleDrillDown = (regionKey: RegionKey) => {
    if (!mapRef.current || !geoData) return;

    // Get all districts for this region
    const regionDistricts = geoData.features.filter(
      (feature: WahlkreisFeature) =>
        REGION_GROUPS[regionKey].districts.includes(feature.properties.iso)
    );

    if (regionDistricts.length === 0) return;

    // Set the drill down state first
    setDrillDown({
      currentRegion: regionKey,
      originalBounds: MAP_CONFIG.maxBounds,
      originalZoom: MAP_CONFIG.zoom,
    });

    // Create a temporary layer group to get the combined bounds
    const tempLayerGroup = L.featureGroup();
    regionDistricts.forEach((district: WahlkreisFeature) => {
      const layer = L.geoJSON(district);
      tempLayerGroup.addLayer(layer);
    });

    // Get the bounds of all districts combined
    const combinedBounds = tempLayerGroup.getBounds();

    // Use fitBounds to automatically center and zoom optimally
    mapRef.current.fitBounds(combinedBounds, {
      animate: false,
      duration: 0.5,
    });

    // Set restrictive bounds to prevent panning too far
    const restrictiveBounds = combinedBounds.pad(0.2);
    mapRef.current.setMaxBounds(restrictiveBounds);
  };

  // Handle going back to overview
  const handleBack = () => {
    if (!mapRef.current) return;

    setDrillDown({
      currentRegion: null,
      originalBounds: MAP_CONFIG.maxBounds,
      originalZoom: MAP_CONFIG.zoom,
    });

    // Force a map resize before resetting the view
    mapRef.current.invalidateSize();

    // Reset to original view and restore original max bounds - no animation
    const newZoom =
      window.innerWidth < 640 ? MAP_CONFIG.zoom - 1 : MAP_CONFIG.zoom;
    mapRef.current.setView(MAP_CONFIG.center, newZoom, {
      animate: false,
    });
    mapRef.current.setMaxBounds(MAP_CONFIG.maxBounds);
    setSelectedDistrict(null);

    // Add a small delay to ensure the map has properly resized
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        mapRef.current.setView(MAP_CONFIG.center, newZoom, {
          animate: false,
        });
      }
    }, 100);
  };

  // District styling based on state
  const getDistrictStyle = (
    feature?: WahlkreisFeature,
    isRegionGroup = false
  ) => {
    if (!feature?.properties) {
      return {
        fillColor: "#6366f1",
        weight: 1,
        opacity: 1,
        color: "#4f46e5",
        fillOpacity: 0.4,
      };
    }

    const isSelected = selectedDistrict === feature.properties.iso;
    const isHovered = hoveredDistrict === feature.properties.iso;

    // Selected districts get special color (both regions and districts)
    if (isSelected) {
      return {
        fillColor: "#10b981", // emerald-500 - selected color
        weight: 2,
        opacity: 1,
        color: "#059669", // emerald-600
        fillOpacity: 0.6,
        dashArray: "",
      };
    }

    // Hover state - different color for visual feedback
    if (isHovered) {
      return {
        fillColor: "#6366f1", // indigo-500 - hover color
        weight: 2,
        opacity: 1,
        color: "#4f46e5", // indigo-600
        fillOpacity: 0.5,
        dashArray: "",
      };
    }

    // Default state - same blue color for both regions and districts
    return {
      fillColor: "#6366f1", // indigo-500
      weight: 1,
      opacity: 0.8,
      color: "#4f46e5", // indigo-600
      fillOpacity: 0.3,
      dashArray: "",
    };
  };

  // Handle district interactions
  const handleDistrictFeature = (
    feature: WahlkreisFeature,
    layer: L.Layer,
    isRegionGroup = false
  ) => {
    if (!feature.properties) return;

    const { iso, name } = feature.properties;

    // Mouse events - hover effects with same colors, only weight changes
    layer.on({
      mouseover: () => {
        if (selectedDistrict !== iso) {
          // Only change hover if not selected
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
    <div className="w-full h-[50vh] sm:h-116 overflow-hidden bg-transparent relative">
      {/* Back button */}
      {drillDown.currentRegion && (
        <BackButton
          onBack={handleBack}
          regionName={REGION_GROUPS[drillDown.currentRegion].fullName}
        />
      )}

      <MapContainer
        center={MAP_CONFIG.center}
        zoom={window.innerWidth < 640 ? MAP_CONFIG.zoom - 1 : MAP_CONFIG.zoom}
        style={MAP_CONFIG.style}
        className="z-0 leaflet-clean"
        zoomControl={false}
        attributionControl={false}
        maxBounds={MAP_CONFIG.maxBounds}
        minZoom={MAP_CONFIG.minZoom - 1}
        maxZoom={MAP_CONFIG.maxZoom}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
        ref={handleMapRef}
      >
        {/* Regular districts */}
        {displayDistricts.length > 0 && (
          <GeoJSON
            key={`districts-${drillDown.currentRegion || "overview"}`}
            ref={geoJsonRef}
            data={
              {
                type: "FeatureCollection",
                features: displayDistricts,
              } as any
            }
            style={getDistrictStyle}
            onEachFeature={(feature, layer) =>
              handleDistrictFeature(feature, layer, false)
            }
          />
        )}

        {/* Combined regions (only in overview mode) */}
        {combinedRegions.map(({ key, data, combinedFeature }) => (
          <GeoJSON
            key={`region-${key}`}
            data={combinedFeature}
            style={(feature) => getDistrictStyle(feature, true)}
            onEachFeature={(feature, layer) =>
              handleDistrictFeature(feature, layer, true)
            }
          />
        ))}

        {/* District labels */}
        {mapReady &&
          displayDistricts.map((feature: WahlkreisFeature) => (
            <DistrictLabel
              key={feature.properties?.iso}
              feature={feature}
              map={mapRef.current}
              isDrillDown={!!drillDown.currentRegion}
            />
          ))}

        {/* Region labels (only in overview mode) */}
        {mapReady &&
          !drillDown.currentRegion &&
          combinedRegions.map(({ key, data }) => (
            <RegionLabel
              key={`region-label-${key}`}
              regionKey={key}
              regionData={data}
              map={mapRef.current}
              geoData={geoData}
            />
          ))}
      </MapContainer>
    </div>
  );
}
