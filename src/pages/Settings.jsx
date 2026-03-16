import { Box, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip, Divider } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useThemeContext } from '../hooks/useThemeContext'
import { useGoalService } from '../services/useGoalService'
import { exportGoalsJSON, exportGoalsCSV } from '../utils/exportUtils'

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

  return (

    <Box sx={{ py: 4 }}>

      {/* title */}

      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          {t('settings.title')}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {t('settings.subtitle') || 'Customize your app experience'}
        </Typography>
      </Box>

      <Grid container spacing={3}>

        {/* language */}

        <Grid item xs={12} md={6}>
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
                  <MenuItem value="en">🇬🇧 English</MenuItem>
                  <MenuItem value="fa">🇮🇷 فارسی</MenuItem>
                  <MenuItem value="ps">🇦🇫 پښتو</MenuItem>
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

        <Grid item xs={12} md={6}>
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
                >
                  <Icon name="LightMode" size={20} />
                  {t('settings.light')}
                </Button>

                <Button
                  variant={themeMode === 'dark' ? 'contained' : 'outlined'}
                  onClick={toggleTheme}
                  fullWidth
                >
                  <Icon name="DarkMode" size={20} />
                  {t('settings.dark')}
                </Button>

              </Box>

            </CardContent>
          </Card>
        </Grid>

        {/* export goals */}

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: 'success.light', borderRadius: 2 }}>
                  <Icon name="Download" size={24} color="success" />
                </Box>

                <Typography variant="h6" fontWeight="600">
                  Export Goals
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Download your goals data
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => exportGoalsJSON(goals)}
                >
                  JSON
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => exportGoalsCSV(goals)}
                >
                  CSV
                </Button>

              </Box>

            </CardContent>
          </Card>
        </Grid>

        {/* clock */}

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

      </Grid>

    </Box>
  )
}