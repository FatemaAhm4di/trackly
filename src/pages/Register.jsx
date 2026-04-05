import { Box, TextField, InputAdornment, IconButton, Alert, Link, alpha } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import AuthLayout from '../components/auth/AuthLayout'
import Button from '../components/ui/Button'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'

export default function Register() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { register, user } = useAuth()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // اعتبارسنجی
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const result = await register(formData.email, formData.password, formData.fullName)
      
      if (result?.success) {
        showToast({
          title: '🎉 Account Created!',
          message: `Welcome to Trackly, ${formData.fullName}! Start tracking your first goal.`,
          type: 'success'
        })
        navigate('/dashboard')
      } else {
        let errorMessage = result?.error || 'Registration failed'
        
        if (errorMessage.includes('email-already-in-use')) {
          errorMessage = 'This email is already registered. Please login instead.'
        } else if (errorMessage.includes('weak-password')) {
          errorMessage = 'Password should be at least 6 characters.'
        } else if (errorMessage.includes('invalid-email')) {
          errorMessage = 'Please enter a valid email address.'
        } else if (errorMessage.includes('network-request-failed')) {
          errorMessage = 'Network error. Please check your internet connection.'
        } else {
          errorMessage = 'Registration failed. Please try again.'
        }
        
        setError(errorMessage)
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    mb: 3,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      bgcolor: 'background.default',
      transition: 'all .25s ease',
      '&:hover': { transform: 'translateY(-1px)' },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(54,138,199,0.15)'
      }
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Trackly and start achieving your goals."
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          name="fullName"
          placeholder="Full name"
          value={formData.fullName}
          onChange={handleChange}
          sx={inputStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon name="Person" size={20} color="primary.main" />
              </InputAdornment>
            )
          }}
        />

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
          placeholder="Password (min. 6 characters)"
          value={formData.password}
          onChange={handleChange}
          sx={inputStyle}
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

        <TextField
          fullWidth
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          sx={{ ...inputStyle, mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon name="Lock" size={20} color="primary.main" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Icon name={showConfirmPassword ? 'VisibilityOff' : 'Visibility'} size={20} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
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
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary" display="inline">
            Already have an account?{' '}
          </Typography>

          <Link
            href="#"
            underline="hover"
            sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault()
              navigate('/login')
            }}
          >
            Sign in
          </Link>
        </Box>

      </Box>
    </AuthLayout>
  )
}