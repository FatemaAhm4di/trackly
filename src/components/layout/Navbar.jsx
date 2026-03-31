import { AppBar, Toolbar, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme, alpha, Avatar, Menu, MenuItem, Divider, Badge } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useThemeContext } from '../../hooks/useThemeContext'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../ui/Icon'
import Typography from '../ui/Typography'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t, language, changeLanguage } = useLanguage()
  const { themeMode, toggleTheme } = useThemeContext()
  const { user, logout, notifications, unreadCount, markAsRead, markAllAsRead } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [langAnchorEl, setLangAnchorEl] = useState(null)
  const [notifAnchorEl, setNotifAnchorEl] = useState(null)

  const menuItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: 'Dashboard' },
    { path: '/goals', label: t('nav.goals'), icon: 'Flag' },
    { path: '/categories', label: t('nav.categories'), icon: 'Category' },
    { path: '/archive', label: t('nav.archive'), icon: 'Archive' },    
    { path: '/settings', label: t('nav.settings'), icon: 'Settings' }
  ]

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleProfileMenuClose = () => setAnchorEl(null)
  const handleLangMenuOpen = (event) => setLangAnchorEl(event.currentTarget)
  const handleLangMenuClose = () => setLangAnchorEl(null)
  const handleNotifMenuOpen = (event) => setNotifAnchorEl(event.currentTarget)
  const handleNotifMenuClose = () => setNotifAnchorEl(null)

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) setMobileOpen(false)
  }

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true
    return location.pathname.startsWith(path)
  }

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id)
    if (notification.type === 'goal_completed' && notification.data?.goalId) {
      navigate(`/goals/${notification.data.goalId}`)
    }
    handleNotifMenuClose()
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const drawer = (
    <Box sx={{ width: 280, bgcolor: 'background.paper', height: '100%' }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="TrackChanges" size={24} color="white" />
        </Box>
        <Typography variant="h5" fontWeight="800" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          Trackly
        </Typography>
      </Box>
      
      <List sx={{ pt: 2, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1.5,
                px: 2,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.18) }
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateX(6px)'
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'text.secondary', minWidth: 44 }}>
                <Icon name={item.icon} size={22} />
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(item.path) ? 600 : 500,
                  fontSize: '0.95rem'
                }} 
              />
              {isActive(item.path) && (
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Notifications in Drawer */}
      <ListItemButton onClick={handleNotifMenuOpen} sx={{ borderRadius: 2, py: 1.5, mx: 1, mb: 0.5 }}>
        <ListItemIcon sx={{ minWidth: 44 }}>
          <Badge badgeContent={unreadCount} color="error">
            <Icon name="Notifications" size={20} />
          </Badge>
        </ListItemIcon>
        <ListItemText primary={t('nav.notifications') || 'Notifications'} />
      </ListItemButton>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ px: 2, mt: 'auto', mb: 2 }}>
        <ListItemButton
          onClick={() => { handleNavigation('/profile'); handleDrawerToggle(); }}
          sx={{ borderRadius: 2, py: 1.5 }}
        >
          <ListItemIcon sx={{ minWidth: 44 }}>
            <Avatar src={user?.avatar} sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {!user?.avatar && <Icon name="Person" size={18} color="white" />}
            </Avatar>
          </ListItemIcon>
          <ListItemText 
            primary={user?.name || t('nav.guest')} 
            secondary={user?.email || t('nav.signIn')}
            primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </ListItemButton>
        
        <ListItemButton
          onClick={() => { handleNavigation('/profile/edit'); handleDrawerToggle(); }}
          sx={{ borderRadius: 2, py: 1, ml: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icon name="Edit" size={18} color="text.secondary" />
          </ListItemIcon>
          <ListItemText primary={t('nav.editProfile') || 'Edit Profile'} primaryTypographyProps={{ fontSize: '0.85rem' }} />
        </ListItemButton>

        <ListItemButton
          onClick={() => { navigate('/goals/new'); handleDrawerToggle(); }}
          sx={{ borderRadius: 2, py: 1, ml: 2, mt: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icon name="Add" size={18} color="primary.main" />
          </ListItemIcon>
          <ListItemText primary={t('nav.newGoal') || 'New Goal'} primaryTypographyProps={{ fontSize: '0.85rem' }} />
        </ListItemButton>
        
        <Divider sx={{ my: 2 }} />
        
        <ListItemButton
          onClick={() => { logout(); handleDrawerToggle(); }}
          sx={{ 
            borderRadius: 2, 
            py: 1.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.08)
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 44, color: 'error.main' }}>
            <Icon name="Logout" size={20} />
          </ListItemIcon>
          <ListItemText primary={t('nav.logout') || 'Sign Out'} primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItemButton>
      </Box>
    </Box>
  )

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧', name: t('languages.english') },
    { code: 'fa', label: 'فارسی', flag: '🇮🇷', name: t('languages.persian') },
    { code: 'ps', label: 'پښتو', flag: '🇦🇫', name: t('languages.pashto') }
  ]

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '72px !important', px: { xs: 2, sm: 3 } }}>
          
          {/* سمت چپ: لوگو + منوی همبرگر */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                sx={{ 
                  color: 'text.primary',
                  borderRadius: 2,
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
                '&:hover': { opacity: 0.9 },
                transition: 'opacity 0.2s ease'
              }}
            >
              <Box sx={{ 
                width: { xs: 36, sm: 40 }, 
                height: { xs: 36, sm: 40 }, 
                borderRadius: 2.5, 
                bgcolor: 'primary.main', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`
              }}>
                <Icon name="TrackChanges" size={22} color="white" />
              </Box>
              <Typography 
                variant="h6" 
                fontWeight="800" 
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: '-0.5px',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
                }}
              >
                Trackly
              </Typography>
            </Box>
          </Box>

          {/* منوی دسکتاپ */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              bgcolor: alpha(theme.palette.primary.main, 0.04), 
              px: 1, 
              py: 0.5, 
              borderRadius: 6 
            }}>
              {menuItems.map((item) => (
                <IconButton
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    px: 2, 
                    py: 1, 
                    borderRadius: 4, 
                    mx: 0.5,
                    color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                    backgroundColor: isActive(item.path) ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Icon name={item.icon} size={20} />
                  <Typography variant="body2" fontWeight={isActive(item.path) ? 600 : 500} sx={{ ml: 1 }}>
                    {item.label}
                  </Typography>
                </IconButton>
              ))}
            </Box>
          )}

          {/* آیکون‌های سمت راست */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            
            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              sx={{ 
                borderRadius: 2.5,
                width: 40,
                height: 40,
                border: 1,
                borderColor: 'divider',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <Icon name={themeMode === 'light' ? 'DarkMode' : 'LightMode'} size={20} color="text.primary" />
            </IconButton>

            {/* Language Switcher */}
            <IconButton
              onClick={handleLangMenuOpen}
              sx={{ 
                borderRadius: 2.5,
                width: 40,
                height: 40,
                border: 1,
                borderColor: 'divider',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <Typography variant="body2" fontWeight="600">
                {language === 'en' ? 'EN' : language === 'fa' ? 'FA' : 'PS'}
              </Typography>
            </IconButton>

            {/* Notifications - فقط در دسکتاپ */}
            {!isMobile && (
              <IconButton
                onClick={handleNotifMenuOpen}
                sx={{ 
                  borderRadius: 2.5,
                  width: 40,
                  height: 40,
                  border: 1,
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 18, height: 18 } }}>
                  <Icon name="Notifications" size={20} color="text.primary" />
                </Badge>
              </IconButton>
            )}

            {/* User Avatar - فقط در دسکتاپ */}
            {!isMobile && (
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ 
                  p: 0.5,
                  border: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  borderRadius: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <Avatar 
                  src={user?.avatar} 
                  sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
                >
                  {!user?.avatar && <Icon name="Person" size={22} color="white" />}
                </Avatar>
              </IconButton>
            )}

            {/* New Goal Button - فقط در دسکتاپ */}
            {!isMobile && (
              <IconButton
                onClick={() => navigate('/goals/new')}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <Icon name="Add" size={20} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
          <Typography variant="subtitle2" fontWeight="600">{user?.name || 'Guest'}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email || 'Sign in to your account'}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { handleNavigation('/profile'); handleProfileMenuClose(); }} sx={{ py: 1.5, gap: 1.5 }}>
          <Icon name="Person" size={18} />
          <Typography variant="body2">{t('nav.profile') || 'Profile'}</Typography>
        </MenuItem>
        <MenuItem onClick={() => { handleNavigation('/settings'); handleProfileMenuClose(); }} sx={{ py: 1.5, gap: 1.5 }}>
          <Icon name="Settings" size={18} />
          <Typography variant="body2">{t('nav.settings') || 'Settings'}</Typography>
        </MenuItem>
      </Menu>

      {/* Language Menu */}
      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={handleLangMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code}
            onClick={() => { changeLanguage(lang.code); handleLangMenuClose(); }}
            selected={language === lang.code}
            sx={{ py: 1.2, gap: 1.5 }}
          >
            <Typography variant="body1">{lang.flag}</Typography>
            <Typography variant="body2" fontWeight={language === lang.code ? 600 : 400}>
              {lang.name}
            </Typography>
            {language === lang.code && (
              <Icon name="Check" size={16} color="primary" sx={{ ml: 'auto' }} />
            )}
          </MenuItem>
        ))}
      </Menu>

      {/* Notifications Menu - آپدیت شده با دیتای واقعی */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={handleNotifMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 320,
            maxHeight: 400,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="600">
            {t('nav.notifications') || 'Notifications'}
          </Typography>
          {unreadCount > 0 && (
            <Typography 
              variant="caption" 
              sx={{ cursor: 'pointer', color: 'primary.main' }}
              onClick={() => { markAllAsRead(); handleNotifMenuClose(); }}
            >
              Mark all as read
            </Typography>
          )}
        </Box>
        
        {notifications && notifications.length > 0 ? (
          <>
            {notifications.slice(0, 10).map((notif) => (
              <MenuItem 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                sx={{ 
                  py: 1.5, 
                  px: 2, 
                  flexDirection: 'column', 
                  alignItems: 'flex-start', 
                  gap: 0.5,
                  bgcolor: notif.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                <Typography variant="body2" fontWeight={notif.read ? 400 : 600}>
                  {notif.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notif.message}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                  {formatTime(notif.createdAt)}
                </Typography>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem sx={{ justifyContent: 'center', py: 1 }}>
              <Typography variant="caption" color="primary.main">
                {t('nav.viewAll') || 'View all'}
              </Typography>
            </MenuItem>
          </>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Icon name="NotificationsOff" size={32} color="text.disabled" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('nav.noNotifications') || 'No notifications'}
            </Typography>
          </Box>
        )}
      </Menu>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderTopRightRadius: 20, borderBottomRightRadius: 20 }
          }}
        >
          {drawer}
        </Drawer>
      )}
      
      <Toolbar sx={{ minHeight: '72px !important' }} />
    </>
  )
}