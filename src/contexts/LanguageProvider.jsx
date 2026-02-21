import { useState, useEffect } from 'react'
import { LanguageContext } from './LanguageContext'
import en from '../i18n/en.json'
import fa from '../i18n/fa.json'
import ps from '../i18n/ps.json'

const translations = {
  en,
  fa,
  ps
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('trackly_language')
    return saved || 'en'
  })
  
  const [direction, setDirection] = useState(() => {
    const saved = localStorage.getItem('trackly_direction')
    return saved || 'ltr'
  })

  useEffect(() => {
    localStorage.setItem('trackly_language', language)
    localStorage.setItem('trackly_direction', direction)
    document.documentElement.dir = direction
    document.documentElement.lang = language
  }, [language, direction])

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
    if (lang === 'fa' || lang === 'ps') {
      setDirection('rtl')
    } else {
      setDirection('ltr')
    }
  }

  const toggleDirection = () => {
    setDirection(direction === 'ltr' ? 'rtl' : 'ltr')
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      direction, 
      t, 
      changeLanguage, 
      toggleDirection 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}