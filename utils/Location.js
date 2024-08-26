export async function getCoordinatesFromIP() {
    const response = await fetch(process.env.NEXT_PUBLIC_IP_API_ENDPOINT);
    const data = await response.json();
    return data;
}

export async function getCoordinatesFromAddress(address) {
    
}

export async function getAddressFromCoordinates(coordinates) {

}