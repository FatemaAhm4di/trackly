import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useState, useEffect } from 'react'

const CATEGORIES = [
  'education', 'creative', 'mental', 'career',
  'health', 'fitness', 'finance', 'productivity',
  'social', 'family', 'travel', 'spiritual'
]

const GOAL_TYPES = ['daily', 'count', 'time']

export function useGoalService() {
  const { user } = useAuth()
  const [isMigrated, setIsMigrated] = useState(false)
  
  // کلیدهای ذخیره‌سازی
  const oldGoalsKey = 'trackly_goals'
  const oldStatsKey = 'trackly_stats'
  const newGoalsKey = user ? `trackly_goals_${user.id}` : null
  const newStatsKey = user ? `trackly_stats_${user.id}` : null
  
  // خواندن دیتای قدیم
  const getOldGoals = () => {
    const saved = localStorage.getItem(oldGoalsKey)
    return saved ? JSON.parse(saved) : null
  }
  
  const getOldStats = () => {
    const saved = localStorage.getItem(oldStatsKey)
    return saved ? JSON.parse(saved) : null
  }
  
  const migrateOldData = () => {
    if (!user || isMigrated) return
    
    const oldGoals = getOldGoals()
    const oldStats = getOldStats()
    
    if (oldGoals && oldGoals.length > 0) {
      const existingNewGoals = localStorage.getItem(newGoalsKey)
      if (!existingNewGoals) {
        localStorage.setItem(newGoalsKey, JSON.stringify(oldGoals))
        console.log('✅ Migrated goals for user:', user.id)
      }
    }
    
    if (oldStats) {
      const existingNewStats = localStorage.getItem(newStatsKey)
      if (!existingNewStats) {
        localStorage.setItem(newStatsKey, JSON.stringify(oldStats))
        console.log('✅ Migrated stats for user:', user.id)
      }
    }
    
    setIsMigrated(true)
  }
  
  useEffect(() => {
    if (user && !isMigrated) {
      migrateOldData()
    }
  }, [user, isMigrated])
  
  const [goals, setGoals] = useLocalStorage(
    newGoalsKey || 'trackly_goals_temp', 
    []
  )
  
  const [userStats, setUserStats] = useLocalStorage(
    newStatsKey || 'trackly_stats_temp', 
    {
      xpTotal: 0,
      streak: 0,
      completedCount: 0,
      lastActivityDate: null
    }
  )

  const getToday = () => new Date().toISOString().split('T')[0]
  const getYesterday = () => new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const createGoal = (goalData) => {
    const newGoal = {
      id: goalData.id || generateId(),
      title: goalData.title,
      category: goalData.category?.toLowerCase().trim(),
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
          ? {
              ...goal,
              ...updates,
              category: updates.category
                ? updates.category.toLowerCase().trim()
                : goal.category,
              updatedAt: new Date().toISOString()
            }
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
      if (!goal) return { success: false }

      if (goal.status !== 'active') {
        return { success: false, error: 'GOAL_NOT_ACTIVE' }
      }

      const today = getToday()
      const now = new Date().toISOString()

      const newLogs = [...(goal.logs || []), {
        date: today,
        timestamp: now,
        amount
      }]

      const newProgress = Math.min(
        (goal.progress || 0) + amount,
        goal.target || 1
      )

      let status = goal.status
      let completedAt = goal.completedAt
      let xpGained = 20
      let completedCountIncrease = 0

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

      return { success: true }

    } catch (error) {
      console.error(error)
      return { success: false }
    }
  }

  const togglePause = (goalId) => {
    const goal = getGoalById(goalId)
    if (!goal) return

    updateGoal(goalId, {
      status: goal.status === 'active' ? 'paused' : 'active'
    })
  }

  const markComplete = (goalId) => {
    const goal = getGoalById(goalId)
    if (!goal) return

    updateGoal(goalId, {
      progress: goal.target,
      status: 'completed',
      completedAt: new Date().toISOString()
    })
  }

  const getGoalsByStatus = (status) => {
    return goals.filter(goal => goal.status === status)
  }

  const getGoalsByCategory = (category) => {
    if (!category) return []

    return goals.filter(goal =>
      goal.category &&
      goal.category.toLowerCase().trim() === category.toLowerCase().trim()
    )
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

    if (validGoals.length === 0) return 0

    const total = validGoals.reduce((sum, g) => {
      return sum + ((g.progress || 0) / g.target * 100)
    }, 0)

    return total / validGoals.length
  }

  const resetStreak = () => {
    setUserStats(prev => ({
      ...prev,
      streak: 0,
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
    resetStreak,
    CATEGORIES,
    GOAL_TYPES
  }
}