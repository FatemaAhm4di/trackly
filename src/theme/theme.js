import { createTheme } from '@mui/material/styles'

// اضافه شدن پارامتر direction برای پشتیبانی از RTL
export const createAppTheme = (mode, direction = 'ltr') => createTheme({
  direction, // <-- این خط باعث می‌شود MUI بداند راست‌چین هستیم یا چپ‌چین
  palette: {
    mode,
    primary: {
      main: '#0f5fa0',
      light: '#5aa5d9',
      dark: '#0b385b',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#0e5488',
      light: '#368ac7',
      dark: '#073d66',
      contrastText: '#ffffff'
    },
    background: {
      default: mode === 'light' ? '#fcfcfc' : '#050505',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
    },
    success: { main: '#4caf50', light: '#79c67d', dark: '#388e3c' },
    warning: { main: '#ff9800', light: '#ffb74d', dark: '#f57c00' },
    error: { main: '#f44336', light: '#e57373', dark: '#cf2828' },
    text: {
      primary: mode === 'light' ? '#1a1a1a' : '#ffffff',
      secondary: mode === 'light' ? '#666666' : '#b0b0b0'
    }
  },
  typography: {
    fontFamily: '"Inter", "Vazirmatn", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700, letterSpacing: '-0.3px' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.3px' },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 }
  },
  shape: { borderRadius: 14 },
  shadows: mode === 'light' ? [
    'none', '0 2px 8px rgba(0,0,0,0.04)', '0 4px 16px rgba(0,0,0,0.06)', '0 6px 20px rgba(0,0,0,0.08)',
    '0 8px 24px rgba(0,0,0,0.1)', '0 10px 28px rgba(0,0,0,0.12)', '0 12px 32px rgba(0,0,0,0.14)',
    '0 14px 36px rgba(0,0,0,0.16)', '0 16px 40px rgba(0,0,0,0.18)', '0 18px 44px rgba(0,0,0,0.2)',
    '0 20px 48px rgba(0,0,0,0.22)', '0 22px 52px rgba(0,0,0,0.24)', '0 24px 56px rgba(0,0,0,0.26)',
    '0 26px 60px rgba(0,0,0,0.28)', '0 28px 64px rgba(0,0,0,0.3)', '0 30px 68px rgba(0,0,0,0.32)',
    '0 32px 72px rgba(0,0,0,0.34)', '0 34px 76px rgba(0,0,0,0.36)', '0 36px 80px rgba(0,0,0,0.38)',
    '0 38px 84px rgba(0,0,0,0.4)', '0 40px 88px rgba(0,0,0,0.42)', '0 42px 92px rgba(0,0,0,0.44)',
    '0 44px 96px rgba(0,0,0,0.46)', '0 46px 100px rgba(0,0,0,0.48)', '0 48px 104px rgba(0,0,0,0.5)'
  ] : [
    'none', '0 2px 8px rgba(0,0,0,0.3)', '0 4px 16px rgba(0,0,0,0.4)', '0 6px 20px rgba(0,0,0,0.5)',
    '0 8px 24px rgba(0,0,0,0.6)', '0 10px 28px rgba(0,0,0,0.7)', '0 12px 32px rgba(0,0,0,0.8)',
    '0 14px 36px rgba(0,0,0,0.9)', '0 16px 40px rgba(0,0,0,1)', '0 18px 44px rgba(0,0,0,1)',
    '0 20px 48px rgba(0,0,0,1)', '0 22px 52px rgba(0,0,0,1)', '0 24px 56px rgba(0,0,0,1)',
    '0 26px 60px rgba(0,0,0,1)', '0 28px 64px rgba(0,0,0,1)', '0 30px 68px rgba(0,0,0,1)',
    '0 32px 72px rgba(0,0,0,1)', '0 34px 76px rgba(0,0,0,1)', '0 36px 80px rgba(0,0,0,1)',
    '0 38px 84px rgba(0,0,0,1)', '0 40px 88px rgba(0,0,0,1)', '0 42px 92px rgba(0,0,0,1)',
    '0 44px 96px rgba(0,0,0,1)', '0 46px 100px rgba(0,0,0,1)', '0 48px 104px rgba(0,0,0,1)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, padding: '12px 28px', fontSize: '0.95rem',
          boxShadow: '0 4px 12px rgba(9, 102, 168, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { boxShadow: '0 8px 20px rgba(9, 102, 168, 0.3)', transform: 'translateY(-3px)' },
          '&:active': { transform: 'translateY(-1px)' }
        },
        contained: {
          background: `linear-gradient(135deg, #0966a8 0%, #032f51 100%)`,
          '&:hover': { background: `linear-gradient(135deg, #032f51 0%, #0966a8 100%)` }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          boxShadow: mode === 'light' ? '0 8px 24px rgba(0,0,0,0.06)' : '0 8px 24px rgba(0,0,0,0.4)',
          border: mode === 'light' ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(255,255,255,0.05)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: mode === 'light' ? '0 16px 40px rgba(0,0,0,0.12)' : '0 16px 40px rgba(0,0,0,0.6)',
            transform: 'translateY(-6px) scale(1.01)',
            borderColor: mode === 'light' ? 'rgba(9, 102, 168, 0.2)' : 'rgba(9, 102, 168, 0.4)'
          }
        }
      }
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: 20, backgroundImage: 'none' } } },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 14,
            backgroundColor: mode === 'light' ? '#f9fafb' : '#2a2a2a',
            transition: 'all 0.3s ease',
            '& fieldset': { borderColor: mode === 'light' ? '#e5e7eb' : '#444', borderWidth: '1.5px' },
            '&:hover fieldset': { borderColor: '#0966a8', borderWidth: '2px' },
            '&.Mui-focused fieldset': { borderColor: '#0966a8', borderWidth: '2.5px', boxShadow: '0 0 0 4px rgba(9, 102, 168, 0.1)' },
            '& input': { padding: '14px 16px', fontSize: '0.95rem' },
            '& textarea': { fontSize: '0.95rem', padding: '14px 16px' }
          },
          '& .MuiInputLabel-root': { fontSize: '0.9rem', '&.Mui-focused': { color: '#0966a8', fontWeight: 600 } }
        }
      }
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 10, fontWeight: 700, fontSize: '0.8rem', padding: '4px 8px', '& .MuiChip-icon': { color: 'inherit' } } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 10, height: 12, backgroundColor: mode === 'light' ? '#e5e7eb' : '#333', overflow: 'hidden' },
        bar: { borderRadius: 10, background: `linear-gradient(90deg, #0966a8, #5aa5d9)` }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 12, transition: 'all 0.2s ease', '&:hover': { backgroundColor: 'rgba(9, 102, 168, 0.08)' } }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRadius: '0 20px 20px 0', boxShadow: '10px 0 40px rgba(0,0,0,0.1)' }
      }
    }
  }
})

export default createAppTheme('light')