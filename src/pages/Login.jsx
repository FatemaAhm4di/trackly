import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/auth/AuthLayout'
import LoginForm from '../components/auth/LoginForm'

export default function Login() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    // اگه کاربر قبلاً لاگین کرده، بره به داشبورد
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your journey"
    >
      <LoginForm />
    </AuthLayout>
  )
}