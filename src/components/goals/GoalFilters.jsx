import { Box, Tabs, Tab, InputAdornment } from '@mui/material'
import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage' 
import Input from '../ui/Input'
import Button from '../ui/Button'
import Icon from '../ui/Icon' // این خط اضافه شد

export default function GoalFilters({ 
  filter: externalFilter, // دریافت filter از والد
  searchValue: externalSearchValue, // دریافت search از والد
  sortValue: externalSortValue, // دریافت sort از والد
  onFilterChange, 
  onSearch, 
  onSort,
  showAddButton = true,
  onAddClick 
}) {
  const { t } = useLanguage()
  
  // استفاده از props به جای state داخلی برای هماهنگی با والد
  const [filter, setFilter] = useState(externalFilter || 'all')
  const [searchQuery, setSearchQuery] = useState(externalSearchValue || '')
  const [sortBy, setSortBy] = useState(externalSortValue || 'newest')

  // آپدیت state داخلی وقتی props تغییر میکنه
  useState(() => {
    if (externalFilter !== undefined) {
      setFilter(externalFilter)
    }
    if (externalSearchValue !== undefined) {
      setSearchQuery(externalSearchValue)
    }
    if (externalSortValue !== undefined) {
      setSortBy(externalSortValue)
    }
  }, [externalFilter, externalSearchValue, externalSortValue])

  const handleFilterChange = (event, newValue) => {
    setFilter(newValue)
    if (onFilterChange) {
      onFilterChange(newValue)
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleSortChange = () => {
    const newSort = sortBy === 'newest' ? 'progress' : 'newest'
    setSortBy(newSort)
    if (onSort) {
      onSort(newSort)
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Input
            placeholder={t('goals.search') || 'Search goals...'}
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon name="Search" size={20} />
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        {showAddButton && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon name="Add" size={20} />}
            onClick={onAddClick}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {t('nav.newGoal') || 'New Goal'}
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
          <Tab label={t('goals.all') || 'All'} value="all" />
          <Tab label={t('goals.active') || 'Active'} value="active" />
          <Tab label={t('goals.completed') || 'Completed'} value="completed" />
          <Tab label={t('goals.paused') || 'Paused'} value="paused" />
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon name="Sort" size={20} />
          <Button
            variant="outlined"
            size="small"
            onClick={handleSortChange}
            sx={{ textTransform: 'none' }}
          >
            {sortBy === 'newest' 
              ? (t('goals.newest') || 'Newest') 
              : (t('goals.progress') || 'Progress')}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}