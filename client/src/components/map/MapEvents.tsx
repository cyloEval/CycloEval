import React from 'react';
import { useMapEvents } from 'react-leaflet';

const MapEvents = ({
  mapRef,
  setZoomLevel,
}: {
  mapRef: React.RefObject<L.Map>;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
}) => {
  useMapEvents({
    zoomend: () => {
      const zoom = mapRef.current?.getZoom();
      if (zoom) {
        setZoomLevel(zoom);
        console.log('Zoom level:', zoom);
      }
    },
  });
  return null;
};

export default MapEvents;
