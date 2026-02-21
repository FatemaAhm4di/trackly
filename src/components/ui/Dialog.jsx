import { 
  Dialog as MuiDialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  DialogContentText
} from '@mui/material'
import Button from './Button'
import Typography from './Typography'

export default function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  ...props
}) {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...props}
    >
      {title && (
        <DialogTitle>
          <Typography variant="h6">{title}</Typography>
        </DialogTitle>
      )}
      <DialogContent>
        {typeof children === 'string' ? (
          <DialogContentText>{children}</DialogContentText>
        ) : (
          children
        )}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {actions}
        </DialogActions>
      )}
    </MuiDialog>
  )
}