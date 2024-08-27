// components/RotatingGlobeMap.js
'use client'

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const RotatingGlobeMap = ({ lat, lon, scoutLocation }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      projection: 'globe',
      zoom: 0.1,
	    pitch: 38,
      scrollZoom: false,
      dragPan: false,
      pitchWithRotate: false,
      dragRotate: false,
      touchPitch: false,
      touchZoomRotate: false,
      doubleClickZoom: false,
      boxZoom: false
    });

    mapInstanceRef.current = mapInstance;

    mapInstance.on('style.load', () => {
      mapInstance.setFog({});
    });

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (lat !== null && lon !== null && mapInstanceRef.current) {
      const mapInstance = mapInstanceRef.current;

      mapInstance.flyTo({
        center: [lon, lat],
        zoom: (scoutLocation) ? 17 : 3,
        speed: (scoutLocation) ? 2 : 0.5, // Adjust speed for smoothness
        curve: 0.8, // Optional: Adjust the curvature of the flight path
        easing: (t) => 1 - Math.pow(1 - t, 5), // Optional: Customize the easing function
        offset: [0, -100]
      });
    }
  }, [lat, lon]);
  
  useEffect(() => {
    if (lat !== null && lon !== null && mapInstanceRef.current) {
      const mapInstance = mapInstanceRef.current;

		if (scoutLocation) {
			mapInstance.scrollZoom.enable();
			mapInstance.dragPan.enable();
			mapInstance.setPitch(0)
			mapInstance.setStyle("mapbox://styles/mapbox/satellite-streets-v12")
			mapInstance.flyTo({
			  center: [lon, lat],
			  zoom: 17,
			  speed: 2, // Adjust speed for smoothness
			  curve: 0.8, // Optional: Adjust the curvature of the flight path
			  easing: (t) => 1 - Math.pow(1 - t, 5), // Optional: Customize the easing function
			  offset: [0, -100]
			});
		}
		else {
			mapInstance.scrollZoom.disable();
			mapInstance.dragPan.disable();
			mapInstance.setPitch(38);
			mapInstance.setStyle("mapbox://styles/mapbox/outdoors-v12")
			mapInstance.flyTo({
			  center: [lon, lat],
			  zoom: 3,
			  speed: 2, // Adjust speed for smoothness
			  curve: 0.8, // Optional: Adjust the curvature of the flight path
			  easing: (t) => 1 - Math.pow(1 - t, 5), // Optional: Customize the easing function
			  offset: [0, -100]
			});
		}
    }
  }, [scoutLocation]);

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