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
  
  // ساعت
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLoading />
  }

  // فرمت تاریخ
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const dayName = days[time.getDay()]
  const monthName = months[time.getMonth()]
  const date = time.getDate()
  const year = time.getFullYear()
  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')

  return (
    <Box sx={{ py: 4 }}>
      {/* عنوان صفحه */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          {t('settings.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('settings.subtitle') || 'Customize your app experience'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* تنظیمات زبان */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 2 }}>
                  <Icon name="Language" size={24} color="primary" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {t('settings.language')}
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('settings.selectLanguage')}</InputLabel>
                <Select
                  value={language}
                  label={t('settings.selectLanguage')}
                  onChange={(e) => changeLanguage(e.target.value)}
                >
                  <MenuItem value="en">🇬🇧 English</MenuItem>
                  <MenuItem value="fa">🇮🇷 فارسی</MenuItem>
                  <MenuItem value="ps">🇦🇫 پښتو</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.direction')}:
                </Typography>
                <Chip label={direction === 'rtl' ? 'RTL' : 'LTR'} size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* تنظیمات تم */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: 'secondary.light', borderRadius: 2 }}>
                  <Icon name="Palette" size={24} color="secondary" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {t('settings.theme')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant={themeMode === 'light' ? 'contained' : 'outlined'}
                  onClick={() => toggleTheme()}
                  fullWidth
                  sx={{ 
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                  }}
                >
                  <Icon name="LightMode" size={20} />
                  {t('settings.light')}
                </Button>
                <Button
                  variant={themeMode === 'dark' ? 'contained' : 'outlined'}
                  onClick={() => toggleTheme()}
                  fullWidth
                  sx={{ 
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                  }}
                >
                  <Icon name="DarkMode" size={20} />
                  {t('settings.dark')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* کارت ساعت - انتقال به پایین */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h2" fontWeight="700" color="primary">
                    {hours}:{minutes}:{seconds}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {dayName}, {monthName} {date}, {year}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 3 }}>
                  <Icon name="Schedule" size={48} color="primary" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* درباره برنامه */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: 'info.light', borderRadius: 2 }}>
                  <Icon name="Info" size={24} color="info" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {t('settings.aboutTitle')}
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" paragraph>
                {t('settings.description')}
              </Typography>

              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                {t('settings.fullDescription')}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="FiberManualRecord" size={8} color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('settings.version')}:</strong> 2.0.0
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="FiberManualRecord" size={8} color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('settings.lastUpdate')}:</strong> {t('settings.march2026')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="FiberManualRecord" size={8} color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('settings.developer')}:</strong> {t('settings.team')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="FiberManualRecord" size={8} color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('settings.languages')}:</strong> English, فارسی, پښتو
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="FiberManualRecord" size={8} color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('settings.features')}:</strong> {t('settings.featureList')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ 
                    mt: 2, 
                    pt: 2, 
                    borderTop: 1, 
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}>
                    <Icon name="Star" size={16} color="warning" />
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('settings.additionalFeatures')}:</strong> {t('settings.additionalList')}
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