// import { Box, TextField, InputAdornment, IconButton, Alert, Link } from '@mui/material'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'
// import AuthLayout from '../components/auth/AuthLayout'
// import Button from '../components/ui/Button'
// import Typography from '../components/ui/Typography'
// import Icon from '../components/ui/Icon'

// export default function Register() {
//   const navigate = useNavigate()
//   const { login } = useAuth()
  
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   })
  
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

//     setTimeout(() => {
//       login(formData.email, formData.password)
//       navigate('/')
//       setLoading(false)
//     }, 1000)
//   }

//   return (
//     <AuthLayout
//       title="Create Account"
//       subtitle="Join us to start your journey"
//     >
//       <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {/* نام کامل */}
//         <TextField
//           fullWidth
//           name="fullName"
//           placeholder="Full name"
//           value={formData.fullName}
//           onChange={handleChange}
//           sx={{
//             mb: 3,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 2,
//               bgcolor: 'background.default',
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'primary.main'
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'primary.main',
//                 borderWidth: 2
//               }
//             }
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Icon name="Person" size={20} color="primary.main" />
//               </InputAdornment>
//             )
//           }}
//         />

//         {/* ایمیل */}
//         <TextField
//           fullWidth
//           name="email"
//           type="email"
//           placeholder="Email address"
//           value={formData.email}
//           onChange={handleChange}
//           sx={{
//             mb: 3,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 2,
//               bgcolor: 'background.default',
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'primary.main'
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'primary.main',
//                 borderWidth: 2
//               }
//             }
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Icon name="Email" size={20} color="primary.main" />
//               </InputAdornment>
//             )
//           }}
//         />

//         {/* پسورد */}
//         <TextField
//           fullWidth
//           name="password"
//           type={showPassword ? 'text' : 'password'}
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           sx={{
//             mb: 3,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 2,
//               bgcolor: 'background.default',
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'primary.main'
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'primary.main',
//                 borderWidth: 2
//               }
//             }
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Icon name="Lock" size={20} color="primary.main" />
//               </InputAdornment>
//             ),
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   onClick={() => setShowPassword(!showPassword)}
//                   edge="end"
//                   sx={{ color: 'primary.main' }}
//                 >
//                   <Icon name={showPassword ? 'VisibilityOff' : 'Visibility'} size={20} />
//                 </IconButton>
//               </InputAdornment>
//             )
//           }}
//         />

//         {/* تایید پسورد */}
//         <TextField
//           fullWidth
//           name="confirmPassword"
//           type={showConfirmPassword ? 'text' : 'password'}
//           placeholder="Confirm password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           sx={{
//             mb: 4,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 2,
//               bgcolor: 'background.default',
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'primary.main'
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'primary.main',
//                 borderWidth: 2
//               }
//             }
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Icon name="Lock" size={20} color="primary.main" />
//               </InputAdornment>
//             ),
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   edge="end"
//                   sx={{ color: 'primary.main' }}
//                 >
//                   <Icon name={showConfirmPassword ? 'VisibilityOff' : 'Visibility'} size={20} />
//                 </IconButton>
//               </InputAdornment>
//             )
//           }}
//         />

//         {/* دکمه ثبت‌نام */}
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           size="large"
//           disabled={loading}
//           sx={{
//             py: 1.8,
//             borderRadius: 2,
//             fontSize: '1rem',
//             fontWeight: 600,
//             mb: 3,
//             boxShadow: '0 8px 16px rgba(54, 138, 199, 0.3)',
//             '&:hover': {
//               transform: 'translateY(-2px)',
//               boxShadow: '0 12px 24px rgba(54, 138, 199, 0.4)'
//             },
//             transition: 'all 0.3s ease'
//           }}
//         >
//           {loading ? 'Creating account...' : 'Create Account'}
//         </Button>

//         {/* لینک ورود */}
//         <Box sx={{ textAlign: 'center' }}>
//           <Typography variant="body2" color="text.secondary" display="inline">
//             Already have an account?{' '}
//           </Typography>
//           <Link
//             href="#"
//             underline="hover"
//             sx={{ 
//               color: 'primary.main', 
//               fontWeight: 600,
//               cursor: 'pointer',
//               transition: 'color 0.2s ease',
//               '&:hover': { color: 'primary.dark' }
//             }}
//             onClick={(e) => {
//               e.preventDefault()
//               navigate('/login')
//             }}
//           >
//             Sign in
//           </Link>
//         </Box>
//       </Box>
//     </AuthLayout>
//   )
// }