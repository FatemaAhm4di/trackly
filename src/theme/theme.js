import { createTheme } from '@mui/material/styles'

export const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#368ac7',
      light: '#5aa5d9',
      dark: '#0e5488',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#0e5488',
      light: '#368ac7',
      dark: '#073d66',
      contrastText: '#ffffff'
    },
    background: {
      default: mode === 'light' ? '#f5f7fa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c'
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00'
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f'
    },
    text: {
      primary: mode === 'light' ? '#1a1a1a' : '#ffffff',
      secondary: mode === 'light' ? '#666666' : '#b0b0b0'
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: mode === 'light' ? [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.08)',
    '0 6px 12px rgba(0,0,0,0.1)',
    '0 8px 16px rgba(0,0,0,0.12)',
    '0 10px 20px rgba(0,0,0,0.15)',
    '0 12px 24px rgba(0,0,0,0.18)',
    '0 14px 28px rgba(0,0,0,0.2)',
    '0 16px 32px rgba(0,0,0,0.22)',
    '0 18px 36px rgba(0,0,0,0.25)',
    '0 20px 40px rgba(0,0,0,0.28)',
    '0 22px 44px rgba(0,0,0,0.3)',
    '0 24px 48px rgba(0,0,0,0.32)',
    '0 26px 52px rgba(0,0,0,0.35)',
    '0 28px 56px rgba(0,0,0,0.38)',
    '0 30px 60px rgba(0,0,0,0.4)',
    '0 32px 64px rgba(0,0,0,0.42)',
    '0 34px 68px rgba(0,0,0,0.45)',
    '0 36px 72px rgba(0,0,0,0.48)',
    '0 38px 76px rgba(0,0,0,0.5)',
    '0 40px 80px rgba(0,0,0,0.52)',
    '0 42px 84px rgba(0,0,0,0.55)',
    '0 44px 88px rgba(0,0,0,0.58)',
    '0 46px 92px rgba(0,0,0,0.6)',
    '0 48px 96px rgba(0,0,0,0.62)'
  ] : [
    'none',
    '0 2px 4px rgba(0,0,0,0.2)',
    '0 4px 8px rgba(0,0,0,0.3)',
    '0 6px 12px rgba(0,0,0,0.4)',
    '0 8px 16px rgba(0,0,0,0.5)',
    '0 10px 20px rgba(0,0,0,0.6)',
    '0 12px 24px rgba(0,0,0,0.7)',
    '0 14px 28px rgba(0,0,0,0.8)',
    '0 16px 32px rgba(0,0,0,0.9)',
    '0 18px 36px rgba(0,0,0,1)',
    '0 20px 40px rgba(0,0,0,1)',
    '0 22px 44px rgba(0,0,0,1)',
    '0 24px 48px rgba(0,0,0,1)',
    '0 26px 52px rgba(0,0,0,1)',
    '0 28px 56px rgba(0,0,0,1)',
    '0 30px 60px rgba(0,0,0,1)',
    '0 32px 64px rgba(0,0,0,1)',
    '0 34px 68px rgba(0,0,0,1)',
    '0 36px 72px rgba(0,0,0,1)',
    '0 38px 76px rgba(0,0,0,1)',
    '0 40px 80px rgba(0,0,0,1)',
    '0 42px 84px rgba(0,0,0,1)',
    '0 44px 88px rgba(0,0,0,1)',
    '0 46px 92px rgba(0,0,0,1)',
    '0 48px 96px rgba(0,0,0,1)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: '0 2px 4px rgba(54, 138, 199, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(54, 138, 199, 0.3)',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0 4px 12px rgba(0,0,0,0.08)' 
            : '0 4px 12px rgba(0,0,0,0.5)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0 8px 24px rgba(0,0,0,0.12)'
              : '0 8px 24px rgba(0,0,0,0.6)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 10
        }
      }
    }
  }
})

export default createAppTheme('light')