import { useState, useEffect } from 'react'
import { Box, Grid, Card, CardContent, Chip } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useGoalService } from '../services/goalService'
import { useToast } from '../hooks/useToast'
import { getTypeLabel, getCategoryLabel, getStatusColor, calculateProgressPercent } from '../utils/goalUtils'
import Button from '../components/ui/Button'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'
import ProgressBar from '../components/ui/ProgressBar'
import Dialog from '../components/ui/Dialog'
import Input from '../components/ui/Input'
import { PageLoading, ButtonLoading } from '../components/ui/Loading'

export default function GoalDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useLanguage()
  const { showToast } = useToast()
  const { getGoalById, updateGoal, deleteGoal, addProgress, calculateStreak } = useGoalService()
  
  const [goal, setGoal] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [progressDialog, setProgressDialog] = useState(false)
  const [progressAmount, setProgressAmount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    setTimeout(() => {
      if (mounted) {
        if (id) setGoal(getGoalById(id))
        setLoading(false)
      }
    }, 500)
    return () => { mounted = false }
  }, [id, getGoalById])

  const refreshGoal = () => id && setGoal(getGoalById(id))

  if (loading) return <PageLoading />
  if (!goal) return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Icon name="ErrorOutline" size={64} color="text.disabled" sx={{ mb: 2 }} />
      <Typography variant="h5" color="text.secondary" gutterBottom>Goal not found</Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>The goal you're looking for doesn't exist or has been deleted.</Typography>
      <Button variant="contained" color="primary" startIcon={<Icon name="ArrowBack" size={20} />} onClick={() => navigate('/goals')}>{t('goalDetail.back') || 'Back to Goals'}</Button>
    </Box>
  )

  const progressPercent = calculateProgressPercent(goal.progress, goal.target)
  const isCompleted = goal.status === 'completed'
  const isPaused = goal.status === 'paused'
  const streak = calculateStreak ? calculateStreak(goal.id) : 0
  const totalXP = goal.logs?.reduce((acc, log) => acc + ((log.amount || 1) * 20), 0) || 0

  const handleProgress = () => {
    setIsSubmitting(true)
    const result = addProgress(goal.id, progressAmount)
    if (result && !result.success) {
      showToast({ title: '⚠️ Limit Reached', message: result.message || 'You can only add progress once every 24 hours.', type: 'warning' })
      setIsSubmitting(false)
    } else {
      refreshGoal()
      showToast({ title: '📈 Progress Added!', message: `+${progressAmount} ${getTypeLabel(goal.type, t)} added to "${goal.title}"`, type: 'success' })
      setTimeout(() => setIsSubmitting(false), 300)
    }
    setProgressDialog(false)
    setProgressAmount(1)
  }

  const handlePause = () => {
    setIsSubmitting(true)
    const newStatus = isPaused ? 'active' : 'paused'
    updateGoal(goal.id, { status: newStatus })
    refreshGoal()
    showToast({ title: newStatus === 'paused' ? '⏸ Goal Paused' : '▶️ Goal Resumed', message: newStatus === 'paused' ? `"${goal.title}" has been paused.` : `"${goal.title}" is now active again.`, type: 'info' })
    setTimeout(() => setIsSubmitting(false), 300)
  }

  const handleComplete = () => {
    setIsSubmitting(true)
    updateGoal(goal.id, { progress: goal.target, status: 'completed', completedAt: new Date().toISOString() })
    refreshGoal()
    showToast({ title: '🏆 Goal Completed!', message: `Congratulations! "${goal.title}" is done. +${(goal.target || 1) * 20} XP earned!`, type: 'success' })
    setTimeout(() => setIsSubmitting(false), 300)
  }

  const handleDelete = () => {
    setIsSubmitting(true)
    const goalTitle = goal.title
    deleteGoal(goal.id)
    setDeleteDialog(false)
    showToast({ title: '🗑️ Goal Deleted', message: `"${goalTitle}" has been removed from your goals.`, type: 'info' })
    setTimeout(() => navigate('/goals'), 300)
  }

  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '-'

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Button variant="text" startIcon={<Icon name="ArrowBack" size={20} />} onClick={() => navigate('/goals')} sx={{ mb: 2 }} disabled={isSubmitting}>{t('goalDetail.back') || 'Back to Goals'}</Button>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="700" gutterBottom>{goal.title || 'Untitled Goal'}</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={getCategoryLabel(goal.category, t)} sx={{ bgcolor: goal.color ? `${goal.color}20` : '#368ac720', color: goal.color || '#368ac7', fontWeight: 500 }} />
            <Chip label={isCompleted ? (t('goals.completed') || 'Completed') : isPaused ? (t('goals.paused') || 'Paused') : (t('goals.active') || 'Active')} color={isCompleted ? 'success' : isPaused ? 'warning' : 'primary'} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {!isCompleted && (
            <>
              <Button variant="contained" color="success" startIcon={<Icon name="Add" size={20} />} onClick={() => setProgressDialog(true)} disabled={isSubmitting}>{t('goalDetail.addProgress') || 'Add Progress'}</Button>
              <Button variant="outlined" color="warning" startIcon={<Icon name={isPaused ? 'PlayArrow' : 'Pause'} size={20} />} onClick={handlePause} disabled={isSubmitting}>{isSubmitting ? <ButtonLoading /> : (isPaused ? (t('goals.resume') || 'Resume') : (t('goals.pause') || 'Pause'))}</Button>
              <Button variant="outlined" color="primary" startIcon={<Icon name="Edit" size={20} />} onClick={() => navigate(`/goals/new?edit=${goal.id}`)} disabled={isSubmitting}>{t('common.edit') || 'Edit'}</Button>
            </>
          )}
          <Button variant="outlined" color="error" startIcon={<Icon name="Delete" size={20} />} onClick={() => setDeleteDialog(true)} disabled={isSubmitting}>{t('common.delete') || 'Delete'}</Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>{t('goalDetail.summary') || 'Summary'}</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">{t('goalDetail.progress') || 'Progress'}</Typography><Typography variant="h5" fontWeight="700" color="primary">{goal.progress || 0} / {goal.target || 0}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">{t('goalDetail.status') || 'Status'}</Typography><Typography variant="h5" fontWeight="700">{isCompleted ? '✓' : isPaused ? '⏸' : '✓'}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">{t('goalDetail.startDate') || 'Start Date'}</Typography><Typography variant="h6" fontWeight="600">{formatDate(goal.startDate)}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">{t('goalDetail.endDate') || 'End Date'}</Typography><Typography variant="h6" fontWeight="600">{formatDate(goal.endDate)}</Typography></Grid>
              </Grid>
              <Box sx={{ mt: 3 }}><ProgressBar value={progressPercent} color={isCompleted ? 'success' : 'primary'} size="large" /></Box>
              {goal.notes && (<Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}><Typography variant="subtitle2" gutterBottom>Notes</Typography><Typography variant="body2" color="text.secondary">{goal.notes}</Typography></Box>)}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>{t('goalDetail.progressHistory') || 'Progress History'}</Typography>
              {goal.logs?.length > 0 ? (
                <Box sx={{ mt: 2 }}>{goal.logs.slice().reverse().map((log, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: idx < goal.logs.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Icon name="CheckCircle" size={20} color="success" /><Typography variant="body1">{formatDate(log.date)}</Typography></Box>
                    <Typography variant="body1" fontWeight="600" color="primary">+{log.amount || 1} {getTypeLabel(goal.type, t)}</Typography>
                  </Box>
                ))}</Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}><Icon name="Inbox" size={48} color="text.disabled" sx={{ mb: 1 }} /><Typography variant="body1" color="text.secondary">{t('goalDetail.noHistory') || 'No progress history yet'}</Typography></Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>Statistics</Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}><Box sx={{ p: 1.5, bgcolor: 'warning.light', borderRadius: 2 }}><Icon name="LocalFireDepartment" size={24} color="warning" /></Box><Box><Typography variant="body2" color="text.secondary">Streak</Typography><Typography variant="h5" fontWeight="700">{streak} {t('common.days') || 'days'}</Typography></Box></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}><Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 2 }}><Icon name="EmojiEvents" size={24} color="primary" /></Box><Box><Typography variant="body2" color="text.secondary">XP Earned</Typography><Typography variant="h5" fontWeight="700">{totalXP}</Typography></Box></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Box sx={{ p: 1.5, bgcolor: 'success.light', borderRadius: 2 }}><Icon name="CalendarToday" size={24} color="success" /></Box><Box><Typography variant="body2" color="text.secondary">{t('goalDetail.createdAt') || 'Created At'}</Typography><Typography variant="body1" fontWeight="600">{formatDate(goal.createdAt)}</Typography></Box></Box>
              </Box>
            </CardContent>
          </Card>

          {!isCompleted && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>Quick Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button variant="contained" color="success" startIcon={<Icon name="CheckCircle" size={20} />} onClick={handleComplete} fullWidth disabled={isSubmitting}>{isSubmitting ? <ButtonLoading /> : (t('goalDetail.markComplete') || 'Mark as Complete')}</Button>
                  <Button variant="outlined" color="primary" startIcon={<Icon name="Edit" size={20} />} onClick={() => navigate(`/goals/new?edit=${goal.id}`)} fullWidth disabled={isSubmitting}>{t('goalDetail.editGoal') || 'Edit Goal'}</Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Dialog open={deleteDialog} onClose={() => !isSubmitting && setDeleteDialog(false)} title="Delete Goal" actions={<><Button onClick={() => setDeleteDialog(false)} variant="outlined" color="inherit" disabled={isSubmitting}>{t('common.cancel') || 'Cancel'}</Button><Button onClick={handleDelete} variant="contained" color="error" disabled={isSubmitting}>{isSubmitting ? <ButtonLoading /> : (t('common.delete') || 'Delete')}</Button></>}>
        <Typography>Are you sure you want to delete this goal? This action cannot be undone.</Typography>
      </Dialog>

      <Dialog open={progressDialog} onClose={() => !isSubmitting && setProgressDialog(false)} title={t('goalDetail.addProgress') || 'Add Progress'} actions={<><Button onClick={() => setProgressDialog(false)} variant="outlined" color="inherit" disabled={isSubmitting}>{t('common.cancel') || 'Cancel'}</Button><Button onClick={handleProgress} variant="contained" color="success" disabled={isSubmitting}>{isSubmitting ? <ButtonLoading /> : (t('common.add') || 'Add')}</Button></>}>
        <Box sx={{ py: 2 }}><Input label={`Amount (${getTypeLabel(goal.type, t)})`} value={progressAmount} onChange={(e) => setProgressAmount(Number(e.target.value))} type="number" inputProps={{ min: 1, step: 1 }} fullWidth disabled={isSubmitting} /></Box>
      </Dialog>
    </Box>
  )
}