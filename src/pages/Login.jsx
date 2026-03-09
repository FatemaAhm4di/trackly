// import { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'
// import AuthLayout from '../components/auth/AuthLayout'
// import LoginForm from '../components/auth/LoginForm'
// import { PageLoading } from '../components/ui/Loading'

// export default function Login() {
//   const navigate = useNavigate()
//   const { user, loading } = useAuth()

//   useEffect(() => {
//     if (user && !loading) {
//       navigate('/')
//     }
//   }, [user, loading, navigate])

//   if (loading) {
//     return <PageLoading />
//   }

//   return (
//     <AuthLayout
//       title="Sign In"
//       subtitle="Unlock your world"
//     >
//       <LoginForm />
//     </AuthLayout>
//   )
// }