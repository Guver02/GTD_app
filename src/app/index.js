import React from "react";
import ReactDOM from "react-dom/client"
import { App } from "./App";
import { LanguageProvider } from "./providers/LaguageContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'))

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('SW registrado:', reg);
            })
            .catch(err => {
                console.warn('Error registrando SW:', err);
            });
    });
}

root.render(
        <BrowserRouter>
            <App/>
        </BrowserRouter>
)
