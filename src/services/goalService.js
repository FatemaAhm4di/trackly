
import { useLocalStorage } from '../hooks/useLocalStorage'

const CATEGORIES = ['health', 'study', 'work', 'personal', 'fitness', 'finance', 'creative', 'social']
const GOAL_TYPES = ['daily', 'count', 'time']

export function useGoalService() {
  const [goals, setGoals] = useLocalStorage('trackly_goals', [])
  const [userStats, setUserStats] = useLocalStorage('trackly_stats', {
    xpTotal: 0,
    streak: 0,
    completedCount: 0
  })

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const createGoal = (goalData) => {
    const newGoal = {
      id: generateId(),
      title: goalData.title,
      category: goalData.category,
      type: goalData.type,
      target: Number(goalData.target),
      progress: 0,
      status: 'active',
      startDate: goalData.startDate,
      endDate: goalData.endDate || null,
      color: goalData.color || '#368ac7',
      notes: goalData.notes || '',
      logs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setGoals(prev => [newGoal, ...prev])
    return newGoal
  }

  const updateGoal = (id, updates) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id 
        ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
        : goal
    ))
  }

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id))
  }

  const getGoalById = (id) => {
    return goals.find(goal => goal.id === id)
  }

  const addProgress = (goalId, amount = 1) => {
    const goal = getGoalById(goalId)
    if (!goal || goal.status !== 'active') return

    const today = new Date().toISOString().split('T')[0]
    const existingLogIndex = goal.logs.findIndex(log => log.date === today)
    
    let newLogs = [...goal.logs]
    let newProgress = goal.progress
    
    if (existingLogIndex >= 0) {
      newLogs[existingLogIndex].amount += amount
    } else {
      newLogs.push({ date: today, amount })
    }
    
    newProgress = Math.min(newProgress + amount, goal.target)
    
    const updatedGoal = {
      ...goal,
      progress: newProgress,
      logs: newLogs,
      updatedAt: new Date().toISOString()
    }
    
    if (newProgress >= goal.target) {
      updatedGoal.status = 'completed'
      updatedGoal.completedAt = new Date().toISOString()
      setUserStats(prev => ({
        ...prev,
        completedCount: prev.completedCount + 1,
        xpTotal: prev.xpTotal + 50
      }))
    } else {
      setUserStats(prev => ({
        ...prev,
        xpTotal: prev.xpTotal + 20
      }))
    }
    
    updateGoal(goalId, {
      progress: newProgress,
      logs: newLogs,
      status: updatedGoal.status,
      completedAt: updatedGoal.completedAt
    })
    
    return updatedGoal
  }

  const togglePause = (goalId) => {
    const goal = getGoalById(goalId)
    if (!goal) return
    
    const newStatus = goal.status === 'active' ? 'paused' : 'active'
    updateGoal(goalId, { status: newStatus })
  }

  const markComplete = (goalId) => {
    const goal = getGoalById(goalId)
    if (!goal) return
    
    updateGoal(goalId, {
      progress: goal.target,
      status: 'completed',
      completedAt: new Date().toISOString()
    })
    
    setUserStats(prev => ({
      ...prev,
      completedCount: prev.completedCount + 1,
      xpTotal: prev.xpTotal + 50
    }))
  }

  const calculateStreak = (goalId) => {
    const goal = getGoalById(goalId)
    if (!goal || goal.logs.length === 0) return 0
    
    const sortedLogs = [...goal.logs].sort((a, b) => new Date(b.date) - new Date(a.date))
    let streak = 0
    let currentDate = new Date()
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.date)
      const diffDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 1) {
        streak++
        currentDate = logDate
      } else {
        break
      }
    }
    
    return streak
  }

  const getGoalsByStatus = (status) => {
    return goals.filter(goal => goal.status === status)
  }

  const getGoalsByCategory = (category) => {
    return goals.filter(goal => goal.category === category)
  }

  const searchGoals = (query) => {
    return goals.filter(goal => 
      goal.title.toLowerCase().includes(query.toLowerCase())
    )
  }

  const sortGoals = (goalsList, sortBy) => {
    const sorted = [...goalsList]
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      case 'progress':
        return sorted.sort((a, b) => (b.progress / b.target) - (a.progress / a.target))
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category))
      default:
        return sorted
    }
  }

  const getOverallProgress = () => {
    if (goals.length === 0) return 0
    const totalProgress = goals.reduce((sum, goal) => sum + (goal.progress / goal.target * 100), 0)
    return totalProgress / goals.length
  }

  return {
    goals,
    userStats,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalById,
    addProgress,
    togglePause,
    markComplete,
    calculateStreak,
    getGoalsByStatus,
    getGoalsByCategory,
    searchGoals,
    sortGoals,
    getOverallProgress,
    CATEGORIES,
    GOAL_TYPES
  }
}