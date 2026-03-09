// import { Box, TextField, Link, Alert } from '@mui/material'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useLanguage } from '../hooks/useLanguage'
// import { useAuth } from '../hooks/useAuth'  // ✅ اصلاح مسیر
// import AuthLayout from '../components/auth/AuthLayout'
// import Button from '../components/ui/Button'
// import Typography from '../components/ui/Typography'

// export default function Register() {
//   const navigate = useNavigate()
//   const { t } = useLanguage()
//   const { login } = useAuth()  // ✅ از useAuth استفاده کن
  
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   })
  
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

//     // اعتبارسنجی
//     if (!formData.fullName || !formData.email || !formData.password) {
//       setError('Please fill in all fields')
//       setLoading(false)
//       return
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match')
//       setLoading(false)
//       return
//     }

//     // شبیه‌سازی ثبت‌نام
//     setTimeout(() => {
//       login(formData.email, formData.password)
//       navigate('/')
//       setLoading(false)
//     }, 1000)
//   }

//   return (
//     <AuthLayout
//       title="Create Account"
//       subtitle="Join us today"
//     >
//       <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

//         <TextField
//           fullWidth
//           name="fullName"
//           placeholder="Full Name"
//           value={formData.fullName}
//           onChange={handleChange}
//           sx={{
//             mb: 3,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 2,
//               backgroundColor: '#f8f9fa'
//             }
//           }}
//         />

//         <TextField
//           fullWidth
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           sx={{
//             mb: 3,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 2,
//               backgroundColor: '#f8f9fa'
//             }
//           }}
//         />

//         <TextField
//           fullWidth
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           sx={{
//             mb: 3,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 2,
//               backgroundColor: '#f8f9fa'
//             }
//           }}
//         />

//         <TextField
//           fullWidth
//           name="confirmPassword"
//           type="password"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           sx={{
//             mb: 4,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 2,
//               backgroundColor: '#f8f9fa'
//             }
//           }}
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           size="large"
//           disabled={loading}
//           sx={{
//             py: 1.5,
//             borderRadius: 2,
//             fontSize: '1.1rem',
//             mb: 3
//           }}
//         >
//           {loading ? 'Please wait...' : (t('auth.signUp') || 'Sign Up')}
//         </Button>

//         <Box sx={{ textAlign: 'center' }}>
//           <Typography variant="body2" color="text.secondary" display="inline">
//             {t('auth.hasAccount') || 'Already have an account? '}
//           </Typography>
//           <Link
//             href="#"
//             onClick={(e) => { e.preventDefault(); navigate('/login'); }}
//             underline="hover"
//             sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
//           >
//             {t('auth.signIn') || 'Sign In'}
//           </Link>
//         </Box>
//       </Box>
//     </AuthLayout>
//   )
// }