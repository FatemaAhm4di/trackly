import { Box, Grid } from '@mui/material'
import { useLanguage } from '../../hooks/useLanguage' // مسیر جدیدimport GoalCard from './GoalCard'
import Typography from '../ui/Typography'
import Icon from '../ui/Icon'

export default function GoalList({ 
  goals, 
  onProgress, 
  onEdit, 
  onPause, 
  onDelete,
  compact = false,
  emptyMessage 
}) {
  const { t } = useLanguage()

  if (!goals || goals.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'background.paper',
          borderRadius: 4
        }}
      >
        <Icon name="Inbox" size={64} color="text.disabled" sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyMessage || t('goals.noGoals')}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          {t('goals.createGoal')}
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {goals.map((goal) => (
        <Grid item xs={12} sm={6} lg={4} key={goal.id}>
          <GoalCard
            goal={goal}
            onProgress={onProgress}
            onEdit={onEdit}
            onPause={onPause}
            onDelete={onDelete}
            compact={compact}
          />
        </Grid>
      ))}
    </Grid>
  )
}