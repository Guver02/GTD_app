import React from "react";
import ReactDOM from "react-dom/client"
import { App } from "./App";
import { LanguageProvider } from "./providers/LaguageContext";

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <LanguageProvider>
        <App/>
    </LanguageProvider>
)
