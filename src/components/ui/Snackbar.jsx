import { Snackbar as MuiSnackbar, Alert } from '@mui/material'

export default function Snackbar({ 
  open, 
  message, 
  severity = 'success', 
  onClose, 
  duration = 3000 
}) {
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity}
        variant="filled"
        sx={{ 
          width: '100%',
          borderRadius: 2,
          fontWeight: 600
        }}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  )
}