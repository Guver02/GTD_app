import React from "react";
import ReactDOM from "react-dom/client"
import { App } from "./App";
import { LanguageProvider } from "./providers/LaguageContext";

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
    <LanguageProvider>
        <App/>
    </LanguageProvider>
)
