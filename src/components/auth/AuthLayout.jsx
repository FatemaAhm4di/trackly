// import { Box, Paper, Container } from '@mui/material'
// import Typography from '../ui/Typography'

// export default function AuthLayout({ children, title, subtitle }) {
//   return (
//     <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
//       <Paper
//         elevation={3}
//         sx={{
//           display: 'flex',
//           width: '100%',
//           minHeight: 600,
//           borderRadius: 4,
//           overflow: 'hidden'
//         }}
//       >
//         {/* سمت راست - فرم */}
//         <Box
//           sx={{
//             flex: 1,
//             p: 6,
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center'
//           }}
//         >
//           <Typography variant="h3" fontWeight="700" gutterBottom>
//             {title}
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
//             {subtitle}
//           </Typography>
//           {children}
//         </Box>

//         {/* سمت چپ - تصویر */}
//         <Box
//           sx={{
//             flex: 1,
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             display: { xs: 'none', md: 'flex' },
//             alignItems: 'center',
//             justifyContent: 'center',
//             p: 4
//           }}
//         >
//           <Box sx={{ textAlign: 'center', color: 'white' }}>
//             <Typography variant="h2" fontWeight="700" gutterBottom>
//               Trackly
//             </Typography>
//             <Typography variant="h5" sx={{ opacity: 0.9 }}>
//               Your Goal Tracking Companion
//             </Typography>
//           </Box>
//         </Box>
//       </Paper>
//     </Container>
//   )
// }