import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useState, useEffect } from 'react'

const CATEGORIES = ['education', 'creative', 'mental', 'career', 'health', 'fitness', 'finance', 'productivity', 'social', 'family', 'travel', 'spiritual']
const GOAL_TYPES = ['daily', 'count', 'time']

export function useGoalService() {
  const { user } = useAuth()
  const [isMigrated, setIsMigrated] = useState(false)
  
  const newGoalsKey = user ? `trackly_goals_${user.id}` : 'trackly_goals_temp'
  const newStatsKey = user ? `trackly_stats_${user.id}` : 'trackly_stats_temp'
  
  const migrateOldData = () => {
    if (!user || isMigrated) return
    const oldGoals = localStorage.getItem('trackly_goals')
    const oldStats = localStorage.getItem('trackly_stats')
    if (oldGoals && !localStorage.getItem(newGoalsKey)) localStorage.setItem(newGoalsKey, oldGoals)
    if (oldStats && !localStorage.getItem(newStatsKey)) localStorage.setItem(newStatsKey, oldStats)
    setIsMigrated(true)
  }
  
  useEffect(() => { if (user && !isMigrated) migrateOldData() }, [user, isMigrated])
  
  const [goals, setGoals] = useLocalStorage(newGoalsKey, [])
  const [userStats, setUserStats] = useLocalStorage(newStatsKey, { xpTotal: 0, streak: 0, completedCount: 0, lastActivityDate: null })

  const getToday = () => new Date().toISOString().split('T')[0]
  const getYesterday = () => new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2)

  const createGoal = (data) => {
    const newGoal = {
      id: data.id || generateId(),
      title: data.title,
      category: data.category?.toLowerCase().trim(),
      type: data.type,
      target: Number(data.target),
      progress: data.progress || 0,
      status: data.status || 'active',
      startDate: data.startDate,
      endDate: data.endDate || null,
      color: data.color || '#368ac7',
      notes: data.notes || '',
      logs: data.logs || [],
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setGoals(prev => [newGoal, ...prev])
    return newGoal
  }

  const updateGoal = (id, updates) => setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates, category: updates.category ? updates.category.toLowerCase().trim() : g.category, updatedAt: new Date().toISOString() } : g))

  const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id))
  const restoreGoal = (id) => setGoals(prev => prev.map(g => g.id === id ? { ...g, status: 'active', completedAt: null } : g))
  const getGoalById = (id) => goals.find(g => g.id === id) || null

  const calculateNewStreak = () => {
    const today = getToday()
    const yesterday = getYesterday()
    if (!userStats.lastActivityDate) return 1
    if (userStats.lastActivityDate === yesterday) return (userStats.streak || 0) + 1
    if (userStats.lastActivityDate === today) return userStats.streak || 1
    return 1
  }

  const addProgress = (goalId, amount = 1) => {
    const goal = getGoalById(goalId)
    if (!goal) return { success: false }
    if (goal.status !== 'active') return { success: false, error: 'GOAL_NOT_ACTIVE' }

    const today = getToday()
    const newLogs = [...(goal.logs || []), { date: today, timestamp: new Date().toISOString(), amount }]
    const newProgress = Math.min((goal.progress || 0) + amount, goal.target || 1)
    let status = goal.status, completedAt = goal.completedAt, xpGained = 20, completedCountIncrease = 0

    if (newProgress >= goal.target) {
      status = 'completed'
      completedAt = new Date().toISOString()
      xpGained = 50
      completedCountIncrease = 1
    }

    updateGoal(goalId, { progress: newProgress, logs: newLogs, status, completedAt })

    const newStreak = calculateNewStreak()
    setUserStats(prev => ({ xpTotal: (prev?.xpTotal || 0) + xpGained, streak: newStreak, completedCount: (prev?.completedCount || 0) + completedCountIncrease, lastActivityDate: today }))
    return { success: true }
  }

  const togglePause = (goalId) => {
    const goal = getGoalById(goalId)
    if (goal) updateGoal(goalId, { status: goal.status === 'active' ? 'paused' : 'active' })
  }

  const markComplete = (goalId) => {
    const goal = getGoalById(goalId)
    if (goal) updateGoal(goalId, { progress: goal.target, status: 'completed', completedAt: new Date().toISOString() })
  }

  const getGoalsByStatus = (status) => goals.filter(g => g.status === status)
  const getGoalsByCategory = (category) => category ? goals.filter(g => g.category?.toLowerCase().trim() === category.toLowerCase().trim()) : []
  const searchGoals = (query) => query ? goals.filter(g => g.title.toLowerCase().includes(query.toLowerCase())) : goals
  const getOverallProgress = () => {
    if (!goals.length) return 0
    const valid = goals.filter(g => g.target > 0)
    if (!valid.length) return 0
    return valid.reduce((sum, g) => sum + ((g.progress || 0) / g.target * 100), 0) / valid.length
  }
  const resetStreak = () => setUserStats(prev => ({ ...prev, streak: 0, lastActivityDate: null }))

  return { goals, userStats, createGoal, updateGoal, deleteGoal, restoreGoal, getGoalById, addProgress, togglePause, markComplete, getGoalsByStatus, getGoalsByCategory, searchGoals, getOverallProgress, resetStreak, CATEGORIES, GOAL_TYPES }
}