import { useState, useEffect } from 'react'
import { Box, Grid, Card, CardContent, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage' 
import { useGoalService } from '../services/goalService'
import Icon from '../components/ui/Icon'
import Typography from '../components/ui/Typography'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import Dialog from '../components/ui/Dialog'
import { PageLoading } from '../components/ui/Loading'  // ✅ ایمپورت لودینگ

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const { 
    userStats,
    addProgress,
    deleteGoal,
    getOverallProgress,
    getGoalsByStatus
  } = useGoalService()
  
  const [loading, setLoading] = useState(true)  // ✅ state لودینگ
  const [deleteDialog, setDeleteDialog] = useState({ open: false, goalId: null })
  const [errorMessage, setErrorMessage] = useState('')
  const [showError, setShowError] = useState(false)

  // ✅ useEffect برای لودینگ
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // Safe getters with error handling
  let activeGoals = []
  let completedGoals = []
  let overallProgress = 0
  
  try {
    activeGoals = getGoalsByStatus('active') || []
    completedGoals = getGoalsByStatus('completed') || []
    overallProgress = getOverallProgress() || 0
  } catch (error) {
    console.error('Error fetching goals:', error)
  }

  // ✅ استفاده مستقیم از userStats.streak
  let streak = 0
  try {
    streak = userStats?.streak || 0
  } catch (error) {
    console.error('Error calculating streak:', error)
    streak = userStats?.streak || 0
  }

  // ✅ نمایش لودینگ
  if (loading) {
    return <PageLoading />
  }

  const handleProgress = (goalId) => {
    if (!goalId) return
    const result = addProgress(goalId)
    
    if (result && !result.success) {
      const errorMessage = result.message.startsWith('errors.') 
        ? t(result.message)
        : result.message
      
      setErrorMessage(errorMessage)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    }
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.goalId) {
      try {
        deleteGoal(deleteDialog.goalId)
      } catch (error) {
        console.error('Error deleting goal:', error)
      }
      setDeleteDialog({ open: false, goalId: null })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, goalId: null })
  }

  const handleGoalClick = (goalId) => {
    if (!goalId) return
    navigate(`/goals/${goalId}`)
  }

  // Safe userStats with defaults
  const safeUserStats = {
    completedCount: userStats?.completedCount || 0,
    xpTotal: userStats?.xpTotal || 0,
    streak: userStats?.streak || 0
  }

  const statCards = [
    {
      title: t('dashboard.overallProgress') || 'Overall Progress',
      value: `${Math.round(overallProgress)}%`,
      icon: 'TrendingUp',
      color: 'primary',
      bgColor: 'rgba(54, 138, 199, 0.1)'
    },
    {
      title: t('dashboard.completedGoals') || 'Completed Goals',
      value: safeUserStats.completedCount,
      icon: 'CheckCircle',
      color: 'success',
      bgColor: 'rgba(76, 175, 80, 0.1)'
    },
    {
      title: t('dashboard.streak') || 'Streak',
      value: `${streak} ${t('common.days') || 'days'}`,
      icon: 'LocalFireDepartment',
      color: 'warning',
      bgColor: 'rgba(255, 152, 0, 0.1)'
    },
    {
      title: t('dashboard.xpPoints') || 'XP Points',
      value: safeUserStats.xpTotal,
      icon: 'EmojiEvents',
      color: 'secondary',
      bgColor: 'rgba(14, 84, 136, 0.1)'
    }
  ]

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {showError && (
        <Box sx={{ 
          position: 'fixed', 
          top: 20, 
          right: 20, 
          left: 20, 
          zIndex: 9999,
          backgroundColor: 'error.main',
          color: 'white',
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center'
        }}>
          <Typography>{errorMessage}</Typography>
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          {t('dashboard.welcome') || 'Welcome'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.title') || 'Track your goals and progress'}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      backgroundColor: stat.bgColor
                    }}
                  >
                    <Icon name={stat.icon} size={32} color={stat.color} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="700" color={stat.color}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="600">
            {t('dashboard.quickActions') || 'Quick Actions'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon name="Add" size={20} />}
            onClick={() => navigate('/goals/new')}
            sx={{ px: 3 }}
          >
            {t('dashboard.newGoal') || 'New Goal'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Icon name="Flag" size={20} />}
            onClick={() => navigate('/goals')}
            sx={{ px: 3 }}
          >
            {t('dashboard.viewAllGoals') || 'View All Goals'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="600">
            {t('dashboard.activeGoals') || 'Active Goals'}
          </Typography>
          <IconButton onClick={() => navigate('/goals')} size="small">
            <Icon name="ArrowForward" size={20} />
          </IconButton>
        </Box>
        
        {activeGoals.length > 0 ? (
          <Grid container spacing={3}>
            {activeGoals.slice(0, 3).map((goal) => (
              <Grid item xs={12} md={4} key={goal.id}>
                <Card 
                  sx={{
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onClick={() => handleGoalClick(goal.id)}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom noWrap>
                      {goal.title || 'Untitled Goal'}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          backgroundColor: 'primary.light',
                          color: 'white',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          display: 'inline-block'
                        }}
                      >
                        {goal.category || 'other'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <ProgressBar 
                        value={goal.target ? (goal.progress / goal.target) * 100 : 0} 
                        color="primary"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {goal.progress || 0} / {goal.target || 0}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProgress(goal.id)
                        }}
                        sx={{ 
                          backgroundColor: 'success.light',
                          color: 'white',
                          '&:hover': { backgroundColor: 'success.dark' }
                        }}
                      >
                        <Icon name="Add" size={18} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Icon name="Inbox" size={64} color="text.disabled" sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t('dashboard.noActiveGoals') || 'No active goals'}
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
                {t('dashboard.createFirstGoal') || 'Create your first goal to get started'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Icon name="Add" size={20} />}
                onClick={() => navigate('/goals/new')}
              >
                {t('dashboard.newGoal') || 'New Goal'}
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="600">
            {t('dashboard.completedGoalsPreview') || 'Recently Completed'}
          </Typography>
          <IconButton onClick={() => navigate('/goals?filter=completed')} size="small">
            <Icon name="ArrowForward" size={20} />
          </IconButton>
        </Box>
        
        {completedGoals.length > 0 ? (
          <Grid container spacing={3}>
            {completedGoals.slice(0, 3).map((goal) => (
              <Grid item xs={12} md={4} key={goal.id}>
                <Card 
                  sx={{
                    borderLeft: '4px solid',
                    borderLeftColor: 'success.main',
                    opacity: 0.8,
                    '&:hover': {
                      opacity: 1,
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onClick={() => handleGoalClick(goal.id)}
                >
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      fontWeight="600" 
                      gutterBottom
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                      noWrap
                    >
                      {goal.title || 'Untitled Goal'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="CheckCircle" size={20} color="success" />
                      <Typography variant="body2" color="success.main">
                        {t('dashboard.complete') || 'Completed'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Icon name="Celebration" size={64} color="text.disabled" sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {t('dashboard.noCompletedGoals') || 'No completed goals yet'}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        title={t('common.deleteGoal') || 'Delete Goal'}
        actions={
          <>
            <Button onClick={handleDeleteCancel} variant="outlined" color="inherit">
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
              {t('common.delete') || 'Delete'}
            </Button>
          </>
        }
      >
        <Typography variant="body1">
          {t('common.deleteConfirmation') || 'Are you sure you want to delete this goal? This action cannot be undone.'}
        </Typography>
      </Dialog>
    </Box>
  )
}