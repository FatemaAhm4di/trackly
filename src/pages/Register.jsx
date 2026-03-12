import { Box, TextField, InputAdornment, IconButton, Alert, Link } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/auth/AuthLayout'
import Button from '../components/ui/Button'
import Typography from '../components/ui/Typography'
import Icon from '../components/ui/Icon'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

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

    setTimeout(() => {
      login(formData.email, formData.password)
      navigate('/')
      setLoading(false)
    }, 1000)
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
          placeholder="Password"
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
                <IconButton onClick={() => setShowPassword(!showPassword)}>
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
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
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
            background: 'linear-gradient(135deg,#2c7ab1 0%,#368ac7 100%)',
            boxShadow: '0 10px 20px rgba(54,138,199,0.35)',
            transition: 'all .25s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 16px 28px rgba(54,138,199,0.45)'
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
            sx={{ color: 'primary.main', fontWeight: 600 }}
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