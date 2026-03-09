import { useState, useMemo, useEffect } from 'react'
import { Box, Grid, Card, CardContent, Chip, IconButton, Tabs, Tab, Menu, MenuItem } from '@mui/material'
import { useLanguage } from '../hooks/useLanguage'
import { useGoalService } from '../services/goalService'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'
import { PageLoading } from '../components/ui/Loading'

// ✅ تابع فرمت تاریخ جایگزین (بدون date-fns)
const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  } catch {
    return '-'
  }
}

// ✅ تابع کمکی برای تفریق روز (بدون date-fns)
const subDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

export default function Archive() {
  const { t } = useLanguage()
  const { goals, restoreGoal, permanentDelete } = useGoalService()
  
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, completed, deleted
  const [timeFilter, setTimeFilter] = useState('all') // all, week, month, year
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // فیلتر کردن اهداف آرشیو شده
  const archivedGoals = useMemo(() => {
    let filtered = goals.filter(goal => 
      goal.status === 'completed' || goal.status === 'archived'
    )

    // فیلتر بر اساس وضعیت
    if (filter !== 'all') {
      filtered = filtered.filter(goal => goal.status === filter)
    }

    // فیلتر بر اساس زمان
    if (timeFilter !== 'all') {
      const now = new Date()
      let startDate

      switch(timeFilter) {
        case 'week':
          startDate = subDays(now, 7)
          break
        case 'month':
          startDate = subDays(now, 30)
          break
        case 'year':
          startDate = subDays(now, 365)
          break
        default:
          startDate = null
      }

      if (startDate) {
        filtered = filtered.filter(goal => {
          const goalDate = new Date(goal.completedAt || goal.updatedAt)
          return goalDate >= startDate && goalDate <= now
        })
      }
    }

    // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.completedAt || a.updatedAt)
      const dateB = new Date(b.completedAt || b.updatedAt)
      return dateB - dateA
    })
  }, [goals, filter, timeFilter])

  const handleRestore = (goal) => {
    restoreGoal(goal.id)
    setAnchorEl(null)
  }

  const handlePermanentDelete = (goalId) => {
    permanentDelete(goalId)
    setAnchorEl(null)
  }

  const handleMenuOpen = (event, goal) => {
    setAnchorEl(event.currentTarget)
    setSelectedGoal(goal)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedGoal(null)
  }

  if (loading) {
    return <PageLoading />
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* عنوان صفحه */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          {t('archive.title') || 'Archive'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('archive.subtitle') || 'View and manage your completed goals'}
        </Typography>
      </Box>

      {/* فیلترها */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Tabs value={filter} onChange={(e, v) => setFilter(v)}>
            <Tab label={t('archive.all') || 'All'} value="all" />
            <Tab label={t('archive.completed') || 'Completed'} value="completed" />
            <Tab label={t('archive.archived') || 'Archived'} value="archived" />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={timeFilter === 'week' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setTimeFilter('week')}
            >
              {t('archive.week') || 'Week'}
            </Button>
            <Button
              variant={timeFilter === 'month' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setTimeFilter('month')}
            >
              {t('archive.month') || 'Month'}
            </Button>
            <Button
              variant={timeFilter === 'year' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setTimeFilter('year')}
            >
              {t('archive.year') || 'Year'}
            </Button>
            {timeFilter !== 'all' && (
              <Button
                variant="text"
                size="small"
                onClick={() => setTimeFilter('all')}
              >
                {t('archive.clear') || 'Clear'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* لیست اهداف آرشیو شده */}
      {archivedGoals.length > 0 ? (
        <Grid container spacing={3}>
          {archivedGoals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} key={goal.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent>
                  {/* منوی سه نقطه */}
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, goal)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <Icon name="MoreVert" size={18} />
                  </IconButton>

                  {/* عنوان و دسته‌بندی */}
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {goal.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                      label={t(`categories_list.${goal.category}`) || goal.category}
                      size="small"
                      sx={{
                        backgroundColor: goal.color ? `${goal.color}20` : '#368ac720',
                        color: goal.color || '#368ac7'
                      }}
                    />
                    <Chip
                      label={goal.status === 'completed' ? 'Completed' : 'Archived'}
                      size="small"
                      color={goal.status === 'completed' ? 'success' : 'default'}
                    />
                  </Box>

                  {/* تاریخ‌ها */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="CalendarToday" size={16} color="text.secondary" />
                      <Typography variant="caption" color="text.secondary">
                        {t('archive.completedAt') || 'Completed:'} {formatDate(goal.completedAt || goal.updatedAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="Flag" size={16} color="text.secondary" />
                      <Typography variant="caption" color="text.secondary">
                        {t('archive.progress') || 'Progress:'} {goal.progress}/{goal.target}
                      </Typography>
                    </Box>
                  </Box>

                  {/* دکمه‌های سریع */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<Icon name="Restore" size={16} />}
                      onClick={() => handleRestore(goal)}
                      fullWidth
                    >
                      {t('archive.restore') || 'Restore'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Icon name="Delete" size={16} />}
                      onClick={() => handlePermanentDelete(goal.id)}
                      fullWidth
                    >
                      {t('archive.delete') || 'Delete'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // حالت خالی
        <Card sx={{ py: 8, textAlign: 'center' }}>
          <CardContent>
            <Icon name="Archive" size={64} color="text.disabled" sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('archive.empty') || 'No archived goals'}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('archive.emptyHint') || 'Completed goals will appear here'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* منوی سه نقطه */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedGoal && handleRestore(selectedGoal)}>
          <Icon name="Restore" size={16} sx={{ mr: 1 }} />
          {t('archive.restore') || 'Restore'}
        </MenuItem>
        <MenuItem onClick={() => selectedGoal && handlePermanentDelete(selectedGoal.id)}>
          <Icon name="Delete" size={16} sx={{ mr: 1 }} />
          {t('archive.permanentDelete') || 'Permanently Delete'}
        </MenuItem>
      </Menu>
    </Box>
  )
}