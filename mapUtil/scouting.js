export function setEnableScoutingConfig(mapInstance, lat, lon) {

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

export function setDisableScoutingConfig(mapInstance, lat, lon) {

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