// import { Box, Card, CardContent, Avatar, TextField, Button, IconButton, Alert, alpha, useTheme } from '@mui/material'
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'
// import { useLanguage } from '../hooks/useLanguage'
// import Typography from '../components/ui/Typography'
// import Icon from '../components/ui/Icon'
// import { PageLoading } from '../components/ui/Loading'

// export default function Profile() {
//   const navigate = useNavigate()
//   const theme = useTheme()
//   const { user, updateUserProfile, logout } = useAuth()
//   const { t } = useLanguage()
  
//   const [loading, setLoading] = useState(false)
//   const [editMode, setEditMode] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     avatar: ''
//   })
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || '',
//         email: user.email || '',
//         avatar: user.avatar || ''
//       })
//     }
//   }, [user])

//   if (!user) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
//         <Card sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
//           <Icon name="PersonOff" size={64} color="text.disabled" />
//           <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
//             Not logged in
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//             Please login to view your profile
//           </Typography>
//           <Button variant="contained" onClick={() => navigate('/login')}>
//             Go to Login
//           </Button>
//         </Card>
//       </Box>
//     )
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//     if (error) setError('')
//     if (success) setSuccess('')
//   }

//   const handleSave = async () => {
//     if (!formData.name.trim()) {
//       setError('Name cannot be empty')
//       return
//     }

//     setLoading(true)
//     setError('')
//     setSuccess('')

//     try {
//       const result = await updateUserProfile({
//         name: formData.name,
//         avatar: formData.avatar
//       })

//       if (result.success) {
//         setSuccess('Profile updated successfully!')
//         setEditMode(false)
//       } else {
//         setError(result.error || 'Failed to update profile')
//       }
//     } catch (err) {
//       setError('An error occurred')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCancel = () => {
//     setFormData({
//       name: user.name || '',
//       email: user.email || '',
//       avatar: user.avatar || ''
//     })
//     setEditMode(false)
//     setError('')
//     setSuccess('')
//   }

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   return (
//     <Box sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
//       <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        
//         {/* Header */}
//         <Box sx={{ mb: 4, textAlign: 'center' }}>
//           <Typography variant="h4" fontWeight="700" gutterBottom>
//             {t('profile.title') || 'My Profile'}
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             {t('profile.subtitle') || 'View and manage your profile information'}
//           </Typography>
//         </Box>

//         {/* Profile Card */}
//         <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
//           <Box sx={{ 
//             p: 3, 
//             bgcolor: alpha(theme.palette.primary.main, 0.05),
//             borderBottom: 1,
//             borderColor: 'divider'
//           }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <Avatar 
//                 src={formData.avatar} 
//                 sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}
//               >
//                 {!formData.avatar && (formData.name?.charAt(0) || 'U')}
//               </Avatar>
//               <Box>
//                 <Typography variant="h5" fontWeight="600">
//                   {formData.name || 'User'}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {formData.email}
//                 </Typography>
//                 <Typography variant="caption" color="primary.main">
//                   Member since 2026
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>

//           <CardContent sx={{ p: 3 }}>
//             {error && (
//               <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//                 {error}
//               </Alert>
//             )}
            
//             {success && (
//               <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
//                 {success}
//               </Alert>
//             )}

//             <TextField
//               fullWidth
//               name="name"
//               label={t('profile.fullName') || 'Full Name'}
//               value={formData.name}
//               onChange={handleChange}
//               disabled={!editMode}
//               sx={{ mb: 3 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Icon name="Person" size={20} color="text.secondary" />
//                   </InputAdornment>
//                 )
//               }}
//             />

//             <TextField
//               fullWidth
//               name="email"
//               label={t('profile.email') || 'Email Address'}
//               value={formData.email}
//               disabled
//               sx={{ mb: 3 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Icon name="Email" size={20} color="text.secondary" />
//                   </InputAdornment>
//                 )
//               }}
//               helperText="Email cannot be changed"
//             />

//             <TextField
//               fullWidth
//               name="avatar"
//               label={t('profile.avatarUrl') || 'Avatar URL (optional)'}
//               value={formData.avatar}
//               onChange={handleChange}
//               disabled={!editMode}
//               sx={{ mb: 3 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Icon name="Link" size={20} color="text.secondary" />
//                   </InputAdornment>
//                 )
//               }}
//               placeholder="https://example.com/avatar.jpg"
//             />

//             <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 {!editMode ? (
//                   <Button
//                     variant="contained"
//                     startIcon={<Icon name="Edit" size={18} />}
//                     onClick={() => setEditMode(true)}
//                     sx={{ borderRadius: 2 }}
//                   >
//                     {t('profile.edit') || 'Edit Profile'}
//                   </Button>
//                 ) : (
//                   <>
//                     <Button
//                       variant="contained"
//                       startIcon={<Icon name="Save" size={18} />}
//                       onClick={handleSave}
//                       disabled={loading}
//                       sx={{ borderRadius: 2 }}
//                     >
//                       {loading ? 'Saving...' : (t('profile.save') || 'Save')}
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       startIcon={<Icon name="Close" size={18} />}
//                       onClick={handleCancel}
//                       sx={{ borderRadius: 2 }}
//                     >
//                       {t('profile.cancel') || 'Cancel'}
//                     </Button>
//                   </>
//                 )}
//               </Box>

//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<Icon name="Logout" size={18} />}
//                 onClick={handleLogout}
//                 sx={{ borderRadius: 2 }}
//               >
//                 {t('nav.logout') || 'Sign Out'}
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>

//         {/* Stats Section */}
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h6" fontWeight="600" gutterBottom>
//             {t('profile.statistics') || 'Statistics'}
//           </Typography>
//           <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
//             <Card sx={{ p: 2, textAlign: 'center' }}>
//               <Icon name="Flag" size={32} color="primary.main" />
//               <Typography variant="h4" fontWeight="700" sx={{ mt: 1 }}>
//                 {user?.stats?.totalGoals || 0}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {t('profile.totalGoals') || 'Total Goals'}
//               </Typography>
//             </Card>
//             <Card sx={{ p: 2, textAlign: 'center' }}>
//               <Icon name="CheckCircle" size={32} color="success.main" />
//               <Typography variant="h4" fontWeight="700" sx={{ mt: 1 }}>
//                 {user?.stats?.completedGoals || 0}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {t('profile.completed') || 'Completed'}
//               </Typography>
//             </Card>
//             <Card sx={{ p: 2, textAlign: 'center' }}>
//               <Icon name="LocalFireDepartment" size={32} color="warning.main" />
//               <Typography variant="h4" fontWeight="700" sx={{ mt: 1 }}>
//                 {user?.stats?.streak || 0}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {t('profile.streak') || 'Day Streak'}
//               </Typography>
//             </Card>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   )
// }