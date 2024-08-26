'use client'

import React, { useState } from 'react'
import "./LocationData.css"

const LocationData = () => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className='outerbox'>
            <div className='innerbox'>
                <form className='addressForm'>
                    <input
                        className='addressInput'
                        type="text"
                        name="name"
                        placeholder='Type address'
                        autoComplete='off'
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <button className={isFocused ? "addressButton" : "addressButtonHidden"}>Locate</button>
                </form>
            </div>
            <div className='innerbox'>
                <div className="card">
                    <div className="card-info">
                        <div className="card-title">Current Address</div>
                        <div className="card-subtitle">UCHC Sector - 45, Sukhna Path, Sector 45, Chandigarh - 160047, CH, India</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LocationData