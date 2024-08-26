export async function getCoordinatesFromIP() {
    const response = await fetch(process.env.NEXT_PUBLIC_IP_API_ENDPOINT);
    const data = await response.json();
    return {lat: data.location.latitude, lon: data.location.longitude};
}

export async function getCoordinatesFromAddress(address) {
    const url = new URL(process.env.NEXT_PUBLIC_GEOCODE_SEARCH_ENDPOINT);
    const params = {
        apiKey: process.env.NEXT_PUBLIC_GEOCODE_API_KEY,
        text: address
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url)
    const data = await response.json();
    return data.features;
    return {lat: data.features[0].geometry.coordinates[1], lon: data.features[0].geometry.coordinates[0]}
}

export async function getAddressFromCoordinates(coordinates) {
    const url = new URL(process.env.NEXT_PUBLIC_GEOCODE_REVERSE_ENDPOINT);
    const params = {
        apiKey: process.env.NEXT_PUBLIC_GEOCODE_API_KEY,
        lat: coordinates.lat,
        lon: coordinates.lon
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url)
    const data = await response.json();
    return data.features[0].properties.formatted;
}