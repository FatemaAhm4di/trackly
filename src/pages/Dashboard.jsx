import { useState, } from 'react'
import { Box, Grid, Card, CardContent, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage' 
import { useGoalService } from '../services/goalService'
import Icon from '../components/ui/Icon'
import Typography from '../components/ui/Typography'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import Dialog from '../components/ui/Dialog'

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const { 
    userStats,
    addProgress,
    deleteGoal,
    getOverallProgress,
    getGoalsByStatus,
    calculateStreak 
  } = useGoalService()
  
  const [deleteDialog, setDeleteDialog] = useState({ open: false, goalId: null })

  const activeGoals = getGoalsByStatus('active')
  const completedGoals = getGoalsByStatus('completed')
  const overallProgress = getOverallProgress()

  // --- اصلاحیه اصلی: محاسبه مستقیم بدون useState/useEffect ---
  let streak = 0;
  if (activeGoals.length > 0) {
    const totalStreak = activeGoals.reduce((acc, goal) => acc + calculateStreak(goal.id), 0);
    streak = Math.floor(totalStreak / activeGoals.length) || 0;
  }
  // ---------------------------------------------------------

  const handleProgress = (goalId) => {
    addProgress(goalId)
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.goalId) {
      deleteGoal(deleteDialog.goalId)
      setDeleteDialog({ open: false, goalId: null })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, goalId: null })
  }

  // ... بقیه کد (statCards و return) بدون تغییر باقی می‌ماند ...

  const statCards = [
    {
      title: t('dashboard.overallProgress'),
      value: `${Math.round(overallProgress)}%`,
      icon: 'TrendingUp',
      color: 'primary',
      bgColor: 'rgba(54, 138, 199, 0.1)'
    },
    {
      title: t('dashboard.completedGoals'),
      value: userStats.completedCount,
      icon: 'CheckCircle',
      color: 'success',
      bgColor: 'rgba(76, 175, 80, 0.1)'
    },
    {
      title: t('dashboard.streak'),
      value: `${streak} ${t('common.days')}`,
      icon: 'LocalFireDepartment',
      color: 'warning',
      bgColor: 'rgba(255, 152, 0, 0.1)'
    },
    {
      title: t('dashboard.xpPoints'),
      value: userStats.xpTotal,
      icon: 'EmojiEvents',
      color: 'secondary',
      bgColor: 'rgba(14, 84, 136, 0.1)'
    }
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          {t('dashboard.welcome')}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.title')}
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
            {t('dashboard.quickActions')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon="Add"
            onClick={() => navigate('/goals/new')}
            sx={{ px: 3 }}
          >
            {t('dashboard.newGoal')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon="Flag"
            onClick={() => navigate('/goals')}
            sx={{ px: 3 }}
          >
            {t('dashboard.viewAllGoals')}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="600">
            {t('dashboard.activeGoals')}
          </Typography>
          <IconButton onClick={() => navigate('/goals')}>
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
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/goals/${goal.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {goal.title}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <ProgressBar 
                        value={(goal.progress / goal.target) * 100} 
                        color="primary"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {goal.progress} / {goal.target}
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
                        <Icon name="CheckCircle" size={18} />
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
                {t('dashboard.noActiveGoals')}
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
                {t('dashboard.createFirstGoal')}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon="Add"
                onClick={() => navigate('/goals/new')}
              >
                {t('dashboard.newGoal')}
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="600">
            {t('dashboard.completedGoalsPreview')}
          </Typography>
          <IconButton onClick={() => navigate('/goals?filter=completed')}>
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
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/goals/${goal.id}`)}
                >
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      fontWeight="600" 
                      gutterBottom
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                    >
                      {goal.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon name="CheckCircle" size={20} color="success" />
                      <Typography variant="body2" color="success.main">
                        {t('dashboard.complete')}
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
                {t('dashboard.noCompletedGoals')}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        title="Delete Goal"
        actions={
          <>
            <Button onClick={handleDeleteCancel} variant="outlined" color="inherit">
              {t('common.cancel')}
            </Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
              {t('common.delete')}
            </Button>
          </>
        }
      >
        Are you sure you want to delete this goal? This action cannot be undone.
      </Dialog>
    </Box>
  )
}