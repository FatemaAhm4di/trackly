import { Box, Paper, Container } from '@mui/material'
import { useLocation } from 'react-router-dom'
import Typography from '../ui/Typography'

export default function AuthLayout({ children, title, subtitle }) {

  const location = useLocation()
  const isLogin = location.pathname === '/login'

  return (

    <Container
      maxWidth="lg"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 2, sm: 4 }
      }}
    >

      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 'auto', sm: 580, md: 620 },
          minHeight: { xs: 'auto', sm: 580, md: 620 },
          borderRadius: { xs: 3, sm: 4 },
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(5, 5, 5, 0.35)',
          border: '1px solid rgba(255,255,255,.05)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >

        {/* GRADIENT PANEL - در موبایل و تبلت بالا */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: 280, sm: 320, md: '100%' },
            order: { xs: 1, md: isLogin ? 2 : 1 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, sm: 4, md: 6 },
            overflow: 'hidden',
            position: 'relative',
            background:
              'linear-gradient(135deg,#0f2027 0%,#203a43 45%,#2c5364 100%)'
          }}
        >

          {/* glow - تنظیم برای موبایل */}
          <Box
            sx={{
              position: 'absolute',
              width: { xs: 200, sm: 280, md: 420 },
              height: { xs: 200, sm: 280, md: 420 },
              background: 'rgba(0,180,255,.25)',
              filter: 'blur(70px)',
              top: { xs: -50, sm: -70, md: -120 },
              right: { xs: -50, sm: -70, md: -120 }
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              width: { xs: 160, sm: 220, md: 350 },
              height: { xs: 160, sm: 220, md: 350 },
              background: 'rgba(120,0,255,.25)',
              filter: 'blur(70px)',
              bottom: { xs: -50, sm: -70, md: -120 },
              left: { xs: -50, sm: -70, md: -120 }
            }}
          />

          {/* CONTENT */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              maxWidth: 420,
              color: 'white'
            }}
          >

            <Box
              component="img"
              src="/goal-illustration.svg"
              alt="goal illustration"
              sx={{
                width: { xs: '60%', sm: '50%', md: '100%' },
                maxWidth: { xs: 150, sm: 180, md: 300 },
                height: 'auto',
                mb: { xs: 1, sm: 1.5, md: 4 },
                mx: 'auto',
                display: 'block',
                animation: 'float 6s ease-in-out infinite'
              }}
            />

            <Typography
              variant="h2"
              fontWeight="800"
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.5rem' },
                mb: { xs: 0.5, sm: 1, md: 2 }
              }}
            >
              Trackly
            </Typography>

            <Typography
              variant="h6"
              sx={{ 
                opacity: .9, 
                mb: { xs: 0.5, sm: 1, md: 2 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
              }}
            >
              Your Goal Tracking Companion
            </Typography>

            <Typography
              variant="body1"
              sx={{ 
                opacity: .75,
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '1rem' }
              }}
            >
              Track goals, build streaks,
              earn XP and improve every day.
            </Typography>

          </Box>


          <style>
            {`
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-12px); }
              100% { transform: translateY(0px); }
            }
            `}
          </style>

        </Box>

        {/* FORM PANEL - در موبایل و تبلت پایین */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: 'auto', md: '100%' },
            order: { xs: 2, md: isLogin ? 1 : 2 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            p: { xs: 4, sm: 5, md: 6 },
            zIndex: 3
          }}
        >

          <Box sx={{ width: '100%', maxWidth: 420 }}>

            <Typography
              variant="h3"
              fontWeight="800"
              gutterBottom
              sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' } }}
            >
              {title}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' } }}
            >
              {subtitle}
            </Typography>

            {children}

          </Box>

        </Box>

      </Paper>

    </Container>

  )
}