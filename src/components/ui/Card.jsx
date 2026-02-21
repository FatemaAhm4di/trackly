import { Card as MuiCard, CardContent, CardActions } from '@mui/material'

export default function Card({
  children,
  title,
  actions,
  sx = {},
  contentSx = {},
  ...props
}) {
  return (
    <MuiCard
      sx={{
        ...sx
      }}
      {...props}
    >
      {title && (
        <CardContent sx={{ pb: contentSx.pb || 2, ...contentSx }}>
          {title}
        </CardContent>
      )}
      {!title && typeof children !== 'object' && (
        <CardContent sx={contentSx}>
          {children}
        </CardContent>
      )}
      {!title && typeof children === 'object' && children}
      {actions && (
        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  )
}