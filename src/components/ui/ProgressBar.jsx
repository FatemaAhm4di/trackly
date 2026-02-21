import { LinearProgress, Box } from '@mui/material'
import Typography from './Typography'

export default function ProgressBar({
  value,
  color = 'primary',
  showLabel = true,
  size = 'medium',
  sx = {},
  ...props
}) {
  const height = size === 'small' ? 6 : size === 'medium' ? 10 : 16
  
  return (
    <Box sx={{ width: '100%', ...sx }} {...props}>
      {showLabel && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Progress
          </Typography>
          <Typography variant="caption" fontWeight="600" color={color}>
            {Math.round(value)}%
          </Typography>
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{
          height,
          borderRadius: height / 2,
          backgroundColor: 'rgba(54, 138, 199, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2
          }
        }}
      />
    </Box>
  )
}