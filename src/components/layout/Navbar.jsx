import { AppBar, Toolbar, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme, alpha } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import Icon from '../ui/Icon'
import Typography from '../ui/Typography'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t, language, changeLanguage } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: 'Dashboard' },
    { path: '/goals', label: t('nav.goals'), icon: 'Flag' },
    { path: '/categories', label: t('nav.categories'), icon: 'Category' },
    { path: '/archive', label: t('nav.archive'), icon: 'Archive' },    
    { path: '/settings', label: t('nav.settings'), icon: 'Settings' }
  ]

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) setMobileOpen(false)
  }

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true
    return location.pathname.startsWith(path)
  }

  const drawer = (
    <Box sx={{ width: 260, bgcolor: 'background.paper', height: '100%' }}>
      <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="TrackChanges" size={20} color="white" />
        </Box>
        <Typography variant="h5" fontWeight="800" color="text.primary">
          {t('app.name')}
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1, my: 0.5, borderRadius: 3, px: 2, py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) }
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                <Icon name={item.icon} size={22} />
              </ListItemIcon>
              <ListItemText primary={item.label} sx={{ ml: 1 }} />
              {isActive(item.path) && (
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(12px)',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <Icon name="Menu" size={24} />
              </IconButton>
            )}
            <Box 
              onClick={() => navigate('/')}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                cursor: 'pointer',
                '&:hover': { opacity: 0.9 }
              }}
            >
              {!isMobile && (
                <Box sx={{ width: 36, height: 36, borderRadius: 3, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(54, 138, 199, 0.3)' }}>
                  <Icon name="TrackChanges" size={22} color="white" />
                </Box>
              )}
              <Typography 
                variant="h5" 
                fontWeight="800" 
                color="primary"
                sx={{ letterSpacing: '-0.5px' }}
              >
                {t('app.name')}
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: alpha(theme.palette.primary.main, 0.05), px: 1, py: 0.5, borderRadius: 4 }}>
              {menuItems.map((item) => (
                <IconButton
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    px: 2, py: 1, borderRadius: 3, mx: 0.5,
                    color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                    backgroundColor: isActive(item.path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      color: 'primary.main',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease'
                    },
                    '& .MuiIconButton-startIcon': { mr: 0.5 }
                  }}
                >
                  <Icon name={item.icon} size={18} />
                  <Typography variant="body2" fontWeight="600">{item.label}</Typography>
                </IconButton>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              onClick={() => changeLanguage(language === 'en' ? 'fa' : 'en')}
              sx={{
                border: 1,
                borderColor: 'divider',
                width: 40,
                height: 40,
                borderRadius: 3,
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main'
                }
              }}
            >
              <Typography variant="caption" fontWeight="800">
                {language === 'en' ? 'FA' : 'EN'}
              </Typography>
            </IconButton>
            
            {!isMobile && (
              <IconButton
                onClick={() => navigate('/goals/new')}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 2.5,
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(54, 138, 199, 0.3)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(54, 138, 199, 0.4)'
                  }
                }}
              >
                <Icon name="Add" size={20} />
                <Typography variant="body2" fontWeight="700" sx={{ ml: 1 }}>{t('nav.newGoal')}</Typography>
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 }
          }}
        >
          {drawer}
        </Drawer>
      )}
      <Toolbar />
    </>
  )
}