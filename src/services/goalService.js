import { useLocalStorage } from '../hooks/useLocalStorage'

const CATEGORIES = ['health', 'study', 'work', 'personal', 'fitness', 'finance', 'creative', 'social']
const GOAL_TYPES = ['daily', 'count', 'time']

export function useGoalService() {
  const [goals, setGoals] = useLocalStorage('trackly_goals', [])
  const [userStats, setUserStats] = useLocalStorage('trackly_stats', {
    xpTotal: 0,
    streak: 0,
    completedCount: 0,
    lastActivityDate: null
  })

  const getToday = () => new Date().toISOString().split('T')[0]
  const getYesterday = () => new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const createGoal = (goalData) => {
    const newGoal = {
      id: goalData.id || generateId(),
      title: goalData.title,
      category: goalData.category,
      type: goalData.type,
      target: Number(goalData.target),
      progress: goalData.progress || 0,
      status: goalData.status || 'active',
      startDate: goalData.startDate,
      endDate: goalData.endDate || null,
      color: goalData.color || '#368ac7',
      notes: goalData.notes || '',
      logs: goalData.logs || [],
      createdAt: goalData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setGoals(prev => [newGoal, ...prev])
    return newGoal
  }

  const updateGoal = (id, updates) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id
          ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
          : goal
      )
    )
  }

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id))
  }

  const restoreGoal = (id) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id
          ? { ...goal, status: 'active', completedAt: null }
          : goal
      )
    )
  }

  const getGoalById = (id) => {
    if (!id) return null
    return goals.find(goal => goal.id === id) || null
  }

  const hasLoggedToday = (goalId) => {
    const goal = getGoalById(goalId)
    if (!goal || !goal.logs) return false
    const today = getToday()
    return goal.logs.some(log => log.date === today)
  }

  const calculateNewStreak = () => {
    const today = getToday()
    const yesterday = getYesterday()

    if (!userStats.lastActivityDate) return 1

    if (userStats.lastActivityDate === yesterday) {
      return (userStats.streak || 0) + 1
    }

    if (userStats.lastActivityDate === today) {
      return userStats.streak || 1
    }

    return 1
  }

  const addProgress = (goalId, amount = 1) => {
    try {
      const goal = getGoalById(goalId)

      if (!goal) {
        return { success: false, error: 'GOAL_NOT_FOUND' }
      }

      if (goal.status !== 'active') {
        return { success: false, error: 'GOAL_NOT_ACTIVE' }
      }

      if (hasLoggedToday(goalId)) {
        return { success: false, error: 'DAILY_LIMIT' }
      }

      const today = getToday()
      const now = new Date().toISOString()

      const newLogs = [...(goal.logs || [])]

      newLogs.push({
        date: today,
        timestamp: now,
        amount
      })

      const newProgress = Math.min(
        (goal.progress || 0) + amount,
        goal.target || 1
      )

      let xpGained = 20
      let completedCountIncrease = 0
      let status = goal.status
      let completedAt = goal.completedAt

      if (newProgress >= goal.target) {
        status = 'completed'
        completedAt = now
        xpGained = 50
        completedCountIncrease = 1
      }

      updateGoal(goalId, {
        progress: newProgress,
        logs: newLogs,
        status,
        completedAt
      })

      const newStreak = calculateNewStreak()

      setUserStats(prev => ({
        xpTotal: (prev?.xpTotal || 0) + xpGained,
        streak: newStreak,
        completedCount: (prev?.completedCount || 0) + completedCountIncrease,
        lastActivityDate: today
      }))

      return {
        success: true,
        xpGained,
        newStreak
      }

    } catch (error) {
      console.error(error)
      return { success: false }
    }
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
      completedCount: (prev?.completedCount || 0) + 1,
      xpTotal: (prev?.xpTotal || 0) + 50
    }))
  }

  const getGoalsByStatus = (status) => {
    return goals.filter(goal => goal.status === status)
  }

  const getGoalsByCategory = (category) => {
    return goals.filter(goal => goal.category === category)
  }

  const searchGoals = (query) => {
    if (!query) return goals

    return goals.filter(goal =>
      goal.title.toLowerCase().includes(query.toLowerCase())
    )
  }

  const getOverallProgress = () => {
    if (!goals.length) return 0

    const validGoals = goals.filter(g => g.target > 0)

    const total = validGoals.reduce((sum, g) => {
      return sum + ((g.progress || 0) / g.target * 100)
    }, 0)

    return total / validGoals.length
  }

  const resetStreak = () => {
    setUserStats(prev => ({
      xpTotal: prev?.xpTotal || 0,
      streak: 0,
      completedCount: prev?.completedCount || 0,
      lastActivityDate: null
    }))
  }

  return {
    goals,
    userStats,
    createGoal,
    updateGoal,
    deleteGoal,
    restoreGoal,
    getGoalById,
    addProgress,
    togglePause,
    markComplete,
    getGoalsByStatus,
    getGoalsByCategory,
    searchGoals,
    getOverallProgress,
    hasLoggedToday,
    resetStreak,
    CATEGORIES,
    GOAL_TYPES
  }
}