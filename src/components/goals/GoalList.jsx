// src/components/goals/GoalList.jsx
import { useMemo } from 'react';
import { Box } from '@mui/material';
import GoalCard from './GoalCard';

export default function GoalList({ 
  goals, 
  statusFilter, 
  searchQuery, 
  sortOption,
  onEdit,
  onPause,
  onDelete,
  onLog
}) {
  // فیلتر و جستجو
  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      if (statusFilter !== 'all' && goal.status !== statusFilter) return false;
      if (searchQuery && !goal.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [goals, statusFilter, searchQuery]);

  // مرتب‌سازی
  const sortedGoals = useMemo(() => {
    return [...filteredGoals].sort((a, b) => {
      switch (sortOption) {
        case 'progress': return b.progress - a.progress;
        case 'newest': return b.id - a.id;
        case 'category': return a.category.localeCompare(b.category);
        default: return 0;
      }
    });
  }, [filteredGoals, sortOption]);

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' },
      gap: 3,
      justifyContent: 'center'
    }}>
      {sortedGoals.length === 0 ? (
        <Box sx={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No goals match your filters.
        </Box>
      ) : (
        sortedGoals.map((goal) => (
          <GoalCard 
            key={goal.id}
            goal={goal} 
            onEdit={onEdit}
            onPause={onPause}
            onDelete={onDelete}
            onLog={onLog}
          />
        ))
      )}
    </Box>
  );
}