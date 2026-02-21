import { useState } from 'react'
import { Box, Grid, Card, CardContent, Chip, IconButton } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage' // ✅ اصلاح مسیر: فقط یک سطح بالا
import { useGoalService } from '../services/goalService'
import Button from '../components/ui/Button'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'
import ProgressBar from '../components/ui/ProgressBar'
import Dialog from '../components/ui/Dialog'
import Input from '../components/ui/Input' // ✅ اضافه کردن ایمپورت فراموش شده

export default function GoalDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useLanguage()
  const { 
    getGoalById, 
    updateGoal, 
    deleteGoal, 
    addProgress, 
    calculateStreak 
  } = useGoalService()
  
  const goal = getGoalById(id)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [progressDialog, setProgressDialog] = useState(false)
  const [progressAmount, setProgressAmount] = useState(1)

  if (!goal) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Icon name="ErrorOutline" size={64} color="text.disabled" sx={{ mb: 2 }} />
        <Typography variant="h5" color="text.secondary">
          Goal not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon="ArrowBack"
          onClick={() => navigate('/goals')}
          sx={{ mt: 2 }}
        >
          {t('goalDetail.back')}
        </Button>
      </Box>
    )
  }

  const progressPercent = (goal.progress / goal.target) * 100
  const isCompleted = goal.status === 'completed'
  const isPaused = goal.status === 'paused'
  const streak = calculateStreak(goal.id)

  const handleProgress = () => {
    addProgress(goal.id, progressAmount)
    setProgressDialog(false)
    setProgressAmount(1)
  }

  const handlePause = () => {
    updateGoal(goal.id, { 
      status: isPaused ? 'active' : 'paused' 
    })
  }

  const handleComplete = () => {
    updateGoal(goal.id, {
      progress: goal.target,
      status: 'completed',
      completedAt: new Date().toISOString()
    })
  }

  const handleDelete = () => {
    deleteGoal(goal.id)
    navigate('/goals')
  }

  const getCategoryLabel = () => {
    return t(`categories_list.${goal.category}`) || goal.category
  }

  const getTypeLabel = () => {
    switch (goal.type) {
      case 'daily': return t('common.days')
      case 'count': return t('common.sessions')
      case 'time': return t('common.minutes')
      default: return ''
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          startIcon="ArrowBack"
          onClick={() => navigate('/goals')}
          sx={{ mb: 2 }}
        >
          {t('goalDetail.back')}
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              {goal.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={getCategoryLabel()} 
                sx={{ 
                  backgroundColor: `${goal.color}20`,
                  color: goal.color,
                  fontWeight: 500
                }}
              />
              <Chip 
                label={isCompleted ? t('goals.completed') : isPaused ? t('goals.paused') : t('goals.active')}
                color={isCompleted ? 'success' : isPaused ? 'warning' : 'primary'}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isCompleted && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon="CheckCircle"
                  onClick={() => setProgressDialog(true)}
                >
                  {t('goalDetail.addProgress')}
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={isPaused ? 'PlayArrow' : 'Pause'}
                  onClick={handlePause}
                >
                  {isPaused ? t('goals.resume') : t('goals.pause')}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon="Edit"
                  onClick={() => navigate(`/goals/${goal.id}`)}
                >
                  {t('common.edit')}
                </Button>
              </>
            )}
            <Button
              variant="outlined"
              color="error"
              startIcon="Delete"
              onClick={() => setDeleteDialog(true)}
            >
              {t('common.delete')}
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {t('goalDetail.summary')}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    {t('goalDetail.progress')}
                  </Typography>
                  <Typography variant="h5" fontWeight="700" color="primary">
                    {goal.progress} / {goal.target}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    {t('goalDetail.status')}
                  </Typography>
                  <Typography variant="h5" fontWeight="700">
                    {isCompleted ? '✓' : isPaused ? '⏸' : '✓'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    {t('goalDetail.startDate')}
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {formatDate(goal.startDate)}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    {t('goalDetail.endDate')}
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {formatDate(goal.endDate)}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <ProgressBar value={progressPercent} color={isCompleted ? 'success' : 'primary'} size="large" />
              </Box>

              {goal.notes && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.default', borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {goal.notes}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {t('goalDetail.progressHistory')}
              </Typography>
              {goal.logs && goal.logs.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {goal.logs.slice().reverse().map((log, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        py: 1.5,
                        borderBottom: index < goal.logs.length - 1 ? 1 : 0,
                        borderColor: 'divider'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Icon name="CheckCircle" size={20} color="success" />
                        <Typography variant="body1">
                          {formatDate(log.date)}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="600" color="primary">
                        +{log.amount} {getTypeLabel()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Icon name="Inbox" size={48} color="text.disabled" sx={{ mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    {t('goalDetail.noHistory')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Statistics
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ p: 1.5, backgroundColor: 'warning.light', borderRadius: 2 }}>
                    <Icon name="LocalFireDepartment" size={24} color="warning" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Streak
                    </Typography>
                    <Typography variant="h5" fontWeight="700">
                      {streak} {t('common.days')}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ p: 1.5, backgroundColor: 'primary.light', borderRadius: 2 }}>
                    <Icon name="EmojiEvents" size={24} color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      XP Earned
                    </Typography>
                    <Typography variant="h5" fontWeight="700">
                      {goal.logs.reduce((acc, log) => acc + (log.amount * 20), 0)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.5, backgroundColor: 'success.light', borderRadius: 2 }}>
                    <Icon name="CalendarToday" size={24} color="success" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('goalDetail.createdAt')}
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {formatDate(goal.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {!isCompleted && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon="CheckCircle"
                    onClick={handleComplete}
                    fullWidth
                  >
                    {t('goalDetail.markComplete')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon="Edit"
                    onClick={() => navigate(`/goals/${goal.id}`)}
                    fullWidth
                  >
                    {t('goalDetail.editGoal')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        title="Delete Goal"
        actions={
          <>
            <Button onClick={() => setDeleteDialog(false)} variant="outlined" color="inherit">
              {t('common.cancel')}
            </Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              {t('common.delete')}
            </Button>
          </>
        }
      >
        Are you sure you want to delete this goal? This action cannot be undone.
      </Dialog>

      <Dialog
        open={progressDialog}
        onClose={() => setProgressDialog(false)}
        title={t('goalDetail.addProgress')}
        actions={
          <>
            <Button onClick={() => setProgressDialog(false)} variant="outlined" color="inherit">
              {t('common.cancel')}
            </Button>
            <Button onClick={handleProgress} variant="contained" color="success">
              {t('common.add')}
            </Button>
          </>
        }
      >
        <Box sx={{ py: 2 }}>
          <Input
            label={`Amount (${getTypeLabel()})`}
            value={progressAmount}
            onChange={(e) => setProgressAmount(Number(e.target.value))}
            type="number"
            inputProps={{ min: 1 }}
            fullWidth
          />
        </Box>
      </Dialog>
    </Box>
  )
}