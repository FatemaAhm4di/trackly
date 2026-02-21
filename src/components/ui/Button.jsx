import { Button as MuiButton } from '@mui/material'
import Icon from './Icon'

export default function Button({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  iconSize = 20,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  sx = {},
  ...props
}) {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      startIcon={startIcon && <Icon name={startIcon} size={iconSize} />}
      endIcon={endIcon && <Icon name={endIcon} size={iconSize} />}
      sx={{
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiButton>
  )
}