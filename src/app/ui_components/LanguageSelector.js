import React from 'react';
import { useLanguage } from '../custom_hooks/useLanguage';
import { Globe, Check } from 'lucide-react';
import * as styles from './LanguageSelector.module.css';

const {
  container,
  header,
  icon,
  title,
  languageButton,
  activeLanguage,
  languageLabel,
  checkIcon,
} = styles

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
]

function LanguageSelector() {
  const { language, changeLanguage } = useLanguage()
  const {translation} = useLanguage()

  return (
    <div className={container}>
      <div className={header}>
        <Globe className={icon} />
        <span className={title}>{translation.language}</span>
      </div>
      <div>
        {languages.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            className={`${languageButton} ${language === code ? activeLanguage : ''}`}
          >
            <span className={languageLabel}>{label}</span>
            {language === code && <Check className={checkIcon} />}
          </button>
        ))}
      </div>
    </div>
  )
}

export { LanguageSelector }
