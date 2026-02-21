import { Typography as MuiTypography } from '@mui/material'

export default function Typography({ 
  variant = 'body1', 
  children, 
  color = 'text.primary',
  align = 'inherit',
  gutterBottom = false,
  sx = {},
  ...props 
}) {
  return (
    <MuiTypography
      variant={variant}
      color={color}
      align={align}
      gutterBottom={gutterBottom}
      sx={{
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  )
}