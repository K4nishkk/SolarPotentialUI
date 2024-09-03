'use client'

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { FillLayer} from '@mapUtil/fillLayer';
import { ScoutingConfig} from '@mapUtil/scouting';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const RotatingGlobeMap = ({ lat, lon, scoutLocation, showMarker, drawMode, submit }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const mapDrawRef = useRef(null);

  const [coordinates, setCoordinates] = useState({})

  function createArea() {
    FillLayer.showFillLayer(mapDrawRef, mapInstanceRef)

    // save coordinates and remove mapbox-draw polygon
    const featureCollection = mapDrawRef.current.getAll();
    const featureCollectionIds = featureCollection.features.map((feature) => feature.id);
    setCoordinates(featureCollection)

    if (featureCollectionIds.length > 0) {
      mapDrawRef.current.delete(featureCollectionIds);
    }
  }

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

      FillLayer.addFillLayer(mapInstance)
      mapInstance.on('draw.create', createArea);
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

      if (scoutLocation) {
        const draw = new MapboxDraw({
          displayControlsDefault: false,
        });
        mapDrawRef.current = draw;
        
        mapInstance.addControl(draw);
        ScoutingConfig.setEnableScoutingConfig(mapInstance, lat, lon)
      }
      else {
        if (mapDrawRef.current && mapInstance) {
            mapInstance.removeControl(mapDrawRef.current);
        }
        ScoutingConfig.setDisableScoutingConfig(mapInstance, lat, lon)
      }
    }
  }, [scoutLocation]);

  // setting draw mode based on user input
  useEffect(() => {
    const mapInstance = mapInstanceRef.current;

    if (drawMode === 'draw_polygon') {
      mapDrawRef.current.changeMode('draw_polygon')
      setCoordinates({});
    }
    else if (drawMode === 'delete_polygon') FillLayer.hideFillLayer(mapInstance)
  }, [drawMode])

  // showing/hiding marker
  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current.getElement().style;
      marker.visibility = (showMarker) ? "visible" : "hidden";
    }
  }, [showMarker])

  // submitting the selected area coordinates
  useEffect(() => {
    if (Object.keys(coordinates).length !== 0) {
      console.log(coordinates)
      FillLayer.hideFillLayer(mapInstanceRef.current)
    }
  }, [submit])

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