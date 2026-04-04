import { useState } from 'react'
import { Box, TextField, InputAdornment, IconButton, Alert, Link, Divider, alpha, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Typography from '../ui/Typography'

export default function LoginForm() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { login, loginWithGoogle, loginWithFacebook, loginWithGithub, loading } = useAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  // ✅ حذف localLoading - فقط از loading استفاده کن
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setError('')

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        setIsSubmitting(false)
        return
      }

      const result = await login(formData.email, formData.password)

      if (result?.success) {
        navigate('/dashboard')
      } else {
        let errorMessage = result?.error || 'Login failed'
        
        if (errorMessage.includes('user-not-found')) {
          errorMessage = 'No account found with this email. Please sign up first.'
        } else if (errorMessage.includes('wrong-password')) {
          errorMessage = 'Incorrect password. Please try again.'
        } else if (errorMessage.includes('invalid-email')) {
          errorMessage = 'Please enter a valid email address.'
        } else if (errorMessage.includes('too-many-requests')) {
          errorMessage = 'Too many failed attempts. Please try again later.'
        } else {
          errorMessage = 'Login failed. Please try again.'
        }
        
        setError(errorMessage)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setError('')
    let result

    try {
      if (provider === 'google') result = await loginWithGoogle()
      if (provider === 'facebook') result = await loginWithFacebook()
      if (provider === 'github') result = await loginWithGithub()

      if (result?.success) {
        navigate('/dashboard')
      } else {
        setError(result?.error || 'Social login failed')
      }
    } catch (err) {
      console.error('Social login error:', err)
      setError('Social login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle = {
    mb: 3,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      transition: 'all .25s ease',
      '&:hover': { transform: 'translateY(-1px)' },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(54,138,199,0.15)'
      }
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        name="email"
        type="email"
        placeholder="Email address"
        value={formData.email}
        onChange={handleChange}
        sx={inputStyle}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon name="Email" size={20} color="primary.main" />
            </InputAdornment>
          )
        }}
      />

      <TextField
        fullWidth
        name="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        sx={{ ...inputStyle, mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon name="Lock" size={20} color="primary.main" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Icon name={showPassword ? 'VisibilityOff' : 'Visibility'} size={20} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Link 
          href="#" 
          underline="hover" 
          color="text.secondary"
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          Forgot password?
        </Link>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isSubmitting || loading}
        sx={{
          py: 1.8,
          borderRadius: 2,
          fontWeight: 700,
          fontSize: '1rem',
          background: 'linear-gradient(135deg, #2c7ab1 0%, #368ac7 100%)',
          boxShadow: '0 10px 20px rgba(54, 138, 199, 0.35)',
          transition: 'all .25s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 16px 28px rgba(54, 138, 199, 0.45)'
          }
        }}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Or continue with
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <IconButton 
          onClick={() => handleSocialLogin('google')} 
          disabled={isSubmitting}
          sx={{ 
            flex: 1, 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 2,
            py: 1,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderColor: 'primary.main'
            }
          }}
        >
          <Icon name="Google" size={24} />
        </IconButton>

        <IconButton 
          onClick={() => handleSocialLogin('facebook')} 
          disabled={isSubmitting}
          sx={{ 
            flex: 1, 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 2,
            py: 1,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderColor: 'primary.main'
            }
          }}
        >
          <Icon name="Facebook" size={24} />
        </IconButton>

        <IconButton 
          onClick={() => handleSocialLogin('github')} 
          disabled={isSubmitting}
          sx={{ 
            flex: 1, 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 2,
            py: 1,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderColor: 'primary.main'
            }
          }}
        >
          <Icon name="GitHub" size={24} />
        </IconButton>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary" display="inline">
          Don't have an account?{' '}
        </Typography>

        <Link
          href="#"
          underline="hover"
          color="primary"
          sx={{ fontWeight: 600, cursor: 'pointer' }}
          onClick={(e) => {
            e.preventDefault()
            navigate('/register')
          }}
        >
          Create account
        </Link>
      </Box>

    </Box>
  )
}