'use client'

import React, { useRef, useState, useEffect } from 'react'
import RotatingGlobeMap from './RotatingGlobeMap'
import { getCoordinatesFromIP, getCoordinatesFromAddress, getAddressFromCoordinates } from '@factory/LocationFactory'
import "./LocationForm.css"

const LocationForm = () => {
    const addressInputRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false);

    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [addressInput, setAddressInput] = useState("");
    const [addressOptions, setAddressOptions] = useState([]);

    const [scoutLocation, setScoutLocation] = useState(false);
    const [showMarker, setShowMarker] = useState(true);
    const [drawMode, setDrawMode] = useState('static');
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        const withTimeout = (promise, timeoutMs) => {
            return Promise.race([
                promise,
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), timeoutMs)
                )
            ]);
        };

        const fetchData = async () => {
            // Fetch coordinates and address from IP
            const ipCoords = await getCoordinatesFromIP();
            let lat = ipCoords.lat;
            let lon = ipCoords.lon;
    
            // Check if geolocation is available
            if ("geolocation" in navigator) {
                try {
                    const position = await withTimeout(new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    }), 3000);
                    lat = position.coords.latitude;
                    lon = position.coords.longitude;
                }
                catch (error) {
                    console.error("Geolocation error:", error);
                }
            }

            const address = await getAddressFromCoordinates({ lat, lon });
            setLatitude(lat);
            setLongitude(lon);
            setAddress(address);
        };
    
        fetchData();
    }, []);
    

    useEffect(() => {
        if (addressInput) {
            (async () => {
                const addresses = await getCoordinatesFromAddress(addressInput);

                if (addresses) {
                    setAddressOptions(addresses.map((value) => value.address))
                }

                if (addressOptions.find(option => option === addressInput)) {
                    handleSubmit();
                }
            })();
        }
    }, [addressInput])

    const handleSubmit = async () => {
        console.log("Submitted: " + addressInput)

        const newAddress = await getCoordinatesFromAddress(addressInput);
        setAddress(newAddress[0].address);
        setLatitude(newAddress[0].lat);
        setLongitude(newAddress[0].lon);

        setAddressInput("")
        addressInputRef.current.blur();
    };

    return (
        <>
            <div className='outerbox'>

                <div className='innerbox'>
                    <form className='addressForm' onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}>
                        <input
                            className='addressInput'
                            type="text"
                            list='address'
                            placeholder='Type address'
                            autoComplete='off'
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onChange={(event) => { setAddressInput(event.target.value) }}
                            value={addressInput}
                            ref={addressInputRef}
                        />
                        <datalist id="address">
                            {addressOptions.map((val, index) => {
                                return (
                                    <option value={val} key={index} />
                                );
                            })}
                        </datalist>
                        <button
                            className={isFocused ? "addressButton" : "addressButtonHidden"}
                        >Locate</button>
                    </form>
                </div>

                <div className='innerbox'>

                    {scoutLocation && (
                        <div className='scoutingOptionsContainer'>
                            <button className='scoutingOption' onClick={() => setShowMarker(!showMarker)}>
                                {showMarker ? "Hide Marker" : "Show Marker"}
                            </button>
                            <button className='scoutingOption' onClick={() => setDrawMode('draw_polygon')} disabled={drawMode === 'draw_polygon'}>
                                Draw Border
                            </button>
                            <button className='scoutingOption' onClick={() => setDrawMode('delete_polygon')} disabled={drawMode !== 'draw_polygon'}>
                                Reset
                            </button>
                            <button className='scoutingOption'
                                onClick={() => {
                                    setDrawMode('static')
                                    setSubmit(!submit)
                                }}
                                disabled={drawMode !== 'draw_polygon'}
                            >
                                Submit
                            </button>
                        </div>
                    )}

                    <div className={scoutLocation ? "cardShorten" : "card"}>
                        <div className="card-info">
                            <div className="card-title">Current Address</div>
                            <div className="card-subtitle">{address}</div>
                            <button className='addressButton' onClick={() => {
                                setScoutLocation(!scoutLocation)
                                if (scoutLocation) {
                                    setShowMarker(true)
                                }
                                else {
                                    setDrawMode('static')
                                }
                            }}>
                                {(scoutLocation) ? "Disable Scouting" : "Enable Scouting"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <RotatingGlobeMap
                lat={latitude}
                lon={longitude}
                scoutLocation={scoutLocation}
                showMarker={showMarker}
                drawMode={drawMode}
                submit={submit}
            />
        </>
    )
}

export default LocationForm