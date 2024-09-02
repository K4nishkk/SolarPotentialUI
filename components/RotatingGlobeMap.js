'use client'

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { addFillLayer, hideFillLayer, showFillLayer } from '@mapUtil/fillLayer';
import { setEnableScoutingConfig, setDisableScoutingConfig } from '@mapUtil/scouting';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const RotatingGlobeMap = ({ lat, lon, scoutLocation, showMarker, drawMode }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const mapDrawRef = useRef(null);

  // init
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
      boxZoom: false,
      keyboard: false
    });

    mapInstanceRef.current = mapInstance;

    mapInstance.on('style.load', () => {
      mapInstance.setFog({});

      mapInstance.addSource('polygon-fill-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      addFillLayer(mapInstance)
    });

    return () => mapInstance.remove();
  }, []);

  // change in coordinates
  useEffect(() => {
    if (lat !== null && lon !== null && mapInstanceRef.current) {
      const mapInstance = mapInstanceRef.current;

      if (markerRef.current) {
        markerRef.current.setLngLat([lon, lat]);
      } else {
        markerRef.current = new mapboxgl.Marker()
          .setLngLat([lon, lat])
          .addTo(mapInstance);
      }

      mapInstance.flyTo({
        center: [lon, lat],
        zoom: scoutLocation ? 17 : 3,
        speed: scoutLocation ? 2 : 0.5,
        curve: 0.8,
        easing: (t) => 1 - Math.pow(1 - t, 5),
        offset: [0, -100]
      });
    }
  }, [lat, lon]);

  // scoutLocation enabling/disabling
  useEffect(() => {
    if (lat !== null && lon !== null && mapInstanceRef.current) {
      const mapInstance = mapInstanceRef.current;

      function createArea() {
        showFillLayer(mapDrawRef, mapInstance)
      }

      if (scoutLocation) {
        const draw = new MapboxDraw({
          displayControlsDefault: false,
        });
        mapDrawRef.current = draw;

        mapInstance.on('draw.create', createArea);
        mapInstance.addControl(draw);
        setEnableScoutingConfig(mapInstance, lat, lon)
      }
      else {
        if (mapDrawRef.current && mapInstance) {
            mapInstance.off('draw.create', createArea);
            mapInstance.removeControl(mapDrawRef.current);
        }
        setDisableScoutingConfig(mapInstance, lat, lon)
      }
    }
  }, [scoutLocation]);

  // setting draw mode based on user input
  useEffect(() => {
    const mapInstance = mapInstanceRef.current;

    if (drawMode === 'draw_polygon') {
      mapDrawRef.current.changeMode('draw_polygon');
    }
    else if (drawMode === 'delete') {
      const selectedFeatures = mapDrawRef.current.getSelectedIds();

      if (selectedFeatures.length > 0) {
        mapDrawRef.current.delete(selectedFeatures);
        hideFillLayer(mapInstance);
      }
      else {
        alert('No area selected to delete.');
      }
    }
  }, [drawMode])

  // showing/hiding marker
  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current.getElement().style;
      marker.visibility = (showMarker) ? "visible" : "hidden";
    }
  }, [showMarker])

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