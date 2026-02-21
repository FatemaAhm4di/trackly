import { useState } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useGoalService } from '../services/goalService'
import GoalFilters from '../components/goals/GoalFilters'
import GoalList from '../components/goals/GoalList'
import Dialog from '../components/ui/Dialog'
import Typography from '../components/ui/Typography'
import Button from '../components/ui/Button'

export default function Goals() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useLanguage()
  
 const { 
  goals, 
  addProgress, 
  deleteGoal, 
  togglePause,       // ← فقط اگر در کد استفاده می‌شود نگه دار
  searchGoals,
  sortGoals 
} = useGoalService()
  
  // مقدار اولیه فیلتر را از URL می‌خوانیم (فقط یکبار موقع لود)
  const initialFilter = searchParams.get('filter') || 'all';
  const [filter, setFilter] = useState(initialFilter)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, goalId: null })

  // --- اصلاحیه اصلی: فیلتر و سورت مستقیم در بدنه کامپوننت ---
  let filteredGoals = [...goals];

  if (filter !== 'all') {
    filteredGoals = filteredGoals.filter(goal => goal.status === filter)
  }

  if (searchQuery) {
    filteredGoals = searchGoals(searchQuery)
  }

  filteredGoals = sortGoals(filteredGoals, sortBy)
  // -------------------------------------------------------

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleSort = (sort) => {
    setSortBy(sort)
  }

  const handleProgress = (goalId) => {
    addProgress(goalId)
  }

  const handleEdit = (goalId) => {
    navigate(`/goals/${goalId}`)
  }

  const handlePause = (goalId) => {
    togglePause(goalId)
  }

  const handleDeleteClick = (goalId) => {
    setDeleteDialog({ open: true, goalId })
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

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          {t('goals.title')}
        </Typography>
      </Box>

      <GoalFilters
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onSort={handleSort}
        onAddClick={() => navigate('/goals/new')}
      />

      <GoalList
        goals={filteredGoals}
        onProgress={handleProgress}
        onEdit={handleEdit}
        onPause={handlePause}
        onDelete={handleDeleteClick}
        compact={isMobile}
        emptyMessage={
          searchQuery 
            ? t('goals.noGoals')
            : filter !== 'all' 
              ? `No ${filter} goals`
              : t('goals.noGoals')
        }
      />

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