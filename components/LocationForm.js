'use client'

import React, { useRef, useState, useEffect } from 'react'
import RotatingGlobeMap from './RotatingGlobeMap'
import { getCoordinatesFromIP, getCoordinatesFromAddress, getAddressFromCoordinates } from '@utils/Location'
import "./LocationForm.css"

const LocationForm = () => {
    const addressInputRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false);

    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [addressInput, setAddressInput] = useState("");
    const [addressOptions, setAddressOptions] = useState([]);

    useEffect(() => {
        (async () => {
            const coords = await getCoordinatesFromIP();
            const address = await getAddressFromCoordinates(coords);
            setLatitude(coords.lat);
            setLongitude(coords.lon);
            setAddress(address);
        })();
    }, [])

    useEffect(() => {
        if (addressInput) {
            (async () => {
                const addresses = await getCoordinatesFromAddress(addressInput);
                setAddressOptions(
                    addresses.map((value) => value.properties.formatted)
                )
                if (addressOptions.find(option => option === addressInput)) {
                    handleSubmit();
                }
            })();
        }
    }, [addressInput])

    const handleSubmit = async () => {
        console.log("Submitted: " + addressInput)

        const newAddress = await getCoordinatesFromAddress(addressInput);
        setAddress(newAddress[0].properties.formatted);
        setLatitude(newAddress[0].properties.lat);
        setLongitude(newAddress[0].properties.lon);

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
                            onChange={(event) => {setAddressInput(event.target.value)}}
                            value={addressInput}
                            ref={addressInputRef}
                        />
                        <datalist id="address">
                            {addressOptions.map((val, index) => {
                                return (
                                    <option value={val} key={index}/>
                                );
                            })}
                        </datalist>
                        <button
                            className={isFocused ? "addressButton" : "addressButtonHidden"} 
                        >Locate</button>
                    </form>
                </div>
                <div className='innerbox'>
                    <div className="card">
                        <div className="card-info">
                            <div className="card-title">Current Address</div>
                            <div className="card-subtitle">{address}</div>
                        </div>
                    </div>
                </div>
            </div>
            <RotatingGlobeMap lat={latitude} lon={longitude} />
        </>
    )
}

export default LocationForm