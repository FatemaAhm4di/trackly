import { Box, CircularProgress, Typography, useTheme } from '@mui/material'

export default function CircularProgressWithLabel({ 
  value, 
  size = 120, 
  showLabel = true,
  thickness = 4
}) {
  const theme = useTheme()  // ✅ استفاده شده در getColor و sx
  
  // رنگ بر اساس درصد
  const getColor = () => {
    if (value < 30) return theme.palette.error.main
    if (value < 60) return theme.palette.warning.main
    if (value < 80) return theme.palette.info.main
    return theme.palette.success.main
  }

  const progressColor = getColor()

  return (
    <Box sx={{ 
      position: 'relative', 
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2
    }}>
      <Box sx={{ position: 'relative' }}>
        {/* پس زمینه خاکستری */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={thickness}
          sx={{ color: theme.palette.grey[200] }}  // ✅ theme اینجا استفاده شده
        />
        
        {/* پیشرفت رنگی */}
        <CircularProgress
          variant="determinate"
          value={value}
          size={size}
          thickness={thickness}
          sx={{
            position: 'absolute',
            left: 0,
            color: progressColor,
            '& circle': {
              strokeLinecap: 'round',
              transition: 'stroke-dashoffset 0.5s ease, color 0.3s ease'
            }
          }}
        />
        
        {/* نمایش درصد وسط */}
        {showLabel && (
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography 
              variant="h4" 
              component="div" 
              fontWeight="bold"
              sx={{ 
                color: progressColor,
                fontSize: size * 0.2,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {`${Math.round(value)}%`}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}