import { Box, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip, Divider } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useThemeContext } from '../hooks/useThemeContext'
import Button from '../components/ui/Button'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'
import { PageLoading } from '../components/ui/Loading'

export default function Settings() {
  const { t, language, changeLanguage, direction } = useLanguage()
  const { themeMode, toggleTheme } = useThemeContext()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLoading />
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* عنوان صفحه */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h3"
          fontWeight="800"
          gutterBottom
          sx={{ letterSpacing: "-1px" }}
        >
          {t('settings.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('settings.subtitle') || 'Customize your app experience'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* تنظیمات زبان */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, backgroundColor: 'primary.light', borderRadius: 2 }}>
                  <Icon name="Language" size={24} color="primary" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {t('settings.language')}
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>{t('settings.selectLanguage')}</InputLabel>
                <Select
                  value={language}
                  label={t('settings.selectLanguage')}
                  onChange={(e) => changeLanguage(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="en">🇬🇧 English</MenuItem>
                  <MenuItem value="fa">🇮🇷 فارسی (Persian)</MenuItem>
                  <MenuItem value="ps">🇦🇫 پښتو (Pashto)</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.direction')}:
                </Typography>
                <Chip 
                  label={direction === 'rtl' ? 'RTL' : 'LTR'} 
                  color={direction === 'rtl' ? 'primary' : 'default'}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* تنظیمات تم */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, backgroundColor: 'secondary.light', borderRadius: 2 }}>
                  <Icon name="Palette" size={24} color="secondary" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {t('settings.theme')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant={themeMode === 'light' ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon={<Icon name="LightMode" size={20} />}
                  onClick={() => themeMode !== 'light' && toggleTheme()}
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  {t('settings.light')}
                </Button>
                <Button
                  variant={themeMode === 'dark' ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon={<Icon name="DarkMode" size={20} />}
                  onClick={() => themeMode !== 'dark' && toggleTheme()}
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  {t('settings.dark')}
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.currentMode')}:
                </Typography>
                <Chip 
                  label={themeMode === 'light' ? '☀️ Light' : '🌙 Dark'} 
                  color={themeMode === 'light' ? 'warning' : 'info'}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* درباره برنامه */}
        <Grid item xs={12}>
          <Card
            sx={{
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, backgroundColor: 'success.light', borderRadius: 2 }}>
                  <Icon name="Info" size={24} color="success" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {t('settings.aboutTitle')}
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" paragraph>
                {t('settings.description')}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Icon name="FiberManualRecord" size={8} color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('settings.version')}:</strong> 1.0.0
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Icon name="FiberManualRecord" size={8} color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('settings.languages')}:</strong> English, فارسی, پښتو
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Icon name="FiberManualRecord" size={8} color="primary" sx={{ mt: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('settings.features')}:</strong> {t('settings.featureList')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}