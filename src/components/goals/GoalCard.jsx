// src/components/goals/GoalCard.jsx
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Box,
} from '@mui/material';
import { Edit as EditIcon, Pause as PauseIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function GoalCard({ 
  goal, 
  onEdit, 
  onPause, 
  onDelete, 
  onLog // ✅ اضافه شد
}) {
  return (
    <Card sx={{ 
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(5, 69, 50, 0.05)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(5, 69, 50, 0.1)'
      }
    }}>
      <CardContent>
        {/* عنوان + دسته‌بندی */}
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

        {/* پیشرفت */}
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
              {goal.type === 'daily' 
                ? `${goal.completed}/${goal.target} days` 
                : goal.type === 'count' 
                  ? `${goal.completed}/${goal.target} sessions`
                  : `${goal.completed}/${goal.target} min`}
            </Typography>
            <Typography variant="body2" color="text.secondary">{goal.progress}%</Typography>
          </Box>
        </Box>

        {/* وضعیت */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
          <Chip 
            label={goal.status === 'active' ? 'Active' : goal.status === 'paused' ? 'Paused' : 'Completed'}
            size="small"
            sx={{
              bgcolor: goal.status === 'active' ? '#e8f5e9' : 
                      goal.status === 'paused' ? '#fff8e1' : '#f1f8e9',
              color: goal.status === 'active' ? '#054532' : 
                     goal.status === 'paused' ? '#FF8F00' : '#388E3C',
              fontWeight: 500,
              height: '24px'
            }}
          />
        </Box>

        {/* دکمه‌ها */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button 
            size="small" 
            startIcon={<EditIcon />}
            onClick={() => onEdit(goal)}
            sx={{ 
              borderColor: '#054532', 
              color: '#054532',
              borderRadius: '8px'
            }}
            variant="outlined"
          >
            Edit
          </Button>
          <Button 
            size="small" 
            startIcon={<PauseIcon />}
            onClick={() => onPause(goal)}
            sx={{ 
              borderColor: '#FF8F00', 
              color: '#FF8F00',
              borderRadius: '8px'
            }}
            variant="outlined"
          >
            {goal.status === 'active' ? 'Pause' : 'Resume'}
          </Button>
          <Button 
            size="small" 
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(goal)}
            sx={{ 
              borderColor: '#f44336', 
              color: '#f44336',
              borderRadius: '8px'
            }}
            variant="outlined"
          >
            Delete
          </Button>
          {/* دکمه Log — حالا کار می‌کنه! */}
          <Button 
            size="small" 
            onClick={() => onLog(goal)} // ✅ اتصال به onLog
            sx={{ 
              bgcolor: '#054532', 
              color: 'white',
              borderRadius: '8px',
              '&:hover': { bgcolor: '#043729' }
            }}
          >
            ✅ Log
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}