// AuthContainer.js
// AuthContainer.js
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Login } from './Login';
import { SignIn } from './SignIn';
//import './AuthContainer.css';

function AuthContainer() {
  const location = useLocation();



  return (

      <div className="auth-container">
        <div className={`form-wrapper ${location.pathname === '/login' ? 'login' : 'signin'}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </div>
      </div>

  );
}

export {AuthContainer};
