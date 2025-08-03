import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || '';
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: [-74.0242, 40.6941],
      zoom: 10.12,
    });

    return () => {
      (mapRef.current as mapboxgl.Map)?.remove?.();
    };
  }, []);

  return (
    <div className="w-full h-96 relative">
      <div id="map-container" className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
