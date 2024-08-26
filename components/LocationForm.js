'use client'

import React, { useState } from 'react'
import "./LocationForm.css"

const LocationForm = ({ address }) => {
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
                        <div className="card-subtitle">{address}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LocationForm