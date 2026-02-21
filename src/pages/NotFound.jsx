import { Box, Button } from '@mui/material' // دکمه را اینجا اضافه کردیم
import { useNavigate } from 'react-router-dom'
import { useLanguage } from "../hooks/useLanguage"
import Icon from '../components/ui/Icon'
import Typography from '../components/ui/Typography' // تایپوگرافی را اینجا اضافه کردیم

export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <Box 
      sx={{ 
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <Box 
        sx={{ 
          p: 4,
          backgroundColor: 'rgba(54, 138, 199, 0.1)',
          borderRadius: '50%',
          mb: 3
        }}
      >
        <Icon name="ErrorOutline" size={80} color="primary" />
      </Box>
      
      <Typography variant="h1" fontWeight="700" color="primary" gutterBottom>
        404
      </Typography>
      
      <Typography variant="h5" fontWeight="600" gutterBottom>
        {t('notFound.title')}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        {t('notFound.message')}
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        startIcon="Home"
        onClick={() => navigate('/')}
        sx={{ px: 4 }}
      >
        {t('notFound.goHome')}
      </Button>
    </Box>
  )
}