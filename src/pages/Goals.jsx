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
  const { t } = useLanguage()
  const { showToast } = useToast()
  const { goals, addProgress, deleteGoal, togglePause } = useGoalService()
  
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [sortAnchorEl, setSortAnchorEl] = useState(null)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const filteredGoals = useMemo(() => {
    if (!goals?.length) return []
    let result = [...goals]
    if (filter !== 'all') result = result.filter(g => g?.status === filter)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(g => g?.title?.toLowerCase().includes(q))
    }
    const sorters = {
      newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      oldest: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      progress: (a, b) => {
        const progA = a.target ? (a.progress / a.target) * 100 : 0
        const progB = b.target ? (b.progress / b.target) * 100 : 0
        return progB - progA
      },
      alphabetical: (a, b) => (a.title || '').localeCompare(b.title || '')
    }
    result.sort(sorters[sortBy] || sorters.newest)
    return result
  }, [goals, filter, searchQuery, sortBy])

  if (loading) return <PageLoading />

  const handleProgress = (id, title) => {
    const result = addProgress(id)
    if (!result?.success) {
      if (result?.error === 'DAILY_LIMIT') showToast({ title: '⚠️ Limit Reached', message: result.message || 'Once per 24 hours.', type: 'warning' })
      else showToast({ title: '❌ Failed', message: result?.message || 'Could not add progress.', type: 'error' })
    } else showToast({ title: '📈 Progress Added!', message: `+1 added to "${title || 'your goal'}"`, type: 'success' })
  }

  const handlePause = (id, title, isPaused) => {
    togglePause(id)
    showToast({ title: isPaused ? '▶️ Goal Resumed' : '⏸ Goal Paused', message: `"${title}" has been ${isPaused ? 'resumed' : 'paused'}.`, type: 'info' })
  }

  const handleDelete = (id, title) => {
    deleteGoal(id)
    showToast({ title: '🗑️ Goal Deleted', message: `"${title}" removed.`, type: 'info' })
  }

  const filterTabs = [
    { value: 'all', label: t('goals.all') || 'All' },
    { value: 'active', label: t('goals.active') || 'Active' },
    { value: 'completed', label: t('goals.completed') || 'Completed' },
    { value: 'paused', label: t('goals.paused') || 'Paused' }
  ]
  const sortOptions = [
    { value: 'newest', label: t('goals.newest') || 'Newest' },
    { value: 'oldest', label: t('goals.oldest') || 'Oldest' },
    { value: 'progress', label: t('goals.progress') || 'Progress %' },
    { value: 'alphabetical', label: t('goals.alphabetical') || 'A-Z' }
  ]

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ mb: { xs: 2.5, sm: 3, md: 4 } }}>
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight="700" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}>{t('goals.title') || 'Goals'}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{t('goals.subtitle') || 'Manage and track all your goals'}</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Tabs value={filter} onChange={(e, v) => setFilter(v)} variant={isMobile ? "scrollable" : "standard"} scrollButtons={isMobile ? "auto" : false} sx={{ minHeight: { xs: 40, sm: 48 }, '& .MuiTab-root': { minWidth: { xs: 'auto', sm: 100 }, px: { xs: 2, sm: 3 }, fontSize: { xs: '0.875rem', sm: '0.9rem' }, textTransform: 'capitalize' } }}>
            {filterTabs.map(tab => <Tab key={tab.value} value={tab.value} label={tab.label} />)}
          </Tabs>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <TextField fullWidth={isMobile} size="small" placeholder={t('goals.search') || 'Search goals...'} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} sx={{ maxWidth: { xs: '100%', sm: 300, md: 400 }, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: alpha(theme.palette.background.paper, 0.6) } }} InputProps={{
            startAdornment: <InputAdornment position="start"><Icon name="Search" size={18} color="text.secondary" /></InputAdornment>,
            endAdornment: searchQuery && <InputAdornment position="end"><IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.5 }}><Icon name="Close" size={14} /></IconButton></InputAdornment>
          }} />
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" onClick={e => setSortAnchorEl(e.currentTarget)} startIcon={<Icon name="Sort" size={18} />} sx={{ borderRadius: 2.5, textTransform: 'none', px: 2 }}>{isMobile ? '' : (t('goals.sort') || 'Sort')}{isMobile && <Icon name="Sort" size={18} />}</Button>
            <Button variant="contained" onClick={() => navigate('/goals/new')} startIcon={<Icon name="Add" size={18} />} sx={{ borderRadius: 2.5, textTransform: 'none', px: 2.5 }}>{isMobile ? '' : (t('goals.newGoal') || 'New Goal')}{isMobile && <Icon name="Add" size={18} />}</Button>
          </Stack>
        </Stack>
      </Box>

      <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={() => setSortAnchorEl(null)} PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2.5 } }}>
        {sortOptions.map(opt => <MenuItem key={opt.value} onClick={() => { setSortBy(opt.value); setSortAnchorEl(null) }} selected={sortBy === opt.value} sx={{ py: 1.2, justifyContent: 'space-between' }}><Typography variant="body2">{opt.label}</Typography>{sortBy === opt.value && <Icon name="Check" size={16} color="primary" />}</MenuItem>)}
      </Menu>

      <GoalList goals={filteredGoals} onProgress={handleProgress} onEdit={id => navigate(`/goals/${id}`)} onPause={handlePause} onDelete={handleDelete} compact={isMobile} emptyMessage={searchQuery ? (t('goals.noGoals') || 'No goals found') : filter !== 'all' ? (t(`goals.${filter}Empty`) || `No ${filter} goals found`) : (t('goals.noGoals') || 'No goals yet. Create your first goal!')} />
    </Box>
  )
}