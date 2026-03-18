import { Box, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip, Divider } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useThemeContext } from '../hooks/useThemeContext'
import { useGoalService } from '../services/useGoalService'
import { exportGoalsJSON, exportGoalsCSV, exportGoalsPDF } from '../utils/exportUtils'

import Button from '../components/ui/Button'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'
import { PageLoading } from '../components/ui/Loading'

export default function Settings() {

  const { t, language, changeLanguage, direction } = useLanguage()
  const { themeMode, toggleTheme } = useThemeContext()
  const { goals } = useGoalService()

  const [loading, setLoading] = useState(true)
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

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const dayName = days[time.getDay()]
  const monthName = months[time.getMonth()]
  const date = time.getDate()
  const year = time.getFullYear()

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')

  // ترجمه نام روزها و ماه‌ها
  const getTranslatedDay = (day) => {
    const dayMap = {
      'Sunday': t('days.sunday'),
      'Monday': t('days.monday'),
      'Tuesday': t('days.tuesday'),
      'Wednesday': t('days.wednesday'),
      'Thursday': t('days.thursday'),
      'Friday': t('days.friday'),
      'Saturday': t('days.saturday')
    }
    return dayMap[day] || day
  }

  const getTranslatedMonth = (month) => {
    const monthMap = {
      'January': t('months.january'),
      'February': t('months.february'),
      'March': t('months.march'),
      'April': t('months.april'),
      'May': t('months.may'),
      'June': t('months.june'),
      'July': t('months.july'),
      'August': t('months.august'),
      'September': t('months.september'),
      'October': t('months.october'),
      'November': t('months.november'),
      'December': t('months.december')
    }
    return monthMap[month] || month
  }

  const translatedDayName = getTranslatedDay(dayName)
  const translatedMonthName = getTranslatedMonth(monthName)

  return (

    <Box sx={{ py: 4 }}>

      {/* title */}

      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          {t('settings.title')}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {t('settings.subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={3}>

        {/* language */}

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>

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
                  <MenuItem value="en">{t('languages.english')}</MenuItem>
                  <MenuItem value="fa">{t('languages.persian')}</MenuItem>
                  <MenuItem value="ps">{t('languages.pashto')}</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.direction')}
                </Typography>

                <Chip label={direction === 'rtl' ? 'RTL' : 'LTR'} size="small" />
              </Box>

            </CardContent>
          </Card>
        </Grid>

        {/* theme */}

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>

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
                  onClick={toggleTheme}
                  fullWidth
                  startIcon={<Icon name="LightMode" size={20} />}
                >
                  {t('settings.light')}
                </Button>

                <Button
                  variant={themeMode === 'dark' ? 'contained' : 'outlined'}
                  onClick={toggleTheme}
                  fullWidth
                  startIcon={<Icon name="DarkMode" size={20} />}
                >
                  {t('settings.dark')}
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>

        {/* clock */}

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 2 }}>
                  <Icon name="Schedule" size={24} color="primary" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {t('settings.localTime')}
                </Typography>
              </Box>
              <Typography variant="h2" fontWeight="700" color="primary">
                {hours}:{minutes}:{seconds}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {translatedDayName}, {translatedMonthName} {date}, {year}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* export goals */}

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: 'success.light', borderRadius: 2 }}>
                  <Icon name="Download" size={24} color="success" />
                </Box>

                <Typography variant="h6" fontWeight="600">
                  {t('settings.exportGoals')}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('settings.exportDescription')}
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => exportGoalsJSON(goals)}
                  sx={{ flex: 1 }}
                >
                  JSON
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => exportGoalsCSV(goals)}
                  sx={{ flex: 1 }}
                >
                  CSV
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => exportGoalsPDF(goals)}
                  sx={{ flex: 1 }}
                >
                  PDF
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>

        {/* about section - با ترجمه کامل */}

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

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" fontWeight="700" gutterBottom sx={{ color: 'primary.main' }}>
                    {t('settings.application')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('settings.version')}:</strong> 2.0.0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('settings.lastUpdate')}:</strong> {t('settings.march2026')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('settings.developer')}:</strong> {t('settings.team')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('settings.license')}:</strong> MIT
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" fontWeight="700" gutterBottom sx={{ color: 'success.main' }}>
                    {t('settings.languages')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>English:</strong> {t('settings.englishSupport')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>فارسی:</strong> {t('settings.persianSupport')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>پښتو:</strong> {t('settings.pashtoSupport')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>RTL/LTR:</strong> {t('settings.rtlSupport')}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" fontWeight="700" gutterBottom sx={{ color: 'warning.main' }}>
                    {t('settings.features')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ✓ {t('settings.feature1')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ✓ {t('settings.feature2')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ✓ {t('settings.feature3')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ✓ {t('settings.feature4')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ✓ {t('settings.feature5')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ✓ {t('settings.feature6')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ✓ {t('settings.feature7')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ✓ {t('settings.feature8')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<Icon name="Code" size={16} />}
                      label="React 18 + Vite" 
                      variant="outlined" 
                      size="small" 
                    />
                    <Chip 
                      icon={<Icon name="Palette" size={16} />}
                      label="Material UI v5" 
                      variant="outlined" 
                      size="small" 
                    />
                    <Chip 
                      icon={<Icon name="BarChart" size={16} />}
                      label="Recharts" 
                      variant="outlined" 
                      size="small" 
                    />
                    <Chip 
                      icon={<Icon name="Security" size={16} />}
                      label="Firebase Auth" 
                      variant="outlined" 
                      size="small" 
                    />
                    <Chip 
                      icon={<Icon name="Storage" size={16} />}
                      label="LocalStorage" 
                      variant="outlined" 
                      size="small" 
                    />
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