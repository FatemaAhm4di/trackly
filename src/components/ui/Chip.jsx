import { Chip as MuiChip } from '@mui/material'

export default function Chip({
  label,
  color = 'default',
  size = 'medium',
  icon,
  onDelete,
  onClick,
  sx = {},
  ...props
}) {
  return (
    <MuiChip
      label={label}
      color={color}
      size={size}
      icon={icon}
      onDelete={onDelete}
      onClick={onClick}
      sx={{
        fontWeight: 500,
        ...sx
      }}
      {...props}
    />
  )
}