'use client'

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from "@turf/turf";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const RotatingGlobeMap = ({ lat, lon, scoutLocation, showMarker, drawMode }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const mapDrawRef = useRef(null);

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

      // Add the fill layer
      mapInstance.addLayer({
        id: 'polygon-fill',
        type: 'fill',
        source: 'polygon-fill-source',
        layout: {},
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.5
        }
      });
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

      function updateArea(e) {
        const data = mapDrawRef.current.getAll();
        
        if (e.type === 'draw.create') {
          console.log('Polygon created:', data);
          mapInstance.getSource('polygon-fill-source').setData(data);
        }
        else if (e.type === 'draw.update') {
          console.log('Polygon updated:', data);
        }
        else if (e.type === 'draw.delete') {
          console.log('Polygon deleted:', data);
        }
      
        if (data.features.length === 0 && e.type !== 'draw.delete') {
          alert('Click the map to draw a polygon.');
        }
      }

      if (scoutLocation) {
        const draw = new MapboxDraw({
          displayControlsDefault: false,
        });
        mapDrawRef.current = draw;

        mapInstanceRef.current.addControl(draw);

        mapInstanceRef.current.on('draw.create', updateArea);
        mapInstanceRef.current.on('draw.delete', updateArea);
        mapInstanceRef.current.on('draw.update', updateArea);

        mapInstance.scrollZoom.enable();
        mapInstance.touchZoomRotate.enable();
        mapInstance.dragPan.enable();
        mapInstance.dragRotate.enable()

        mapInstance.setPitch(0);
        mapInstance.setStyle("mapbox://styles/mapbox/satellite-streets-v12");

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
        if (mapDrawRef.current && mapInstance) {
          mapInstance.off('draw.create', updateArea);
          mapInstance.off('draw.delete', updateArea);
          mapInstance.off('draw.update', updateArea);
          mapInstance.removeControl(mapDrawRef.current);
        }

        mapInstance.scrollZoom.disable();
        mapInstance.touchZoomRotate.disable();
        mapInstance.dragPan.disable();
        mapInstance.dragRotate.disable()

        mapInstance.setPitch(38);
        mapInstance.setStyle("mapbox://styles/mapbox/outdoors-v12");

        mapInstance.flyTo({
          center: [lon, lat],
          zoom: 3,
          speed: 2,
          curve: 0.8,
          easing: (t) => 1 - Math.pow(1 - t, 5),
          offset: [0, -100],
          bearing: 0
        });
      }
    }
  }, [scoutLocation]);

  useEffect(() => {
    if (drawMode === 'draw_polygon') {
      mapDrawRef.current.changeMode('draw_polygon');
    }
    else if (drawMode === 'delete') {
      const selectedFeatures = mapDrawRef.current.getSelectedIds();

      if (selectedFeatures.length > 0) {
        mapDrawRef.current.delete(selectedFeatures);
        mapInstanceRef.current.getSource('polygon-fill-source').setData({
          type: 'FeatureCollection',
          features: []
        })
      }
      else {
        alert('No features selected to delete.');
      }
    }
  }, [drawMode])

  useEffect(() => {
    if (markerRef.current) {
      (showMarker) ?
        markerRef.current.getElement().style.visibility = "visible"
        :
        markerRef.current.getElement().style.visibility = "hidden"
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