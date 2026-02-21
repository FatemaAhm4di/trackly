import * as MuiIcons from '@mui/icons-material'

export default function Icon({ name, size = 24, color = 'inherit', sx = {} }) {
  const IconComponent = MuiIcons[name]
  
  if (!IconComponent) {
    return null
  }
  
  return (
    <IconComponent 
      sx={{ 
        fontSize: size, 
        color,
        ...sx 
      }} 
    />
  )
}