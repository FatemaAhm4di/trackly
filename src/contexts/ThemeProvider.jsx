import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeContext } from './ThemeContext';
import { createAppTheme } from '../theme/theme';

// ✅ اینجا اسم تابع مهمه - باید با چیزی که import میکنی یکی باشه
export function ThemeProvider({ children }) {
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