import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Home = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Make a request to the API to get a message
        API.get('/hello/')
            .then((response) => setMessage(response.data.message))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>{message || 'Welcome to the Home Page of Engineering Marketplace'}</h1>
        </div>
    );
};

export default Home;
