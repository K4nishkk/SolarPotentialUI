"use client"

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox GL CSS

mapboxgl.accessToken = 'pk.eyJ1IjoiazRuaXNoa2siLCJhIjoiY2xqYml4aXprMXBvYjNqcXh6MTRrb2ZtZiJ9.IrjXgK1BA7VD0ZERPEhscA';

const RotatingGlobeMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      projection: 'globe',
      zoom: 1.5,
      center: [76.7794, 30.7333],
    });

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
    </div>
  );
};

export default RotatingGlobeMap;
