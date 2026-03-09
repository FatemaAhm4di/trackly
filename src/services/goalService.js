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

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
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
    setGoals(prev => prev.map(goal => 
      goal.id === id 
        ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
        : goal
    ))
  }

  // ✅ اصلاح شده: استفاده از newGoals به جای goals
  const deleteGoal = (id) => {
    setGoals(prev => {
      const newGoals = prev.filter(goal => goal.id !== id)
      
      // محاسبه streak جدید بعد از حذف
      setTimeout(() => {
        const newStreak = calculateOverallStreakWithGoals(newGoals)  // ✅ اینجا از newGoals استفاده کن
        setUserStats(prevStats => ({
          ...prevStats,
          streak: newStreak
        }))
      }, 0)
      
      return newGoals
    })
  }

  const getGoalById = (id) => {
    if (!id) return null
    return goals.find(goal => goal.id === id) || null
  }

  const hasLoggedToday = (goalId) => {
    const goal = getGoalById(goalId)
    if (!goal || !goal.logs) return false
    
    const today = new Date().toISOString().split('T')[0]
    return goal.logs.some(log => log && log.date === today)
  }

  const hasLoggedTodayOnly = (goalId) => {
    const goal = getGoalById(goalId)
    if (!goal || !goal.logs) return false
    
    const today = new Date().toISOString().split('T')[0]
    return goal.logs.some(log => log && log.date === today)
  }

  const calculateGoalStreak = (goalId) => {
    const goal = getGoalById(goalId)
    if (!goal || !goal.logs || goal.logs.length === 0) return 0
    
    const sortedLogs = [...goal.logs]
      .filter(log => log && log.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    if (sortedLogs.length === 0) return 0
    
    let streak = 1
    let currentDate = new Date(sortedLogs[0].date)
    currentDate.setHours(0, 0, 0, 0)
    
    for (let i = 1; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date)
      logDate.setHours(0, 0, 0, 0)
      
      const diffDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        streak++
        currentDate = logDate
      } else if (diffDays > 1) {
        break
      }
    }
    
    const lastLogDate = new Date(sortedLogs[0].date)
    lastLogDate.setHours(0, 0, 0, 0)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (lastLogDate < yesterday) {
      return 0
    }
    
    return streak
  }

  const calculateOverallStreakWithGoals = (goalsList) => {
    try {
      if (!goalsList || goalsList.length === 0) {
        return userStats?.streak || 0
      }
      
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      
      const hasActivityToday = goalsList.some(goal => 
        goal.logs && goal.logs.some(log => log && log.date === today)
      )
      
      const hasActivityYesterday = goalsList.some(goal => 
        goal.logs && goal.logs.some(log => log && log.date === yesterday)
      )
      
      const currentStreak = userStats?.streak || 0
      
      if (hasActivityToday) {
        if (hasActivityYesterday) {
          return currentStreak + 1
        }
        return 1
      }
      
      if (hasActivityYesterday) {
        return currentStreak
      }
      
      return 0
    } catch (error) {
      console.error('Error calculating streak:', error)
      return userStats?.streak || 0
    }
  }

  const addProgress = (goalId, amount = 1) => {
    try {
      const goal = getGoalById(goalId)
      if (!goal) return { success: false, error: 'GOAL_NOT_FOUND', message: 'Goal not found' }
      
      if (goal.status !== 'active') {
        return { success: false, error: 'GOAL_NOT_ACTIVE', message: 'Goal is not active' }
      }
      
      if (hasLoggedTodayOnly(goalId)) {
        return { 
          success: false, 
          error: 'DAILY_LIMIT',
          message: 'errors.dailyLimit'
        }
      }

      const today = new Date().toISOString().split('T')[0]
      const now = new Date().toISOString()
      
      const newLogs = [...(goal.logs || [])]
      newLogs.push({ 
        date: today, 
        timestamp: now,
        amount: amount || 1
      })
      
      const newProgress = Math.min((goal.progress || 0) + (amount || 1), goal.target || 1)
      
      let updatedGoal = {
        ...goal,
        progress: newProgress,
        logs: newLogs,
        updatedAt: now
      }
      
      let xpGained = 20
      let completedCountIncrease = 0
      
      if (newProgress >= goal.target) {
        updatedGoal.status = 'completed'
        updatedGoal.completedAt = now
        xpGained = 50
        completedCountIncrease = 1
      }
      
      updateGoal(goalId, {
        progress: newProgress,
        logs: newLogs,
        status: updatedGoal.status,
        completedAt: updatedGoal.completedAt
      })
      
      const newGoalsList = goals.map(g => g.id === goalId ? updatedGoal : g)
      const newStreak = calculateOverallStreakWithGoals(newGoalsList)
      
      setUserStats(prev => ({
        xpTotal: (prev?.xpTotal || 0) + xpGained,
        streak: newStreak,
        completedCount: (prev?.completedCount || 0) + completedCountIncrease,
        lastActivityDate: today
      }))
      
      return { 
        success: true, 
        goal: updatedGoal,
        xpGained: xpGained,
        newStreak: newStreak,
        message: 'Progress added successfully'
      }
    } catch (error) {
      console.error('Error in addProgress:', error)
      return { 
        success: false, 
        error: 'UNKNOWN_ERROR', 
        message: 'An error occurred while adding progress' 
      }
    }
  }

  const togglePause = (goalId) => {
    try {
      const goal = getGoalById(goalId)
      if (!goal) return
      
      const newStatus = goal.status === 'active' ? 'paused' : 'active'
      updateGoal(goalId, { status: newStatus })
    } catch (error) {
      console.error('Error toggling pause:', error)
    }
  }

  const markComplete = (goalId) => {
    try {
      const goal = getGoalById(goalId)
      if (!goal) return
      
      updateGoal(goalId, {
        progress: goal.target,
        status: 'completed',
        completedAt: new Date().toISOString()
      })
      
      const newGoalsList = goals.map(g => g.id === goalId ? {...g, status: 'completed'} : g)
      const newStreak = calculateOverallStreakWithGoals(newGoalsList)
      
      setUserStats(prev => ({
        xpTotal: (prev?.xpTotal || 0) + 50,
        streak: newStreak,
        completedCount: (prev?.completedCount || 0) + 1,
        lastActivityDate: prev?.lastActivityDate
      }))
    } catch (error) {
      console.error('Error marking complete:', error)
    }
  }

  const getGoalsByStatus = (status) => {
    if (!goals) return []
    return goals.filter(goal => goal && goal.status === status)
  }

  const getGoalsByCategory = (category) => {
    if (!goals) return []
    return goals.filter(goal => goal && goal.category === category)
  }

  const searchGoals = (query) => {
    if (!goals || !query) return goals || []
    return goals.filter(goal => 
      goal && goal.title && goal.title.toLowerCase().includes(query.toLowerCase())
    )
  }

  const sortGoals = (goalsList, sortBy) => {
    if (!goalsList || !Array.isArray(goalsList)) return []
    
    const sorted = [...goalsList]
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => {
          if (!a || !b) return 0
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        })
      case 'progress':
        return sorted.sort((a, b) => {
          if (!a || !b) return 0
          const aProgress = a.target ? (a.progress / a.target) : 0
          const bProgress = b.target ? (b.progress / b.target) : 0
          return bProgress - aProgress
        })
      case 'category':
        return sorted.sort((a, b) => {
          if (!a || !b) return 0
          return (a.category || '').localeCompare(b.category || '')
        })
      default:
        return sorted
    }
  }

  const getOverallProgress = () => {
    try {
      if (!goals || goals.length === 0) return 0
      
      const validGoals = goals.filter(g => g && g.target && g.target > 0)
      if (validGoals.length === 0) return 0
      
      const totalProgress = validGoals.reduce((sum, goal) => {
        return sum + ((goal.progress || 0) / goal.target * 100)
      }, 0)
      
      return totalProgress / validGoals.length
    } catch (error) {
      console.error('Error calculating overall progress:', error)
      return 0
    }
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
    goals: goals || [],
    userStats: userStats || { xpTotal: 0, streak: 0, completedCount: 0, lastActivityDate: null },
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalById,
    addProgress,
    togglePause,
    markComplete,
    calculateGoalStreak, 
    calculateStreak: calculateGoalStreak, 
    getGoalsByStatus,
    getGoalsByCategory,
    searchGoals,
    sortGoals,
    getOverallProgress,
    hasLoggedToday,
    hasLoggedInLast24Hours: hasLoggedTodayOnly,
    resetStreak,
    CATEGORIES,
    GOAL_TYPES
  }
}