import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: '#054532',
    },
    secondary: {
      main: '#589a84', 
    },
    background: {
      default: '#ffffff',   
      paper: '#f8faf9',    
    },
    text: {
      primary: '#1a1a1a',   
      secondary: '#666666', 
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    body1: { fontSize: '1rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '10px',
          padding: '8px 16px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(5, 69, 50, 0.15)',
          },
        },
        containedPrimary: {
          backgroundColor: '#054532',
          '&:hover': {
            backgroundColor: '#043729',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(5, 69, 50, 0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 24px rgba(5, 69, 50, 0.1)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e0f2e9',
        },
        bar: {
          borderRadius: 4,
          backgroundColor: '#054532',
        },
      },
    },
  },
});