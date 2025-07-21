import React, { createContext, useState, useEffect } from "react";
import { supportedLanguages, translations } from "../../controllers/translationsServices";

const LanguageContext = createContext()

function LanguageProvider({ children }) {
  const defaultLanguage = supportedLanguages.es

  const getSavedLanguage = () => {
    const saved = localStorage.getItem('lang')
    return Object.values(supportedLanguages).includes(saved) ? saved : defaultLanguage
  }

  const [language, setLanguage] = useState(getSavedLanguage)

  const changeLanguage = (codeLang) => {
    if (Object.values(supportedLanguages).includes(codeLang)) {
      setLanguage(codeLang)
      localStorage.setItem('lang', codeLang)
    }
  }

  useEffect(() => {

    const savedLang = localStorage.getItem('lang')
    if (savedLang && savedLang !== language) {
      setLanguage(savedLang)
    }
  }, [])

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        translation: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export { LanguageContext, LanguageProvider };
