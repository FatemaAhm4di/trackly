import { Box, CircularProgress, useTheme } from '@mui/material'
import { useLanguage } from '../../hooks/useLanguage'
import Typography from './Typography'


export function LoadingSpinner({ size = 40, color = 'primary' }) {
  return (
    <CircularProgress 
      size={size} 
      color={color}
      thickness={4}
      sx={{
        animation: 'spin 1s linear infinite',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }}
    />
  )
}


export function PageLoading() {
  const theme = useTheme()
  const { t } = useLanguage()
  

  const backgroundColor = theme.palette.mode === 'dark' 
    ? 'rgba(0, 0, 0, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)'

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          p: 4,
          borderRadius: 4,
          backgroundColor: 'background.paper',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ position: 'relative', width: 80, height: 80 }}>
          <CircularProgress
            size={80}
            thickness={3}
            sx={{
              color: 'primary.main',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
          <CircularProgress
            size={80}
            thickness={3}
            value={100}
            variant="determinate"
            sx={{
              color: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          {t('loading.loading') || 'Loading...'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' }
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// لودینگ برای کارت‌ها 
export function CardLoading() {
  const theme = useTheme()
  
  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ 
          width: '60%', 
          height: 24, 
          bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200', 
          borderRadius: 1, 
          animation: 'shimmer 2s infinite' 
        }} />
        <Box sx={{ 
          width: 24, 
          height: 24, 
          bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200', 
          borderRadius: '50%', 
          animation: 'shimmer 2s infinite' 
        }} />
      </Box>
      <Box sx={{ 
        width: '100%', 
        height: 8, 
        bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200', 
        borderRadius: 1, 
        mb: 2, 
        animation: 'shimmer 2s infinite' 
      }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box sx={{ 
          width: 60, 
          height: 24, 
          bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200', 
          borderRadius: 1, 
          animation: 'shimmer 2s infinite' 
        }} />
        <Box sx={{ 
          width: 60, 
          height: 24, 
          bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200', 
          borderRadius: 1, 
          animation: 'shimmer 2s infinite' 
        }} />
      </Box>

      <style>
        {`
          @keyframes shimmer {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </Box>
  )
}

export function ButtonLoading() {
  const { t } = useLanguage()
  
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={16} thickness={5} sx={{ color: 'white' }} />
      <Typography variant="button" sx={{ color: 'white' }}>
        {t('loading.pleaseWait') || 'Please wait...'}
      </Typography>
    </Box>
  )
}