export function addFillLayer(mapInstance) {
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
}

export function showFillLayer(mapDrawRef, mapInstance) {
    const data = mapDrawRef.current.getAll();
    mapInstance.getSource('polygon-fill-source').setData(data);
    console.log('Polygon created:', data);
}

export function hideFillLayer(mapInstance) {
    mapInstance.getSource('polygon-fill-source').setData({
        type: 'FeatureCollection',
        features: []
  })
}