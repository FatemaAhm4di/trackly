import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { LanguageProvider } from './contexts/LanguageProvider.jsx' // مسیر جدید
import { ThemeContextProvider } from './contexts/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeContextProvider>
        <CssBaseline />
        <App />
      </ThemeContextProvider>
    </LanguageProvider>
  </React.StrictMode>
)