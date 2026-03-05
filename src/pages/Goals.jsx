import { useState, useMemo } from 'react'
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
    togglePause,     
    searchGoals,
    sortGoals 
  } = useGoalService()
  
  const initialFilter = searchParams.get('filter') || 'all'
  const [filter, setFilter] = useState(initialFilter)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, goalId: null })

  // استفاده از useMemo برای بهینه‌سازی و جلوگیری از محاسبات اضافه
  const filteredGoals = useMemo(() => {
    // اگر goals تعریف نشده یا آرایه نیست، آرایه خالی برگردون
    if (!goals || !Array.isArray(goals)) {
      return []
    }

    let result = [...goals]

    // اعمال فیلتر وضعیت
    if (filter !== 'all') {
      result = result.filter(goal => goal && goal.status === filter)
    }

    // اعمال جستجو
    if (searchQuery && searchQuery.trim() !== '') {
      // اطمینان از اینکه searchGoals یک تابع هست و result آرایه هست
      if (typeof searchGoals === 'function') {
        // اگر searchGoals روی کل goals کار میکنه، باید از result استفاده کنیم
        // ولی اگر searchGoals جستجو رو روی همه goals انجام میده و نتیجه رو برمیگردونه
        result = searchGoals(searchQuery)
        // بعد از جستجو، دوباره فیلتر وضعیت رو اعمال کن
        if (filter !== 'all') {
          result = result.filter(goal => goal && goal.status === filter)
        }
      } else {
        // اگر searchGoals تابع نیست، خودمون فیلتر کنیم
        result = result.filter(goal => 
          goal && goal.title && goal.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
    }

    // اعمال مرتب‌سازی
    if (typeof sortGoals === 'function' && result.length > 0) {
      result = sortGoals(result, sortBy)
    } else {
      // مرتب‌سازی پیش‌فرض بر اساس تاریخ ایجاد
      result = result.sort((a, b) => {
        if (!a || !b) return 0
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      })
    }

    return result
  }, [goals, filter, searchQuery, sortBy, searchGoals, sortGoals])

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
    if (!goalId) return
    const result = addProgress(goalId)
    // اگر خطایی برگشت داده شد، می‌تونیم اینجا مدیریت کنیم
    if (result && !result.success) {
      // اینجا می‌تونیم از Snackbar یا Notification استفاده کنیم
      console.log(result.message)
    }
  }

  const handleEdit = (goalId) => {
    if (!goalId) return
    navigate(`/goals/${goalId}`)
  }

  const handlePause = (goalId) => {
    if (!goalId) return
    togglePause(goalId)
  }

  const handleDeleteClick = (goalId) => {
    if (!goalId) return
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

  // روش با پشتیبانی از ترجمه
const getEmptyMessage = () => {
    if (searchQuery) {
        return t('goals.noGoals') || 'No goals found'
    }
    if (filter !== 'all') {
        // سعی کن ترجمه مخصوص این فیلتر رو پیدا کنی، وگرنه از متن پیش‌فرض استفاده کن
        const translatedMessage = t(`goals.${filter}Empty`)
        return translatedMessage || `No ${filter} goals found`
    }
    return t('goals.noGoals') || 'No goals yet. Create your first goal!'
}

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          {t('goals.title') || 'Goals'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('goals.subtitle') || 'Manage and track all your goals'}
        </Typography>
      </Box>

      <GoalFilters
        filter={filter}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onSort={handleSort}
        onAddClick={() => navigate('/goals/new')}
        searchValue={searchQuery}
        sortValue={sortBy}
      />

      <GoalList
        goals={filteredGoals}
        onProgress={handleProgress}
        onEdit={handleEdit}
        onPause={handlePause}
        onDelete={handleDeleteClick}
        compact={isMobile}
        emptyMessage={getEmptyMessage()}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        title="Delete Goal"
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
          Are you sure you want to delete this goal? This action cannot be undone.
        </Typography>
      </Dialog>
    </Box>
  )
}