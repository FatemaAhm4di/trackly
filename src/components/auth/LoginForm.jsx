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
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [localLoading, setLocalLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
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
    switch(provider) {
      case 'google':
        result = await loginWithGoogle()
        break
      case 'facebook':
        result = await loginWithFacebook()
        break
      case 'github':
        result = await loginWithGithub()
        break
    }
    
    if (result?.success) {
      navigate('/')
    } else {
      setError(result?.error || 'Login failed')
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
        sx={{ mb: 3 }}
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
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon name="Lock" size={20} />
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
        <Link href="#" underline="hover" color="text.secondary">
          Forgot password?
        </Link>
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={localLoading || loading}
        sx={{ py: 1.8, borderRadius: 2, mb: 3 }}
      >
        {localLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <Divider sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Or continue with
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <IconButton
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            color: '#DB4437',
            '&:hover': {
              borderColor: '#DB4437',
              bgcolor: 'rgba(219, 68, 55, 0.04)'
            }
          }}
        >
          <Icon name="Google" size={24} />
        </IconButton>

        <IconButton
          onClick={() => handleSocialLogin('facebook')}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            color: '#1877F2',
            '&:hover': {
              borderColor: '#1877F2',
              bgcolor: 'rgba(24, 119, 242, 0.04)'
            }
          }}
        >
          <Icon name="Facebook" size={24} />
        </IconButton>

        <IconButton
          onClick={() => handleSocialLogin('github')}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            color: '#333',
            '&:hover': {
              borderColor: '#333',
              bgcolor: 'rgba(51, 51, 51, 0.04)'
            }
          }}
        >
          <Icon name="GitHub" size={24} />
        </IconButton>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
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