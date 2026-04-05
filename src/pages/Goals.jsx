import { useState, useMemo, useEffect } from 'react'
import { Box, useMediaQuery, useTheme, Tabs, Tab, TextField, InputAdornment, Menu, MenuItem, IconButton, alpha, Stack } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useGoalService } from '../services/goalService'
import { useToast } from '../hooks/useToast'
import GoalList from '../components/goals/GoalList'
import Typography from '../components/ui/Typography'
import { PageLoading } from '../components/ui/Loading'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

export default function Goals() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const { t } = useLanguage()
  const { showToast } = useToast()
  
  const { 
    goals, 
    addProgress, 
    deleteGoal, 
    togglePause,     
    searchGoals,
    sortGoals
  } = useGoalService()
  
  const [loading, setLoading] = useState(true)
  const initialFilter = searchParams.get('filter') || 'all'
  const [filter, setFilter] = useState(initialFilter)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [sortAnchorEl, setSortAnchorEl] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const filteredGoals = useMemo(() => {
    if (!goals || !Array.isArray(goals)) {
      return []
    }

    let result = [...goals]

    // فیلتر بر اساس وضعیت
    if (filter !== 'all') {
      result = result.filter(goal => goal && goal.status === filter)
    }

    // جستجو بر اساس عنوان
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(goal => 
        goal && goal.title && goal.title.toLowerCase().includes(query)
      )
    }

    // مرتب‌سازی
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
        break
      case 'progress':
        result.sort((a, b) => {
          const progressA = a.target ? (a.progress / a.target) * 100 : 0
          const progressB = b.target ? (b.progress / b.target) * 100 : 0
          return progressB - progressA
        })
        break
      case 'alphabetical':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        break
      default:
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }

    return result
  }, [goals, filter, searchQuery, sortBy])

  if (loading) {
    return <PageLoading />
  }

  const handleFilterChange = (event, newFilter) => {
    setFilter(newFilter)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSortOpen = (event) => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleSortClose = (sort) => {
    if (sort) {
      setSortBy(sort)
    }
    setSortAnchorEl(null)
  }

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

  const handleEdit = (goalId) => {
    if (!goalId) return
    navigate(`/goals/${goalId}`)
  }

  const handlePause = (goalId, goalTitle, isPaused) => {
    if (!goalId) return
    togglePause(goalId)
    const newStatus = !isPaused
    showToast({
      title: newStatus ? '⏸ Goal Paused' : '▶️ Goal Resumed',
      message: `"${goalTitle || 'Goal'}" has been ${newStatus ? 'paused' : 'resumed'}.`,
      type: 'info'
    })
  }

  const handleDelete = (goalId, goalTitle) => {
    if (!goalId) return
    deleteGoal(goalId)
    showToast({
      title: '🗑️ Goal Deleted',
      message: `"${goalTitle || 'Goal'}" has been removed from your goals.`,
      type: 'info'
    })
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

  const filterTabs = [
    { value: 'all', label: t('goals.all') || 'All' },
    { value: 'active', label: t('goals.active') || 'Active' },
    { value: 'completed', label: t('goals.completed') || 'Completed' },
    { value: 'paused', label: t('goals.paused') || 'Paused' }
  ]

  const sortOptions = [
    { value: 'newest', label: t('goals.newest') || 'Newest First' },
    { value: 'oldest', label: t('goals.oldest') || 'Oldest First' },
    { value: 'progress', label: t('goals.progress') || 'Progress %' },
    { value: 'alphabetical', label: t('goals.alphabetical') || 'A-Z' }
  ]

  return (
    <Box sx={{ 
      p: { 
        xs: 1.5, 
        sm: 2, 
        md: 3 
      } 
    }}>
      <Box sx={{ mb: { xs: 2.5, sm: 3, md: 4 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          fontWeight="700" 
          gutterBottom
          sx={{ 
            fontSize: { 
              xs: '1.5rem', 
              sm: '1.75rem', 
              md: '2.125rem' 
            } 
          }}
        >
          {t('goals.title') || 'Goals'}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: { 
              xs: '0.875rem', 
              sm: '1rem' 
            } 
          }}
        >
          {t('goals.subtitle') || 'Manage and track all your goals'}
        </Typography>
      </Box>

      {/* فیلترها و جستجو و سورت */}
      <Box sx={{ mb: 3 }}>
        {/* تب‌های فیلتر - ریسپانسیو */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          mb: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 0,
            display: 'none'
          }
        }}>
          <Tabs 
            value={filter} 
            onChange={handleFilterChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 40, sm: 48 },
              '& .MuiTab-root': {
                minWidth: { xs: 'auto', sm: 100 },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                textTransform: 'capitalize'
              }
            }}
          >
            {filterTabs.map((tab) => (
              <Tab 
                key={tab.value} 
                value={tab.value} 
                label={tab.label} 
              />
            ))}
          </Tabs>
        </Box>

        {/* جستجو و دکمه‌ها */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
        >
          {/* باکس جستجو */}
          <TextField
            fullWidth={isMobile}
            size="small"
            placeholder={t('goals.search') || 'Search goals...'}
            value={searchQuery}
            onChange={handleSearch}
            sx={{ 
              maxWidth: { xs: '100%', sm: 300, md: 400 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.6)
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon name="Search" size={18} color="text.secondary" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    sx={{ p: 0.5 }}
                  >
                    <Icon name="Close" size={14} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* دکمه‌های سورت و اضافه کردن */}
          <Stack direction="row" spacing={1.5}>
            {/* دکمه سورت */}
            <Button
              variant="outlined"
              onClick={handleSortOpen}
              startIcon={<Icon name="Sort" size={18} />}
              sx={{ 
                borderRadius: 2.5,
                textTransform: 'none',
                px: 2
              }}
            >
              {isMobile ? '' : (t('goals.sort') || 'Sort')}
              {isMobile && <Icon name="Sort" size={18} />}
            </Button>

            {/* دکمه اضافه کردن */}
            <Button
              variant="contained"
              onClick={() => navigate('/goals/new')}
              startIcon={<Icon name="Add" size={18} />}
              sx={{ 
                borderRadius: 2.5,
                textTransform: 'none',
                px: 2.5,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              {isMobile ? '' : (t('goals.newGoal') || 'New Goal')}
              {isMobile && <Icon name="Add" size={18} />}
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* منوی سورت */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => handleSortClose()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        {sortOptions.map((option) => (
          <MenuItem 
            key={option.value}
            onClick={() => handleSortClose(option.value)}
            selected={sortBy === option.value}
            sx={{ 
              py: 1.2,
              gap: 1.5,
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="body2">{option.label}</Typography>
            {sortBy === option.value && (
              <Icon name="Check" size={16} color="primary" />
            )}
          </MenuItem>
        ))}
      </Menu>

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