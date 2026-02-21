import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeContext } from './ThemeContext'; // ایمپورت از فایل js بالا
import { createAppTheme } from '../theme/theme';

export function ThemeContextProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('trackly_theme');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('trackly_theme', themeMode);
  }, [themeMode]);

  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}