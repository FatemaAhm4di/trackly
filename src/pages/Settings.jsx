import { Box, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip, Divider, TextField, Avatar, Alert } from '@mui/material'
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
  const { goals, createGoal, deleteGoal } = useGoalService()
  const { user, logout, updateUserProfile } = useAuth()

  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [saving, setSaving] = useState(false)
  
  const [backupLoading, setBackupLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })

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

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
  }

  // ===============================
  // ✅ BACKUP (LocalStorage)
  // ===============================
  const handleBackup = async () => {
    if (!user) {
      showNotification(t('settings.loginRequired') || 'Please login to backup', 'error')
      return
    }
    
    setBackupLoading(true)
    try {
      const backupData = {
        goals: goals,
        timestamp: new Date().toISOString(),
        userId: user.id,
        version: '1.0'
      }
      localStorage.setItem(`trackly_backup_${user.id}`, JSON.stringify(backupData))
      
      showNotification(t('settings.backupSuccess') || 'Goals backed up successfully!')
    } catch (error) {
      console.error('Backup error:', error)
      showNotification(error.message, 'error')
    } finally {
      setBackupLoading(false)
    }
  }

  // ===============================
  // ✅ RESTORE (LocalStorage)
  // ===============================
  const handleRestore = async () => {
    if (!user) {
      showNotification(t('settings.loginRequired') || 'Please login to restore', 'error')
      return
    }
    
    setRestoreLoading(true)
    try {
      const savedBackup = localStorage.getItem(`trackly_backup_${user.id}`)
      
      if (!savedBackup) {
        showNotification(t('settings.noBackup') || 'No backup found', 'error')
        return
      }
      
      const backupData = JSON.parse(savedBackup)
      
      if (backupData.goals && backupData.goals.length > 0) {
        
        if (goals && goals.length > 0 && deleteGoal) {
          for (const goal of goals) {
            try {
              deleteGoal(goal.id)
            } catch (err) {
              console.error('Error deleting goal:', err)
            }
          }
        }
        
        if (createGoal) {
          for (const goal of backupData.goals) {
            try {
              createGoal(goal)
            } catch (err) {
              console.error('Error creating goal:', err)
            }
          }
        }
        
        showNotification(t('settings.restoreSuccess') || `Restored ${backupData.goals.length} goals from backup!`)
      } else {
        showNotification(t('settings.noBackup') || 'No backup found', 'error')
      }
    } catch (error) {
      console.error('Restore error:', error)
      showNotification(error.message, 'error')
    } finally {
      setRestoreLoading(false)
    }
  }

  return (

    <Box sx={{ py: 4 }}>

      {notification.show && (
        <Alert 
          severity={notification.type} 
          sx={{ 
            position: 'fixed', 
            top: 20, 
            right: 20, 
            zIndex: 9999,
            minWidth: 300,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {notification.message}
        </Alert>
      )}

      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          {t('settings.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('settings.subtitle')}
        </Typography>
      </Box>

      {/* ===== ردیف 1: پروفایل کاربر ===== */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Avatar 
              src={avatar} 
              sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
            >
              {!avatar && <Icon name="Person" size={40} color="white" />}
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
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label={t('settings.avatarUrl') || 'Avatar URL'}
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    size="small"
                  />
                </>
              ) : (
                <>
                  <Typography variant="h6" fontWeight="700">
                    {user?.name || t('settings.noName') || 'No Name'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email || t('settings.noEmail') || 'No Email'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={t('settings.memberSince') || 'Member 2026'} size="small" variant="outlined" />
                    <Chip label={t('settings.lastActive') || 'Active today'} size="small" variant="outlined" />
                  </Box>
                </>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {editing ? (
                <>
                  <Button size="small" variant="contained" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save')}
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => setEditing(false)}>
                    {t('common.cancel') || 'Cancel'}
                  </Button>
                </>
              ) : (
                <Button size="small" variant="outlined" onClick={() => setEditing(true)} startIcon={<Icon name="Edit" size={16} />}>
                  {t('settings.editProfile') || 'Edit'}
                </Button>
              )}
              <Button size="small" variant="contained" color="error" onClick={logout} startIcon={<Icon name="Logout" size={16} />}>
                {t('settings.signOut') || 'Sign Out'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ===== ردیف 2: زبان + تم + ساعت ===== */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Icon name="Language" size={20} color="primary" />
                <Typography variant="subtitle1" fontWeight="600">{t('settings.language')}</Typography>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>{t('settings.selectLanguage')}</InputLabel>
                <Select value={language} label={t('settings.selectLanguage')} onChange={(e) => changeLanguage(e.target.value)}>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fa">فارسی</MenuItem>
                  <MenuItem value="ps">پښتو</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">{t('settings.direction')}</Typography>
                <Chip label={direction === 'rtl' ? 'RTL' : 'LTR'} size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Icon name="Palette" size={20} color="secondary" />
                <Typography variant="subtitle1" fontWeight="600">{t('settings.theme')}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={themeMode === 'light' ? 'contained' : 'outlined'}
                  onClick={toggleTheme}
                  fullWidth
                  startIcon={<Icon name="LightMode" size={16} />}
                  size="small"
                >
                  {t('settings.light')}
                </Button>
                <Button
                  variant={themeMode === 'dark' ? 'contained' : 'outlined'}
                  onClick={toggleTheme}
                  fullWidth
                  startIcon={<Icon name="DarkMode" size={16} />}
                  size="small"
                >
                  {t('settings.dark')}
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
  {t('settings.currentMode')}:
  <Icon name={themeMode === 'light' ? 'LightMode' : 'DarkMode'} size={14} color={themeMode === 'light' ? 'warning' : 'info'} />
  {themeMode === 'light' ? t('settings.light') : t('settings.dark')}
</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Icon name="Schedule" size={20} color="primary" />
                <Typography variant="subtitle1" fontWeight="600">{t('settings.localTime')}</Typography>
              </Box>
              <Typography variant="h3" fontWeight="700" color="primary">
                {hours}:{minutes}:{seconds}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {translatedDayName}, {translatedMonthName} {date}, {year}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== ردیف 3: Cloud Backup + Export Goals ===== */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Icon name="CloudUpload" size={20} color="primary" />
                <Typography variant="subtitle1" fontWeight="600">{t('settings.cloudBackup') || 'Cloud Backup'}</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('settings.backupDescription') || 'Backup your goals to cloud or restore from backup'}
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleBackup}
                  disabled={backupLoading}
                  startIcon={<Icon name="Backup" size={16} />}
                  fullWidth
                  size="small"
                >
                  {backupLoading ? (t('common.backingUp') || 'Backing up...') : (t('settings.backup') || 'Backup')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRestore}
                  disabled={restoreLoading}
                  startIcon={<Icon name="Restore" size={16} />}
                  fullWidth
                  size="small"
                >
                  {restoreLoading ? (t('common.restoring') || 'Restoring...') : (t('settings.restore') || 'Restore')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Icon name="Download" size={20} color="success" />
                <Typography variant="subtitle1" fontWeight="600">{t('settings.exportGoals')}</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('settings.exportDescription')}
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="contained" onClick={() => exportGoalsJSON(goals)} size="small" sx={{ flex: 1 }}>JSON</Button>
                <Button variant="outlined" onClick={() => exportGoalsCSV(goals)} size="small" sx={{ flex: 1 }}>CSV</Button>
                <Button variant="outlined" onClick={() => exportGoalsPDF(goals)} size="small" sx={{ flex: 1 }}>PDF</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== ردیف 4: درباره برنامه (کامل) ===== */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Icon name="Info" size={24} color="info" />
            <Typography variant="h6" fontWeight="600">{t('settings.aboutTitle')}</Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" paragraph>
            {t('settings.description')}
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
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
                <Chip icon={<Icon name="Storage" size={16} />} label="LocalStorage" variant="outlined" size="small" />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

    </Box>
  )
}