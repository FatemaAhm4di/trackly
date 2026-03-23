import { Box, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip, Divider, TextField, Avatar } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useThemeContext } from '../hooks/useThemeContext'
import { useGoalService } from '../services/useGoalService'
import { exportGoalsJSON, exportGoalsCSV, exportGoalsPDF } from '../utils/exportUtils'
import { useAuth } from '../hooks/useAuth'

import Button from '../components/ui/Button'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'
import { PageLoading } from '../components/ui/Loading'

export default function Settings() {

  const { t, language, changeLanguage, direction } = useLanguage()
  const { themeMode, toggleTheme } = useThemeContext()
  const { goals } = useGoalService()
  const { user, logout, updateUserProfile } = useAuth()

  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [saving, setSaving] = useState(false)

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

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setAvatar(user.avatar || '')
    }
  }, [user])

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

  const handleSaveProfile = async () => {
    setSaving(true)
    const result = await updateUserProfile({ name, avatar })
    if (result.success) {
      setEditing(false)
    }
    setSaving(false)
  }

  return (

    <Box sx={{ py: 4 }}>

      {/* عنوان صفحه */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          {t('settings.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('settings.subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={3}>

        {/* ===== ردیف 1: پروفایل کاربر (تمام عرض) ===== */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                <Avatar 
                  src={avatar} 
                  sx={{ 
                    width: 96, 
                    height: 96, 
                    bgcolor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  {!avatar && <Icon name="Person" size={48} color="white" />}
                </Avatar>
                
                <Box sx={{ flex: 1 }}>
                  {editing ? (
                    <>
                      <TextField
                        fullWidth
                        label={t('settings.fullName') || 'Full Name'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label={t('settings.avatarUrl') || 'Avatar URL'}
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        variant="outlined"
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant="h5" fontWeight="700" gutterBottom>
                        {user?.name || 'Fatema Ahmadi'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email || 'fatema.ahmadi1384@gmail.com'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                        <Chip 
                          label={t('settings.memberSince') || 'Member since 2026'} 
                          size="small" 
                          variant="outlined"
                          icon={<Icon name="CalendarToday" size={14} />}
                        />
                        <Chip 
                          label={t('settings.lastActive') || 'Active today'} 
                          size="small" 
                          variant="outlined"
                          icon={<Icon name="Schedule" size={14} />}
                        />
                      </Box>
                    </>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {editing ? (
                    <>
                      <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        disabled={saving}
                        startIcon={<Icon name="Save" size={18} />}
                      >
                        {saving ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save')}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setEditing(false)}
                        startIcon={<Icon name="Close" size={18} />}
                      >
                        {t('common.cancel') || 'Cancel'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => setEditing(true)}
                      startIcon={<Icon name="Edit" size={18} />}
                      sx={{ px: 3, py: 1 }}
                    >
                      {t('settings.editProfile') || 'Edit Profile'}
                    </Button>
                  )}
                  
                  <Button
                    variant="contained"
                    color="error"
                    onClick={logout}
                    startIcon={<Icon name="Logout" size={18} />}
                    sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
                  >
                    {t('settings.signOut') || 'Sign Out'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ===== ردیف 2: زبان + تم + ساعت + خروجی (چهار ستون) ===== */}
        
        {/* زبان */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 2 }}>
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
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fa">فارسی</MenuItem>
                  <MenuItem value="ps">پښتو</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.direction')}
                </Typography>
                <Chip 
                  label={direction === 'rtl' ? 'RTL' : 'LTR'} 
                  size="small"
                  color={direction === 'rtl' ? 'primary' : 'default'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* تم */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: 'secondary.light', borderRadius: 2 }}>
                  <Icon name="Palette" size={24} color="secondary" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {t('settings.theme')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={themeMode === 'light' ? 'contained' : 'outlined'}
                  onClick={toggleTheme}
                  fullWidth
                  startIcon={<Icon name="LightMode" size={20} />}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  {t('settings.light')}
                </Button>
                <Button
                  variant={themeMode === 'dark' ? 'contained' : 'outlined'}
                  onClick={toggleTheme}
                  fullWidth
                  startIcon={<Icon name="DarkMode" size={20} />}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  {t('settings.dark')}
                </Button>
              </Box>

              <Box sx={{ mt: 2, pt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('settings.currentMode')}: {themeMode === 'light' ? '☀️ Light' : '🌙 Dark'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ساعت */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 2 }}>
                  <Icon name="Schedule" size={24} color="primary" />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {t('settings.localTime')}
                </Typography>
              </Box>
              <Typography variant="h2" fontWeight="700" color="primary" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                {hours}:{minutes}:{seconds}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
                {translatedDayName}, {translatedMonthName} {date}, {year}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* خروجی */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }
          }}>
            <CardContent sx={{ p: 3 }}>
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

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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

        {/* ===== ردیف 3: درباره برنامه ===== */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
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

              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
                {t('settings.fullDescription')}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
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

                <Grid item xs={12} sm={6} md={3}>
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

                <Grid item xs={12} sm={6} md={3}>
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

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" fontWeight="700" gutterBottom sx={{ color: 'secondary.main' }}>
                    {t('settings.techStack') || 'Tech Stack'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip icon={<Icon name="Code" size={16} />} label="React 18 + Vite" variant="outlined" size="small" />
                    <Chip icon={<Icon name="Palette" size={16} />} label="Material UI v5" variant="outlined" size="small" />
                    <Chip icon={<Icon name="BarChart" size={16} />} label="Recharts" variant="outlined" size="small" />
                    <Chip icon={<Icon name="Security" size={16} />} label="Firebase Auth" variant="outlined" size="small" />
                    <Chip icon={<Icon name="Storage" size={16} />} label="LocalStorage" variant="outlined" size="small" />
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