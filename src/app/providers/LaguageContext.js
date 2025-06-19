import React, { createContext, useState } from "react";
import { supportedLanguages, translations } from "../../controllers/translationsServices";

const LanguageContext = createContext()

function LanguageProvider ({children}) {
    const getSavedLanguage = localStorage.getItem('lang')

    const actLanguage = getSavedLanguage ? getSavedLanguage : supportedLanguages.en

    const [language, setLanguage] = useState(actLanguage)

    const changeLanguage = (codeLang) => {
        if(Object.values(supportedLanguages).includes(codeLang)){
            setLanguage(codeLang)
        }
    }

    return (<LanguageContext.Provider
    value={{
        language,
        changeLanguage,
        translation: translations[language]
    }}>
        {children}
    </LanguageContext.Provider>)
}

export { LanguageContext, LanguageProvider}
