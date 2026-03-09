import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageProvider'
import { ThemeProvider } from './contexts/ThemeProvider'  // ✅ این باید باشه
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import CreateGoal from './pages/CreateGoal'
import GoalDetail from './pages/GoalDetail'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/goals/new" element={<CreateGoal />} />
              <Route path="/goals/:id" element={<GoalDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App