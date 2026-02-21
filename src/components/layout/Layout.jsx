import { Box, Container } from '@mui/material'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'background.default',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          py: 4
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  )
}