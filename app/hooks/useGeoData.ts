import { useEffect, useState } from 'react';
import { FeatureCollection, Geometry } from 'geojson';

interface WahlkreisProperties {
  iso: string;
  name: string;
}

type WahlkreisCollection = FeatureCollection<Geometry, WahlkreisProperties>;

interface UseGeoDataReturn {
  geoData: WahlkreisCollection | null;
  loading: boolean;
  error: string | null;
}

export const useGeoData = (url: string): UseGeoDataReturn => {
  const [geoData, setGeoData] = useState<WahlkreisCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON data: ${response.status} ${response.statusText}`);
        }
        
        const data: WahlkreisCollection = await response.json();
        setGeoData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred while loading map data');
        setGeoData(null);
      } finally {
        setLoading(false);
      }
    };

    loadGeoData();
  }, [url]);

  return { geoData, loading, error };
}; 