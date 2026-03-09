import { useState, useMemo, useEffect } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useGoalService } from '../services/goalService'
import GoalFilters from '../components/goals/GoalFilters'
import GoalList from '../components/goals/GoalList'
import Typography from '../components/ui/Typography'
import { PageLoading } from '../components/ui/Loading'

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
  
  const [loading, setLoading] = useState(true)  // ✅ state لودینگ اضافه شد
  const initialFilter = searchParams.get('filter') || 'all'
  const [filter, setFilter] = useState(initialFilter)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  
  const [errorMessage, setErrorMessage] = useState('')
  const [showError, setShowError] = useState(false)

  // ✅ useEffect برای لودینگ
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500) // نیم ثانیه لودینگ نشون بده
    
    return () => clearTimeout(timer)
  }, [])

  const filteredGoals = useMemo(() => {
    if (!goals || !Array.isArray(goals)) {
      return []
    }

    let result = [...goals]

    if (filter !== 'all') {
      result = result.filter(goal => goal && goal.status === filter)
    }

    if (searchQuery && searchQuery.trim() !== '') {
      if (typeof searchGoals === 'function') {
        result = searchGoals(searchQuery)
        if (filter !== 'all') {
          result = result.filter(goal => goal && goal.status === filter)
        }
      } else {
        result = result.filter(goal => 
          goal && goal.title && goal.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
    }

    if (typeof sortGoals === 'function' && result.length > 0) {
      result = sortGoals(result, sortBy)
    } else {
      result = result.sort((a, b) => {
        if (!a || !b) return 0
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      })
    }

    return result
  }, [goals, filter, searchQuery, sortBy, searchGoals, sortGoals])

  // ✅ نمایش لودینگ
  if (loading) {
    return <PageLoading />
  }

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
    
    if (result && !result.success) {
      const errorMessage = result.message.startsWith('errors.') 
        ? t(result.message)
        : result.message
      
      setErrorMessage(errorMessage)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
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

  const handleDelete = (goalId) => {
    if (!goalId) return
    deleteGoal(goalId)
  }

  const getEmptyMessage = () => {
    if (searchQuery) {
        return t('goals.noGoals') || 'No goals found'
    }
    if (filter !== 'all') {
        const translatedMessage = t(`goals.${filter}Empty`)
        return translatedMessage || `No ${filter} goals found`
    }
    return t('goals.noGoals') || 'No goals yet. Create your first goal!'
  }

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
        onDelete={handleDelete}
        compact={isMobile}
        emptyMessage={getEmptyMessage()}
      />
    </Box>
  )
}