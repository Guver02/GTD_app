import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Login } from './Login';
import { SignIn } from './SignIn';
import * as styles from './AuthContainer.module.css'

const { authContainer } = styles

function AuthContainer() {
    return (
        <div className={authContainer}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signin" element={<SignIn />} />
            </Routes>
        </div>
    );
}

export { AuthContainer };
