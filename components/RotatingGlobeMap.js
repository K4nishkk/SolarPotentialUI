// components/RotatingGlobeMap.js
'use client'

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getCoordinatesFromIP, getCoordinatesFromAddress, getAddressFromCoordinates } from '@utils/Location';
import LocationData from './LocationData';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const RotatingGlobeMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      projection: 'globe',
      zoom: 1.5
    });

    (async () => {
      const coordinates = await getCoordinatesFromIP();
      mapInstance.setCenter([coordinates.lon, coordinates.lat])
    })();

    mapInstance.on('style.load', () => {
      mapInstance.setFog({});
    });

    return () => mapInstance.remove();
  }, []);

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '100%' }}
      />
      <LocationData />
    </div>
  );
};

export default RotatingGlobeMap;