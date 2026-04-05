import { createContext, useContext, useState, useCallback } from 'react'
import { Snackbar, Alert, Slide } from '@mui/material'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success') // success, error, warning, info
  const [title, setTitle] = useState('')

  const showToast = useCallback(({ title, message, type = 'success', duration = 3000 }) => {
    setTitle(title || (type === 'success' ? '✅ Success' : type === 'error' ? '❌ Error' : type === 'warning' ? '⚠️ Warning' : 'ℹ️ Info'))
    setMessage(message)
    setSeverity(type)
    setOpen(true)
    
    setTimeout(() => {
      setOpen(false)
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
        sx={{ mt: 8 }}
      >
        <Alert 
          severity={severity} 
          variant="filled"
          sx={{ 
            width: '100%', 
            minWidth: 300,
            borderRadius: 2,
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            '& .MuiAlert-icon': { fontSize: 24 }
          }}
        >
          <strong>{title}</strong>
          <br />
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}