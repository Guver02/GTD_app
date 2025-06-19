import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    const handleClick = () => {
        navigate('/auth/login')
    }

    return (
        <div>
            <h1>Home</h1>
            <p>Bienvenido a la página principal, <span onClick={handleClick}>Inicia sesión</span>.</p>
        </div>
    );
};

export { Home }
