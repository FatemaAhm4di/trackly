import { AppBar, Toolbar, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material'
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
    { path: '/settings', label: t('nav.settings'), icon: 'Settings' }
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true
    return location.pathname.startsWith(path)
  }

  const drawer = (
    <Box sx={{ width: 240 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight="700" color="primary">
          {t('app.name')}
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'primary.main', minWidth: 40 }}>
                <Icon name={item.icon} size={24} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
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
        elevation={2}
        sx={{ 
          backgroundColor: 'white',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <Icon name="Menu" size={24} />
              </IconButton>
            )}
            <Typography 
              variant="h4" 
              fontWeight="700" 
              color="primary"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              {t('app.name')}
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {menuItems.map((item) => (
                <IconButton
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    backgroundColor: isActive(item.path) ? 'primary.light' : 'transparent',
                    color: isActive(item.path) ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive(item.path) ? 'primary.dark' : 'primary.light',
                      color: isActive(item.path) ? 'white' : 'primary.main'
                    },
                    px: 2,
                    py: 1
                  }}
                >
                  <Icon name={item.icon} size={20} sx={{ mr: 1 }} />
                  {item.label}
                </IconButton>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => changeLanguage(language === 'en' ? 'fa' : 'en')}
              sx={{
                backgroundColor: 'primary.light',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              <Typography variant="body2" fontWeight="600">
                {language === 'en' ? 'FA' : 'EN'}
              </Typography>
            </IconButton>
            
            {!isMobile && (
              <IconButton
                onClick={() => navigate('/goals/new')}
                color="primary"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                <Icon name="Add" size={20} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {t('nav.newGoal')}
                </Typography>
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Toolbar />
    </>
  )
}