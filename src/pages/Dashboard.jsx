// src/pages/Dashboard.jsx
import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

// داده‌های تستی
const mockActiveGoals = [
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
  }
];

const mockCompletedGoals = [
  { id: 3, title: "Drink 2L water daily", category: "Health" },
  { id: 4, title: "Meditate 10 min", category: "Personal" }
];

export default function Dashboard() {
  const [stats] = useState({
    overallProgress: 72,
    completedCount: 12,
    streak: 8,
    xp: 1420
  });

  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      {/* عنوان اصلی */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 600, 
          color: '#054532', 
          mb: 4 
        }}
      >
        Your Progress
      </Typography>

      {/* Top Summary Cards — با Box به جای Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        <Card sx={{ bgcolor: '#f8faf9', py: 2, px: 1.5 }}>
          <Typography variant="body2" color="text.secondary">Overall</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{stats.overallProgress}%</Typography>
        </Card>
        <Card sx={{ bgcolor: '#f8faf9', py: 2, px: .5 }}>
          <Typography variant="body2" color="text.secondary">Completed</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{stats.completedCount}</Typography>
        </Card>
        <Card sx={{ bgcolor: '#f8faf9', py: 2, px: 1.5 }}>
          <Typography variant="body2" color="text.secondary">Streak</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <CalendarIcon fontSize="small" sx={{ color: '#589a84' }} /> {stats.streak}
          </Typography>
        </Card>
        <Card sx={{ bgcolor: '#f8faf9', py: 2, px: 1.5 }}>
          <Typography variant="body2" color="text.secondary">XP</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <StarIcon fontSize="small" sx={{ color: '#FFC107' }} /> {stats.xp}
          </Typography>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 5, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ 
            bgcolor: '#054532', 
            '&:hover': { bgcolor: '#043729' },
            borderRadius: '10px',
            px: 2.5
          }}
        >
          + New Goal
        </Button>
        <Button 
          variant="outlined" 
          sx={{ 
            borderColor: '#054532', 
            color: '#054532',
            borderRadius: '10px',
            px: 2.5
          }}
        >
          View All Goals
        </Button>
      </Box>

      {/* Active Goals Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Active Goals
        </Typography>

        {mockActiveGoals.length === 0 ? (
          <Card sx={{ p: 5, maxWidth: 500, margin: '0 auto', bgcolor: '#f8faf9' }}>
            <TrendingUpIcon sx={{ fontSize: 56, color: '#589a84', opacity: 0.6, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>No active goals yet</Typography>
            <Typography color="text.secondary">
              Start by creating your first goal!
            </Typography>
          </Card>
        ) : (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' },
            gap: 3,
            justifyContent: 'center'
          }}>
            {mockActiveGoals.map((goal) => (
              <Card key={goal.id} sx={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(5, 69, 50, 0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(5, 69, 50, 0.1)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'left', flex: 1 }}>
                      {goal.title}
                    </Typography>
                    <Chip 
                      label={goal.category} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#589a8415', 
                        color: '#589a84', 
                        fontWeight: 500,
                        height: '24px'
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ my: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={goal.progress} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: '#e0f2e9',
                        '& .MuiLinearProgress-bar': { bgcolor: '#054532' }
                      }} 
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {goal.type === 'daily' ? `${goal.completed}/${goal.target} days` : `${goal.completed}/${goal.target} sessions`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">{goal.progress}%</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 2 }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      sx={{ 
                        bgcolor: '#054532', 
                        flex: 1,
                        borderRadius: '8px'
                      }}
                    >
                      ✅ Log
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      sx={{ 
                        borderColor: '#054532', 
                        color: '#054532',
                        flex: 1,
                        borderRadius: '8px'
                      }}
                    >
                      ✏️ Edit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Completed Goals Preview */}
      {mockCompletedGoals.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Recently Completed
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {mockCompletedGoals.map((goal) => (
              <Chip 
                key={goal.id}
                label={`${goal.title} • ${goal.category}`} 
                size="medium"
                sx={{ 
                  bgcolor: '#e8f5e9', 
                  color: '#054532',
                  fontWeight: 500,
                  borderRadius: '8px',
                  px: 1.5
                }} 
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}