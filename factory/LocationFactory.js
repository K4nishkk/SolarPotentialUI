export class LocationFactory {
    static async getCoordinatesFromIP() {
        const response = await fetch(process.env.NEXT_PUBLIC_IP_API_ENDPOINT);
        const data = await response.json();
        return { lat: data.location.latitude, lon: data.location.longitude };
    }

    static async getCoordinatesFromAddress(address) {
        const url = new URL(process.env.NEXT_PUBLIC_GEOCODE_SEARCH_ENDPOINT);
        const params = {
            apiKey: process.env.NEXT_PUBLIC_GEOCODE_API_KEY,
            text: address
        }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url)
        const data = await response.json();

        if (data.features.length) {
            return data.features.map((value) => {
                return {
                    "address": value.properties.formatted,
                    "lat": value.properties.lat,
                    "lon": value.properties.lon
                }
            })
        }
        return null
    }

    static async getAddressFromCoordinates(coordinates) {
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
}