import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { CircularStepProgress } from '../utils_component/CircularStepProgress';
import { SpinnerLoading } from '../ui_components/SpinnerLoading';

function Home () {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const authService = new AuthService(localStorage)
        const token = authService.getToken();
        if (token) {
            navigate('/app/inbox');
            setLoading(true)
        }
        setLoading(false)
    }, []);

    if(loading) return <SpinnerLoading/>

    return (
        <div>
            <h1>Home</h1>
            <p>Bienvenido a la página principal. Por favor, inicia sesión.</p>
        </div>
    );
};

export {Home}
