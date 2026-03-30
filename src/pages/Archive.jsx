import { useState, useMemo, useEffect } from 'react'
import { Box, Grid, Card, CardContent, Chip, IconButton, Tabs, Tab, Menu, MenuItem, useMediaQuery, useTheme, alpha } from '@mui/material'
import { useLanguage } from '../hooks/useLanguage'
import { useGoalService } from '../services/goalService'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'
import { PageLoading } from '../components/ui/Loading'

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
  } catch {
    return '-'
  }
}

const subDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

export default function Archive() {
  const { t } = useLanguage()
  const { goals, restoreGoal, permanentDelete } = useGoalService()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const archivedGoals = useMemo(() => {
    let filtered = goals.filter(goal => goal.status === 'completed' || goal.status === 'archived')
    
    if (filter !== 'all') {
      filtered = filtered.filter(goal => goal.status === filter)
    }
    
    if (timeFilter !== 'all') {
      const now = new Date()
      let startDate
      switch(timeFilter) {
        case 'week': startDate = subDays(now, 7); break
        case 'month': startDate = subDays(now, 30); break
        case 'year': startDate = subDays(now, 365); break
        default: startDate = null
      }
      if (startDate) {
        filtered = filtered.filter(goal => {
          const goalDate = new Date(goal.completedAt || goal.updatedAt)
          return goalDate >= startDate && goalDate <= now
        })
      }
    }
    
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

  const handleMenuClose = () => setAnchorEl(null)

  if (loading) return <PageLoading />

  return (
    <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* عنوان */}
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 }, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' } }}>
          {t('archive.title') || 'Archive'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('archive.subtitle') || 'View and manage your completed goals'}
        </Typography>
      </Box>

      {/* فیلترها */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>
          <Tabs 
            value={filter} 
            onChange={(e, v) => setFilter(v)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.9rem' } } }}
          >
            <Tab label={t('archive.all') || 'All'} value="all" />
            <Tab label={t('archive.completed') || 'Completed'} value="completed" />
            <Tab label={t('archive.archived') || 'Archived'} value="archived" />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            {['week', 'month', 'year'].map((period) => (
              <Button
                key={period}
                variant={timeFilter === period ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setTimeFilter(period)}
              >
                {t(`archive.${period}`) || period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
            {timeFilter !== 'all' && (
              <Button variant="text" size="small" onClick={() => setTimeFilter('all')}>
                {t('archive.clear') || 'Clear'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* لیست اهداف */}
      {archivedGoals.length > 0 ? (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {archivedGoals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={goal.id}>
              <Card sx={{ height: '100%', position: 'relative', borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.12)' } }}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, goal)} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Icon name="MoreVert" size={18} />
                  </IconButton>

                  <Typography variant="h6" fontWeight="600" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, pr: 4 }}>
                    {goal.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip label={t(`categories_list.${goal.category}`) || goal.category} size="small" sx={{ bgcolor: goal.color ? `${goal.color}20` : '#368ac720', color: goal.color || '#368ac7' }} />
                    <Chip label={goal.status === 'completed' ? 'Completed' : 'Archived'} size="small" color={goal.status === 'completed' ? 'success' : 'default'} />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="CalendarToday" size={14} color="text.secondary" />
                      <Typography variant="caption" color="text.secondary">{t('archive.completedAt') || 'Completed:'} {formatDate(goal.completedAt || goal.updatedAt)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="Flag" size={14} color="text.secondary" />
                      <Typography variant="caption" color="text.secondary">{t('archive.progress') || 'Progress:'} {goal.progress}/{goal.target}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button variant="outlined" color="primary" size="small" startIcon={<Icon name="Restore" size={14} />} onClick={() => handleRestore(goal)} fullWidth>
                      {t('archive.restore') || 'Restore'}
                    </Button>
                    <Button variant="outlined" color="error" size="small" startIcon={<Icon name="Delete" size={14} />} onClick={() => handlePermanentDelete(goal.id)} fullWidth>
                      {t('archive.delete') || 'Delete'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ py: { xs: 6, sm: 8 }, textAlign: 'center', borderRadius: 2 }}>
          <CardContent>
            <Icon name="Archive" size={48} color="disabled" sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>{t('archive.empty') || 'No archived goals'}</Typography>
            <Typography variant="body2" color="text.disabled">{t('archive.emptyHint') || 'Completed goals will appear here'}</Typography>
          </CardContent>
        </Card>
      )}

      {/* منو */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => selectedGoal && handleRestore(selectedGoal)}>
          <Icon name="Restore" size={16} sx={{ mr: 1 }} /> {t('archive.restore') || 'Restore'}
        </MenuItem>
        <MenuItem onClick={() => selectedGoal && handlePermanentDelete(selectedGoal.id)}>
          <Icon name="Delete" size={16} sx={{ mr: 1 }} color="error" /> {t('archive.permanentDelete') || 'Permanently Delete'}
        </MenuItem>
      </Menu>
    </Box>
  )
}