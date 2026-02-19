// src/components/layout/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { TrendingUp as LogoIcon } from '@mui/icons-material';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid #eee' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          onClick={() => navigate('/')} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: '#054532', 
            fontWeight: 'bold', 
            fontSize: '1.4rem',
            textTransform: 'none'
          }}
        >
          <LogoIcon sx={{ fontSize: '1.8rem', color: '#054532' }} />
          Trackly
        </Button>

        <Box>
          <Button onClick={() => navigate('/')}>Dashboard</Button>
          <Button onClick={() => navigate('/goals')}>Goals</Button>
          <Button onClick={() => navigate('/categories')}>Categories</Button>
          <Button onClick={() => navigate('/settings')}>Settings</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}