// src/contexts/LanguageContext.jsx
import { createContext } from 'react'

export const LanguageContext = createContext({
  language: 'en',
  direction: 'ltr',
  t: (key) => key,
  changeLanguage: () => {},
  toggleDirection: () => {}
})