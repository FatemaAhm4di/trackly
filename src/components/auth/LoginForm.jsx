import { useState } from 'react'
import { Box, TextField, InputAdornment, IconButton, Alert, Link, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Typography from '../ui/Typography'

export default function LoginForm() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, loginWithFacebook, loginWithGithub, loading } = useAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [localLoading, setLocalLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalLoading(true)
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLocalLoading(false)
      return
    }

    const result = login(formData.email, formData.password)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }

    setLocalLoading(false)
  }

  const handleSocialLogin = async (provider) => {
    let result

    if (provider === 'google') result = await loginWithGoogle()
    if (provider === 'facebook') result = await loginWithFacebook()
    if (provider === 'github') result = await loginWithGithub()

    if (result?.success) navigate('/')
    else setError(result?.error || 'Login failed')
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

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
              <Icon name="Email" size={20} />
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
              <Icon name="Lock" size={20} />
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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Link href="#" underline="hover" color="text.secondary">
          Forgot password?
        </Link>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={localLoading || loading}
        sx={{
          py: 1.8,
          borderRadius: 2,
          fontWeight: 700,
          background: 'linear-gradient(135deg,#2c7ab1 0%,#368ac7 100%)',
          boxShadow: '0 10px 20px rgba(54,138,199,0.35)',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 16px 28px rgba(54,138,199,0.45)'
          }
        }}
      >
        {localLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Or continue with
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <IconButton onClick={() => handleSocialLogin('google')} sx={{ flex: 1 }}>
          <Icon name="Google" size={24} />
        </IconButton>

        <IconButton onClick={() => handleSocialLogin('facebook')} sx={{ flex: 1 }}>
          <Icon name="Facebook" size={24} />
        </IconButton>

        <IconButton onClick={() => handleSocialLogin('github')} sx={{ flex: 1 }}>
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
          sx={{ fontWeight: 600 }}
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