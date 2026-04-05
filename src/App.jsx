import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageProvider'
import { ThemeProvider } from './contexts/ThemeProvider'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './hooks/useToast'
import { useLanguage } from './hooks/useLanguage'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import CreateGoal from './pages/CreateGoal'
import GoalDetail from './pages/GoalDetail'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Archive from './pages/Archive'
import Login from './pages/Login'
import Register from './pages/Register'

// کامپوننت برای محافظت از مسیرها
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  const { direction } = useLanguage()
  
  return (
    <div dir={direction} style={{ width: '100%', minHeight: '100vh' }}>
      <Routes>
        {/* مسیر پیش‌فرض: اگه کاربر لاگین کرده بره به داشبورد، وگرنه بره به لاگین */}
        <Route path="/" element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
        
        {/* مسیرهای عمومی (بدون نیاز به لاگین) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* مسیرهای محافظت شده (نیاز به لاگین) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/goals" element={
          <ProtectedRoute>
            <Layout>
              <Goals />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/goals/new" element={
          <ProtectedRoute>
            <Layout>
              <CreateGoal />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/goals/:id" element={
          <ProtectedRoute>
            <Layout>
              <GoalDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute>
            <Layout>
              <Categories />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/archive" element={
          <ProtectedRoute>
            <Layout>
              <Archive />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* صفحه 404 */}
        <Route path="*" element={<NotFound />} />
        <Route path="/profile" element={<Navigate to="/settings" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App