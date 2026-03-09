import { Box, Paper, Container } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Typography from '../ui/Typography'

export default function AuthLayout({ children, title, subtitle }) {
  const location = useLocation()
  const [isLogin, setIsLogin] = useState(true)

  // ✅ اینو عوض کردم - بدون ارور
  useEffect(() => {
    // با تایمر 0 مشکل cascading رفع میشه
    const timer = setTimeout(() => {
      setIsLogin(location.pathname === '/login')
    }, 0)
    
    return () => clearTimeout(timer)
  }, [location.pathname])

  // گرادینت‌های آبی ملایم
  const loginGradient = 'linear-gradient(145deg, #0e5488 0%, #2c7ab1 100%)'
  const registerGradient = 'linear-gradient(145deg, #0a4270 0%, #1e5f8e 100%)'

  return (
    <Container maxWidth="lg" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      py: 4 
    }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          width: '100%',
          minHeight: 600,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
          position: 'relative'
        }}
      >
        {/* فرم */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            position: 'relative',
            left: { md: isLogin ? '0%' : '50%' },
            transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 2
          }}
        >
          <Typography variant="h3" fontWeight="800" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {subtitle}
          </Typography>
          {children}
        </Box>

        {/* گرادینت - حتما نمایش داده میشه */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            background: isLogin ? loginGradient : registerGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            position: 'relative',
            left: { md: isLogin ? '50%' : '0%' },
            transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.6s ease',
            zIndex: 1
          }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            color: 'white', 
            maxWidth: 400
          }}>
            <Typography variant="h2" fontWeight="800" gutterBottom>
              Trackly
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }}>
              Your Goal Tracking Companion
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Track your goals, build streaks, earn XP, and achieve more every day.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}