import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useLocation } from '@/data/store';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

interface MapProps {
  value?: {
    address: string;
    lngLat: [number, number];
  };
  onChange?: (loc: { address: string; lngLat: [number, number] }) => void;
}

const Map = ({ value, onChange }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // get estimated user location from api/locator
  const { location, isLoading } = useLocation();

  // when isLoading is false and location is available, set the initial center
  useEffect(() => {
    if (!isLoading && location?.country) {
      if (mapRef.current) {
        mapRef.current.setCenter([
          location.lon || -0.186964, // Default to Ghana if no location
          location.lat || 5.614818,
        ]);

        mapRef.current.setZoom(9);
      }
    }
  }, [isLoading, location]);

  const DEFAULT_CENTER: [number, number] = [-0.186964, 5.614818]; // Ghana

  // Initialize map only once
  // Only initialize map on mount
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || '';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: value?.lngLat || DEFAULT_CENTER,
      zoom: 6.5,
    });

    mapRef.current = map;

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken!,
      mapboxgl: mapboxgl as any,
      marker: false,
      placeholder: 'Search for your delivery location',
      countries: 'GH,NG',
    });

    map.addControl(geocoder as any);

    geocoder.on('result', (e: any) => {
      const coords = e.result.center;
      const address = e.result.place_name;

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = new mapboxgl.Marker().setLngLat(coords).addTo(map);
      map.flyTo({ center: coords, zoom: 14 });

      if (onChange) {
        onChange({ address, lngLat: coords });
      }
    });

    map.on('click', async (e) => {
      const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = new mapboxgl.Marker().setLngLat(lngLat).addTo(map);

      try {
        const resp = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat[0]},${lngLat[1]}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await resp.json();
        const address = data.features?.[0]?.place_name || '';

        // map.flyTo({ center: lngLat, zoom: 18 });

        if (onChange) {
          onChange({ address, lngLat });
        }
      } catch {
        if (onChange) {
          onChange({ address: '', lngLat });
        }
      }
    });

    return () => {
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Update marker/flyTo if value changes (but do NOT recreate map)
  useEffect(() => {
    if (!mapRef.current || !value?.lngLat) {
      return;
    }

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new mapboxgl.Marker()
      .setLngLat(value.lngLat)
      .addTo(mapRef.current);
    // Optionally flyTo if value changes from outside (e.g., programmatically)
    // mapRef.current.flyTo({ center: value.lngLat, zoom: 14 });
  }, [value?.lngLat]);

  return (
    <div className="w-full h-96 relative">
      <div id="map-container" className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
