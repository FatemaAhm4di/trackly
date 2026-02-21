import { Card, CardContent, Box, IconButton, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage' // مسیر جدیدimport Icon from '../ui/Icon'
import Typography from '../ui/Typography'
import ProgressBar from '../ui/ProgressBar'

export default function GoalCard({ 
  goal, 
  onProgress, 
  onEdit, 
  onPause, 
  onDelete,
  compact = false 
}) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const progressPercent = (goal.progress / goal.target) * 100
  const isCompleted = goal.status === 'completed'
  const isPaused = goal.status === 'paused'
  
  const getStatusColor = () => {
    if (isCompleted) return 'success'
    if (isPaused) return 'warning'
    return 'primary'
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

  const handleCardClick = () => {
    navigate(`/goals/${goal.id}`)
  }

  const handleProgressClick = (e) => {
    e.stopPropagation()
    onProgress(goal.id)
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    onEdit(goal.id)
  }

  const handlePauseClick = (e) => {
    e.stopPropagation()
    onPause(goal.id)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    onDelete(goal.id)
  }

  return (
    <Card 
      onClick={handleCardClick}
      sx={{
        cursor: 'pointer',
        opacity: isPaused ? 0.7 : 1,
        borderLeft: isCompleted ? '4px solid' : 'none',
        borderLeftColor: 'success.main',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              fontWeight="600" 
              gutterBottom
              sx={{ 
                color: isCompleted ? 'text.secondary' : 'text.primary',
                textDecoration: isCompleted ? 'line-through' : 'none'
              }}
            >
              {goal.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
              <Chip 
                label={getCategoryLabel()} 
                size="small" 
                sx={{ 
                  backgroundColor: `${goal.color}20`,
                  color: goal.color,
                  fontWeight: 500
                }}
              />
              <Chip 
                label={isCompleted ? t('goals.completed') : isPaused ? t('goals.paused') : t('goals.active')}
                size="small"
                color={getStatusColor()}
              />
            </Box>
          </Box>
          
          {!compact && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {!isCompleted && !isPaused && (
                <IconButton 
                  size="small" 
                  onClick={handleProgressClick}
                  sx={{ 
                    backgroundColor: 'success.light',
                    color: 'white',
                    '&:hover': { backgroundColor: 'success.dark' }
                  }}
                >
                  <Icon name="CheckCircle" size={20} />
                </IconButton>
              )}
              <IconButton size="small" onClick={handleEditClick}>
                <Icon name="Edit" size={20} color="primary" />
              </IconButton>
              <IconButton size="small" onClick={handlePauseClick}>
                <Icon name={isPaused ? 'PlayArrow' : 'Pause'} size={20} color="warning" />
              </IconButton>
              <IconButton size="small" onClick={handleDeleteClick}>
                <Icon name="Delete" size={20} color="error" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <ProgressBar 
            value={progressPercent} 
            color={getStatusColor()}
            showLabel={!compact}
            size={compact ? 'small' : 'medium'}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {goal.progress} / {goal.target} {getTypeLabel()}
          </Typography>
          {compact && (
            <IconButton size="small" onClick={handleProgressClick}>
              <Icon name="Add" size={18} color="primary" />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}