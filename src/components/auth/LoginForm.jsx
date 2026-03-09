// import { useState } from 'react'
// import { Box, TextField, InputAdornment, IconButton, Checkbox, FormControlLabel, Link, Alert } from '@mui/material'
// import { useNavigate } from 'react-router-dom'
// import { useLanguage } from '../../hooks/useLanguage'
// import { useAuth } from '../../hooks/useAuth'
// import Button from '../ui/Button'
// import Icon from '../ui/Icon'
// import Typography from '../ui/Typography'

// export default function LoginForm() {
//   const navigate = useNavigate()
//   const { t } = useLanguage()
//   const { login } = useAuth()
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   })
  
//   const [showPassword, setShowPassword] = useState(false)
//   const [rememberMe, setRememberMe] = useState(false)
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//     if (error) setError('')
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')

//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields')
//       setLoading(false)
//       return
//     }

//     setTimeout(() => {
//       const result = login(formData.email, formData.password)
//       if (result.success) {
//         navigate('/')
//       } else {
//         setError('Invalid email or password')
//       }
//       setLoading(false)
//     }, 1000)
//   }

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//       {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

//       <TextField fullWidth name="email" type="email" placeholder={t('auth.enterEmail') || 'Enter your email'} value={formData.email} onChange={handleChange} sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8f9fa' } }} InputProps={{ startAdornment: (<InputAdornment position="start"><Icon name="Email" size={20} color="text.secondary" /></InputAdornment>) }} />

//       <TextField fullWidth name="password" type={showPassword ? 'text' : 'password'} placeholder={t('auth.enterPassword') || 'Enter your password'} value={formData.password} onChange={handleChange} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8f9fa' } }} InputProps={{ startAdornment: (<InputAdornment position="start"><Icon name="Lock" size={20} color="text.secondary" /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end"><Icon name={showPassword ? 'VisibilityOff' : 'Visibility'} size={20} /></IconButton></InputAdornment>) }} />

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />} label={t('auth.rememberMe') || 'Remember me'} />
//         <Link href="#" underline="hover" sx={{ color: 'primary.main', cursor: 'pointer' }}>{t('auth.forgotPassword') || 'Forgot Password?'}</Link>
//       </Box>

//       <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={loading} sx={{ py: 1.5, borderRadius: 2, fontSize: '1.1rem', mb: 3 }}>
//         {loading ? 'Please wait...' : (t('auth.signIn') || 'Sign In')}
//       </Button>

//       <Box sx={{ textAlign: 'center' }}>
//         <Typography variant="body2" color="text.secondary" display="inline">
//           {t('auth.noAccount') || "Don't have an account? "}
//         </Typography>
//         <Link href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }} underline="hover" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}>
//           {t('auth.createAccount') || 'Create account'}
//         </Link>
//       </Box>
//     </Box>
//   )
// }