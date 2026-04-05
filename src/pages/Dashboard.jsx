import { useState, useEffect } from 'react'
import { Box, Grid, Card, CardContent, IconButton, alpha } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage' 
import { useGoalService } from '../services/goalService'
import { useToast } from '../hooks/useToast'
import { calculateProgressPercent } from '../utils/goalUtils'
import Icon from '../components/ui/Icon'
import Typography from '../components/ui/Typography'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import Dialog from '../components/ui/Dialog'
import { PageLoading } from '../components/ui/Loading'  

// نمودارها
import MonthlyChart from '../components/charts/MonthlyChart';
import StreakChart from '../components/charts/StreakChart';
import CategoryChart from '../components/charts/CategoryChart';

// کامپوننت‌های کوچک شده 
function StatCard({ title, value, icon, color, bgColor }) {
  return (
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
          <Box sx={{ p: 2, borderRadius: 3, bgcolor: bgColor }}>
            <Icon name={icon} size={32} color={color} />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="700" color={color}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

function ActiveGoalCard({ goal, onProgress, onClick }) {
  const { t } = useLanguage()
  const progressPercent = calculateProgressPercent(goal.progress, goal.target)
  
  return (
    <Card 
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom noWrap>
          {goal.title || 'Untitled Goal'}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              bgcolor: alpha(goal.color || '#1976d2', 0.1),
              color: goal.color || '#1976d2',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              display: 'inline-block',
              fontWeight: 600
            }}
          >
            {goal.category || 'other'}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 1 }}>
          <ProgressBar value={progressPercent} color="primary" />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {goal.progress || 0} / {goal.target || 0}
          </Typography>
          <IconButton 
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onProgress(goal.id, goal.title)
            }}
            sx={{ 
              bgcolor: alpha('#4caf50', 0.1),
              color: 'success.main',
              '&:hover': { bgcolor: 'success.main', color: 'white' }
            }}
          >
            <Icon name="Add" size={18} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}

function CompletedGoalCard({ goal, onClick }) {
  const { t } = useLanguage()
  
  return (
    <Card 
      sx={{
        borderLeft: '4px solid',
        borderLeftColor: 'success.main',
        opacity: 0.8,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          opacity: 1,
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
        }
      }}
      onClick={onClick}
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
            {t('dashboard.completed') || 'Completed'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { showToast } = useToast()
  
  const { 
    goals,
    userStats,
    addProgress,
    deleteGoal,
    getOverallProgress,
    getGoalsByStatus
  } = useGoalService()
  
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, goalId: null, goalTitle: '' })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Get goals with error handling
  let activeGoals = []
  let completedGoals = []
  let overallProgress = 0
  let displayedActiveGoals = []
  
  try {
    activeGoals = getGoalsByStatus('active') || []
    completedGoals = getGoalsByStatus('completed') || []
    overallProgress = getOverallProgress() || 0
    displayedActiveGoals = activeGoals.slice(0, 6)
  } catch (error) {
    console.error('Error fetching goals:', error)
  }

  let streak = 0
  try {
    streak = userStats?.streak || 0
  } catch (error) {
    streak = 0
  }

  if (loading) return <PageLoading />

  const handleProgress = (goalId, goalTitle) => {
    if (!goalId) return
    const result = addProgress(goalId)
    
    if (result && !result.success) {
      if (result.error === 'DAILY_LIMIT') {
        showToast({
          title: '⚠️ Limit Reached',
          message: result.message || 'You can only add progress once every 24 hours.',
          type: 'warning'
        })
      } else {
        showToast({
          title: '❌ Failed',
          message: result.message || 'Could not add progress. Try again.',
          type: 'error'
        })
      }
    } else {
      showToast({
        title: '📈 Progress Added!',
        message: `+1 added to "${goalTitle || 'your goal'}"`,
        type: 'success'
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.goalId) {
      try {
        deleteGoal(deleteDialog.goalId)
        showToast({
          title: '🗑️ Goal Deleted',
          message: `"${deleteDialog.goalTitle}" has been removed from your goals.`,
          type: 'info'
        })
        setDeleteDialog({ open: false, goalId: null, goalTitle: '' })
      } catch (error) {
        console.error('Error deleting goal:', error)
        showToast({
          title: '❌ Failed',
          message: 'Could not delete goal. Try again.',
          type: 'error'
        })
      }
    }
  }

  const handleDeleteCancel = () => setDeleteDialog({ open: false, goalId: null, goalTitle: '' })

  const handleGoalClick = (goalId) => {
    if (!goalId) return
    navigate(`/goals/${goalId}`)
  }

  const safeUserStats = {
    completedCount: userStats?.completedCount || 0,
    xpTotal: userStats?.xpTotal || 0
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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          {t('dashboard.welcome') || 'Welcome'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.title') || 'Track your goals and progress'}
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12}>
          <MonthlyChart goals={goals} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StreakChart goals={goals} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CategoryChart goals={goals} />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 2 }}>
          {t('dashboard.quickActions') || 'Quick Actions'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon name="Add" size={20} />}
            onClick={() => navigate('/goals/new')}
            sx={{ px: 3, py: 1.2 }}
          >
            {t('dashboard.newGoal') || 'New Goal'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Icon name="Flag" size={20} />}
            onClick={() => navigate('/goals')}
            sx={{ px: 3, py: 1.2 }}
          >
            {t('dashboard.viewAllGoals') || 'View All Goals'}
          </Button>
        </Box>
      </Box>

      {/* Active Goals Section */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="700">
            {t('dashboard.activeGoals') || 'Active Goals'}
          </Typography>
          <Button
            variant="text"
            endIcon={<Icon name="ArrowForward" size={18} />}
            onClick={() => navigate('/goals')}
          >
            {t('common.viewAll') || 'View All'}
          </Button>
        </Box>
        
        {displayedActiveGoals.length > 0 ? (
          <Grid container spacing={3}>
            {displayedActiveGoals.map((goal) => (
              <Grid item xs={12} md={6} lg={4} key={goal.id}>
                <ActiveGoalCard 
                  goal={goal}
                  onProgress={handleProgress}
                  onClick={() => handleGoalClick(goal.id)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card sx={{ py: 6, textAlign: 'center' }}>
            <CardContent>
              <Icon name="Inbox" size={64} color="disabled" sx={{ mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t('dashboard.noActiveGoals') || 'No active goals'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Icon name="Add" size={20} />}
                onClick={() => navigate('/goals/new')}
                sx={{ mt: 1 }}
              >
                {t('dashboard.newGoal') || 'New Goal'}
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Completed Goals Preview */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="700">
            {t('dashboard.completedGoalsPreview') || 'Recently Completed'}
          </Typography>
          <Button
            variant="text"
            endIcon={<Icon name="ArrowForward" size={18} />}
            onClick={() => navigate('/goals?filter=completed')}
          >
            {t('common.viewAll') || 'View All'}
          </Button>
        </Box>
        
        {completedGoals.length > 0 ? (
          <Grid container spacing={3}>
            {completedGoals.slice(0, 3).map((goal) => (
              <Grid item xs={12} md={4} key={goal.id}>
                <CompletedGoalCard 
                  goal={goal}
                  onClick={() => handleGoalClick(goal.id)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card sx={{ py: 6, textAlign: 'center' }}>
            <CardContent>
              <Icon name="Celebration" size={64} color="disabled" sx={{ mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary">
                {t('dashboard.noCompletedGoals') || 'No completed goals yet'}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Delete Dialog */}
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
        <Typography>
          {t('common.deleteConfirmation') || 'Are you sure you want to delete this goal? This action cannot be undone.'}
        </Typography>
      </Dialog>
    </Box>
  )
}