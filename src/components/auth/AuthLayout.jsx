import { Box, Paper, Container } from '@mui/material'
import { useLocation } from 'react-router-dom'
import Typography from '../ui/Typography'

export default function AuthLayout({ children, title, subtitle }) {

  const location = useLocation()
  const isLogin = location.pathname === '/login'

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: { xs: 1, sm: 2, md: 3, lg: 4 }
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: { xs: '100%', sm: '90%', md: '95%', lg: 1200 },
          height: { xs: 'auto', sm: 'auto', md: 580, lg: 620 },
          minHeight: { xs: 'auto', sm: 'auto', md: 580, lg: 620 },
          borderRadius: { xs: 2, sm: 3, md: 4 },
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(5, 5, 5, 0.35)',
          border: '1px solid rgba(121, 120, 120, 0.05)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'row' }
        }}
      >
        {/* GRADIENT PANEL - Responsive */}
        <Box
          sx={{
            width: { xs: '100%', sm: '100%', md: '50%', lg: '50%' },
            height: { xs: 260, sm: 300, md: '100%', lg: '100%' },
            order: { xs: 1, sm: 1, md: isLogin ? 2 : 1, lg: isLogin ? 2 : 1 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, sm: 3, md: 4, lg: 6 },
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg,#0f2027 0%,#203a43 45%,#2c5364 100%)'
          }}
        >
          {/* Glow effects - Responsive */}
          <Box
            sx={{
              position: 'absolute',
              width: { xs: 150, sm: 200, md: 350, lg: 420 },
              height: { xs: 150, sm: 200, md: 350, lg: 420 },
              background: 'rgba(0,180,255,.25)',
              filter: 'blur(60px)',
              top: { xs: -40, sm: -50, md: -100, lg: -120 },
              right: { xs: -40, sm: -50, md: -100, lg: -120 }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: { xs: 120, sm: 160, md: 280, lg: 350 },
              height: { xs: 120, sm: 160, md: 280, lg: 350 },
              background: 'rgba(120,0,255,.25)',
              filter: 'blur(60px)',
              bottom: { xs: -40, sm: -50, md: -100, lg: -120 },
              left: { xs: -40, sm: -50, md: -100, lg: -120 }
            }}
          />

          {/* Content */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              maxWidth: { xs: 280, sm: 320, md: 380, lg: 420 },
              color: 'white'
            }}
          >
            <Box
              component="img"
              src="/goal-illustration.svg"
              alt="goal illustration"
              sx={{
                width: { xs: '70%', sm: '60%', md: '80%', lg: '100%' },
                maxWidth: { xs: 120, sm: 150, md: 220, lg: 280 },
                height: 'auto',
                mb: { xs: 1, sm: 1.5, md: 2, lg: 3 },
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
                fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem', lg: '2.5rem' },
                mb: { xs: 0.5, sm: 0.5, md: 1, lg: 2 }
              }}
            >
              Trackly
            </Typography>

            <Typography
              variant="h6"
              sx={{ 
                opacity: 0.9,
                mb: { xs: 0.5, sm: 0.5, md: 1, lg: 2 },
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.25rem' }
              }}
            >
              Your Goal Tracking Companion
            </Typography>

            <Typography
              variant="body1"
              sx={{ 
                opacity: 0.75,
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.85rem', lg: '1rem' },
                display: { xs: 'none', sm: 'block', md: 'block', lg: 'block' }
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

        {/* FORM PANEL - Responsive */}
        <Box
          sx={{
            width: { xs: '100%', sm: '100%', md: '50%', lg: '50%' },
            height: { xs: 'auto', sm: 'auto', md: '100%', lg: '100%' },
            order: { xs: 2, sm: 2, md: isLogin ? 1 : 2, lg: isLogin ? 1 : 2 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            p: { xs: 2.5, sm: 4, md: 5, lg: 6 },
            zIndex: 3,
            overflowY: 'auto'
          }}
        >
          <Box sx={{ 
            width: '100%', 
            maxWidth: { xs: '100%', sm: 400, md: 420, lg: 440 },
            px: { xs: 1, sm: 2, md: 0 }
          }}>
            <Typography
              variant="h3"
              fontWeight="800"
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                textAlign: { xs: 'center', sm: 'center', md: 'left', lg: 'left' }
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4, lg: 4 },
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem', lg: '1rem' },
                textAlign: { xs: 'center', sm: 'center', md: 'left', lg: 'left' }
              }}
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