import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpinnerLoading } from '../ui_components/SpinnerLoading';
import { createAuthSesion } from '../../services/factories/createAuthSesion';

function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function validateSesion() {
            const authSesion = createAuthSesion()
            console.log(authSesion)
            const isValidSesion = authSesion.validateSesion()
            if (isValidSesion) {
                navigate('/app/inbox')
            } else {
                setLoading(false)
            }
        }

        validateSesion()
    }, []);

    if (loading) return <SpinnerLoading />

    return (
        <div>
            <h1>Home</h1>
            <p>Bienvenido a la página principal. Por favor, inicia sesión.</p>
        </div>
    );
};

export { Home }
