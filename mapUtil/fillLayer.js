export default class FillLayer {
  static addFillLayer(mapInstance) {
    mapInstance.addSource('polygon-fill-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

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
    
    mapInstance.addSource('outline', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    mapInstance.addLayer({
      id: 'outline-layer',
      type: 'line',
      source: 'outline',
      layout: {},
      paint: {
        'line-color': '#0bb',
        'line-width': 4
      }
    });
  }

  static showFillLayer(mapDrawRef, mapInstanceRef) {
    const data = mapDrawRef.current.getAll();
    mapInstanceRef.current.getSource('polygon-fill-source').setData(data);
    mapInstanceRef.current.getSource('outline').setData(data)
  }

  static hideFillLayer(mapInstance) {
    mapInstance.getSource('polygon-fill-source').setData({
      type: 'FeatureCollection',
      features: []
    })

    mapInstance.getSource('outline').setData({
      type: 'FeatureCollection',
      features: []
    })
  }
}