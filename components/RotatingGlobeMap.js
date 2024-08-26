// components/RotatingGlobeMap.js
'use client'

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getCoordinatesFromIP, getCoordinatesFromAddress, getAddressFromCoordinates } from '@utils/Location';
import LocationForm from './LocationForm.js';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const RotatingGlobeMap = () => {
  const mapContainerRef = useRef(null);
  const [address, setAddress] = useState("");

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
      const address = await getAddressFromCoordinates({lon: coordinates.lon, lat: coordinates.lat})
      setAddress(address);
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
      <LocationForm address={address}/>
    </div>
  );
};

export default RotatingGlobeMap;