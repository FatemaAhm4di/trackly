// src/pages/Goals.jsx
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import GoalFilters from '../components/goals/GoalFilters';
import GoalList from '../components/goals/GoalList';

// داده‌های تستی — بعداً از localStorage می‌خونیم
const mockGoals = [
  {
    id: 1,
    title: "Read 20 pages daily",
    category: "Study",
    progress: 65,
    target: 30,
    completed: 19,
    type: "daily",
    status: "active"
  },
  {
    id: 2,
    title: "Workout 4 times/week",
    category: "Health",
    progress: 80,
    target: 5,
    completed: 4,
    type: "count",
    status: "active"
  },
  {
    id: 3,
    title: "Drink 2L water daily",
    category: "Health",
    progress: 100,
    target: 30,
    completed: 30,
    type: "daily",
    status: "completed"
  },
  {
    id: 4,
    title: "Meditate 10 min",
    category: "Personal",
    progress: 30,
    target: 30,
    completed: 9,
    type: "daily",
    status: "paused"
  }
];

export default function Goals() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('progress');

  // توابع مدیریت عملیات (فعلاً console.log — بعداً واقعی می‌شن)
  const handleEdit = (goal) => {
    console.log('Edit:', goal);
  };

  const handlePause = (goal) => {
    console.log(goal.status === 'active' ? 'Pause:' : 'Resume:', goal);
  };

  const handleDelete = (goal) => {
    console.log('Delete:', goal);
  };

  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 600, 
          color: '#054532', 
          mb: 4 
        }}
      >
        All Goals
      </Typography>

      <GoalFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      <GoalList
        goals={mockGoals}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        sortOption={sortOption}
        onEdit={handleEdit}
        onPause={handlePause}
        onDelete={handleDelete}
      />
    </Box>
  );
}