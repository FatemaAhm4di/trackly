// src/components/layout/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, useMediaQuery } from '@mui/material';
import { Home, ViewList, Category, Settings, TrendingUp } from '@mui/icons-material';

export default function Navbar() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home /> },
    { path: '/goals', label: 'Goals', icon: <ViewList /> },
    { path: '/categories', label: 'Categories', icon: <Category /> },
    { path: '/settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid #eee' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* لوگو — بدون hover effect */}
        <Box 
          onClick={() => navigate('/')} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? 0.75 : 1,
            color: '#054532', 
            fontWeight: 'bold', 
            fontSize: isMobile ? '1.2rem' : '1.4rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <TrendingUp sx={{ fontSize: isMobile ? '1.4rem' : '1.8rem', color: '#054532' }} />
          Trackly {/* همیشه نمایش داده می‌شه — حتی در موبایل */}
        </Box>

        {/* منو — فقط آیکون در موبایل */}
        <Box sx={{ display: 'flex', gap: isMobile ? 1.5 : 2.5 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                textTransform: 'none',
                color: 'text.primary',
                minWidth: isMobile ? 'auto' : 'unset',
                px: isMobile ? 0.75 : 1.5,
                '&:hover': {
                  color: '#054532',
                  bgcolor: 'rgba(5, 69, 50, 0.05)',
                },
                '& .MuiButton-startIcon': {
                  margin: 0,
                }
              }}
            >
              {!isMobile && item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}