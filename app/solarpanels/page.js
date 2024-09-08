'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios';

const SolarPanels = () => {
    const [titles, setTitles] = useState("");

    useEffect(() => {
        axios.get('/api/panelUpdate')
            .then((response) => { setTitles(JSON.stringify(response.data.documents[0])) })
            .catch((error) => { console.error(error.message) });
    }, []);

    return (
        <div>
            <h1>Panels data</h1>
            <p>{titles}</p>
        </div>
    );
}

export default SolarPanels