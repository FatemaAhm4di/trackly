import { Box, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material'
import { useLanguage } from '../hooks/useLanguage'
import { useThemeContext } from '../hooks/useThemeContext'
import Button from '../components/ui/Button'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'

export default function Settings() {
  const { t, language, changeLanguage, direction } = useLanguage() // toggleDirection حذف شد
  const { themeMode, toggleTheme } = useThemeContext()

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          {t('settings.title')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, backgroundColor: 'primary.light', borderRadius: 2 }}>
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
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fa">فارسی (Persian)</MenuItem>
                  <MenuItem value="ps">پښتو (Pashto)</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.direction')}:
                </Typography>
                <Chip 
                  label={direction.toUpperCase()} 
                  color={direction === 'rtl' ? 'primary' : 'default'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, backgroundColor: 'secondary.light', borderRadius: 2 }}>
                  <Icon name="Palette" size={24} color="secondary" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {t('settings.theme')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={themeMode === 'light' ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon="LightMode"
                  onClick={() => themeMode !== 'light' && toggleTheme()}
                  fullWidth
                >
                  {t('settings.light')}
                </Button>
                <Button
                  variant={themeMode === 'dark' ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon="DarkMode"
                  onClick={() => themeMode !== 'dark' && toggleTheme()}
                  fullWidth
                >
                  {t('settings.dark')}
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Current: {themeMode === 'light' ? 'Light' : 'Dark'} Mode
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, backgroundColor: 'success.light', borderRadius: 2 }}>
                  <Icon name="Info" size={24} color="success" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  About Trackly
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" paragraph>
                Trackly is a goal tracking application built with React, Vite, and Material UI.
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>Version:</strong> 1.0.0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Languages:</strong> English, Persian, Pashto
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Features:</strong> Goal Management, Progress Tracking, Streak System, XP/Gamification
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}