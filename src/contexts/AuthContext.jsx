import React, { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()
export { AuthContext }

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('trackly_user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      loadNotifications(parsedUser.id)
    }
    setLoading(false)
  }, [])

  // Load notifications from localStorage
  const loadNotifications = (userId) => {
    if (!userId) return
    const saved = localStorage.getItem(`notifications_${userId}`)
    const notifs = saved ? JSON.parse(saved) : []
    setNotifications(notifs)
    setUnreadCount(notifs.filter(n => !n.read).length)
  }

  // Save notifications to localStorage
  const saveNotifications = (userId, notifs) => {
    if (!userId) return
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifs))
  }

  // Add notification
  const addNotification = (type, data) => {
    if (!user) return null

    const titles = {
      goal_completed: '🎉 Goal Completed!',
      streak_milestone: `🔥 ${data?.days || 0} Day Streak!`,
      weekly_report: '📊 Weekly Report Ready',
      goal_reminder: '⏰ Goal Reminder',
      goal_progress: '📈 Progress Update',
      achievement: '🏆 Achievement Unlocked',
      welcome: '👋 Welcome to Trackly!',
      backup_restored: '💾 Backup Restored'
    }

    const messages = {
      goal_completed: `Congratulations! You completed "${data?.goalTitle || 'a goal'}"`,
      streak_milestone: `Amazing! You've maintained a ${data?.days || 0} day streak!`,
      weekly_report: `You completed ${data?.completedCount || 0} goals this week!`,
      goal_reminder: `Don't forget to make progress on "${data?.goalTitle || 'your goal'}" today!`,
      goal_progress: `You're ${data?.progress || 0}% there on "${data?.goalTitle || 'your goal'}"!`,
      achievement: `You earned the "${data?.achievement || 'new'}" achievement!`,
      welcome: `Welcome to Trackly! Start tracking your goals today.`,
      backup_restored: `Your data has been successfully restored.`
    }

    const newNotification = {
      id: Date.now(),
      type,
      title: titles[type] || 'New Notification',
      message: messages[type] || 'You have a new notification',
      data: data || {},
      read: false,
      createdAt: new Date().toISOString()
    }

    const updated = [newNotification, ...notifications]
    setNotifications(updated)
    setUnreadCount(prev => prev + 1)
    
    saveNotifications(user.id, updated)
    
    return newNotification
  }

  // Mark as read
  const markAsRead = (notificationId) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
    setNotifications(updated)
    setUnreadCount(updated.filter(n => !n.read).length)
    
    if (user) {
      saveNotifications(user.id, updated)
    }
  }

  // Mark all as read
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    setUnreadCount(0)
    
    if (user) {
      saveNotifications(user.id, updated)
    }
  }

  // Delete notification
  const deleteNotification = (notificationId) => {
    const updated = notifications.filter(n => n.id !== notificationId)
    setNotifications(updated)
    setUnreadCount(updated.filter(n => !n.read).length)
    
    if (user) {
      saveNotifications(user.id, updated)
    }
  }

  // Delete all notifications
  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
    
    if (user) {
      saveNotifications(user.id, [])
    }
  }

  // ===============================
  // ✅ LOGIN (EMAIL) - LOCAL
  // ===============================
  const login = async (email, password) => {
    setLoading(true)
    try {
      const users = JSON.parse(localStorage.getItem('trackly_users') || '[]')
      const foundUser = users.find(u => u.email === email && u.password === password)
      
      if (!foundUser) {
        return { success: false, error: 'auth/user-not-found' }
      }
      
      const loggedUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name || foundUser.email.split('@')[0],
        avatar: foundUser.avatar || ''
      }
      
      setUser(loggedUser)
      localStorage.setItem('trackly_user', JSON.stringify(loggedUser))
      loadNotifications(loggedUser.id)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // ✅ REGISTER (EMAIL) - LOCAL
  // ===============================
  const register = async (email, password, name) => {
    setLoading(true)
    try {
      const users = JSON.parse(localStorage.getItem('trackly_users') || '[]')
      
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'auth/email-already-in-use' }
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        avatar: ''
      }
      
      users.push(newUser)
      localStorage.setItem('trackly_users', JSON.stringify(users))
      
      const loggedUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar: ''
      }
      
      setUser(loggedUser)
      localStorage.setItem('trackly_user', JSON.stringify(loggedUser))
      
      setTimeout(() => {
        addNotification('welcome', {})
      }, 1000)
      
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // ✅ GOOGLE LOGIN (Mock)
  // ===============================
  const loginWithGoogle = async () => {
    setLoading(true)
    try {
      const mockUser = {
        id: 'google_' + Date.now(),
        email: `user_${Date.now()}@gmail.com`,
        name: 'Google User',
        avatar: ''
      }
      
      setUser(mockUser)
      localStorage.setItem('trackly_user', JSON.stringify(mockUser))
      
      return { success: true }
    } catch (error) {
      console.error('Google login error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // ✅ GITHUB LOGIN (Mock)
  // ===============================
  const loginWithGithub = async () => {
    setLoading(true)
    try {
      const mockUser = {
        id: 'github_' + Date.now(),
        email: `user_${Date.now()}@github.com`,
        name: 'GitHub User',
        avatar: ''
      }
      
      setUser(mockUser)
      localStorage.setItem('trackly_user', JSON.stringify(mockUser))
      
      return { success: true }
    } catch (error) {
      console.error('Github login error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // ✅ LOGOUT
  // ===============================
  const logout = async () => {
    localStorage.removeItem('trackly_user')
    setUser(null)
  }

  // ===============================
  // ✅ UPDATE PROFILE
  // ===============================
  const updateUserProfile = async ({ name, avatar }) => {
    try {
      if (!user) {
        return { success: false, error: 'No user' }
      }
      
      const updatedUser = { ...user, name, avatar }
      setUser(updatedUser)
      localStorage.setItem('trackly_user', JSON.stringify(updatedUser))
      
      const users = JSON.parse(localStorage.getItem('trackly_users') || '[]')
      const index = users.findIndex(u => u.id === user.id)
      if (index !== -1) {
        users[index].name = name
        users[index].avatar = avatar
        localStorage.setItem('trackly_users', JSON.stringify(users))
      }
      
      return { success: true }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout,
    updateUserProfile,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  }

  if (loading) return null

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}