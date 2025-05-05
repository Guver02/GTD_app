import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const isAuthenticated = !!localStorage.getItem('jwtToken'); // Verifica si el JWT existe

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
}

export {ProtectedRoute};
