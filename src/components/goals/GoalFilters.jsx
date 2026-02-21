import { Box, Tabs, Tab, InputAdornment } from '@mui/material'
import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage' // مسیر جدیدimport Icon from '../ui/Icon'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function GoalFilters({ 
  onFilterChange, 
  onSearch, 
  onSort,
  showAddButton = true,
  onAddClick 
}) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const handleFilterChange = (event, newValue) => {
    setFilter(newValue)
    onFilterChange(newValue)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch(value)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    onSort(value)
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Input
            placeholder={t('goals.search')}
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon name="Search" size={20} color="text.secondary" />
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        {showAddButton && (
          <Button
            variant="contained"
            color="primary"
            startIcon="Add"
            onClick={onAddClick}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {t('nav.newGoal')}
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Tabs 
          value={filter} 
          onChange={handleFilterChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minWidth: { xs: 'auto', sm: 120 }
            }
          }}
        >
          <Tab label={t('goals.all')} value="all" />
          <Tab label={t('goals.active')} value="active" />
          <Tab label={t('goals.completed')} value="completed" />
          <Tab label={t('goals.paused')} value="paused" />
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon name="Sort" size={20} color="text.secondary" />
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleSortChange(sortBy === 'newest' ? 'progress' : 'newest')}
            sx={{ textTransform: 'none' }}
          >
            {sortBy === 'newest' ? t('goals.newest') : t('goals.progress')}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}