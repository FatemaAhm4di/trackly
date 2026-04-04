import React, { createContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'

import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider
} from '../config/firebase'

const AuthContext = createContext()
export { AuthContext }

// تشخیص موبایل
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // ✅ sync with firebase + handle redirect result
  useEffect(() => {
    // بررسی نتیجه redirect (برای موبایل)
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          const firebaseUser = result.user
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User',
            avatar: firebaseUser.photoURL || ''
          })
          loadNotifications(firebaseUser.uid)
        }
      } catch (error) {
        console.error('Redirect result error:', error)
      }
    }
    
    handleRedirectResult()

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'User',
          avatar: firebaseUser.photoURL || ''
        })
        loadNotifications(firebaseUser.uid)
      } else {
        setUser(null)
        setNotifications([])
        setUnreadCount(0)
      }
      setLoading(false)
    })
    return () => unsubscribe()
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
    if (user) saveNotifications(user.id, updated)
  }

  // Mark all as read
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    setUnreadCount(0)
    if (user) saveNotifications(user.id, updated)
  }

  // Delete notification
  const deleteNotification = (notificationId) => {
    const updated = notifications.filter(n => n.id !== notificationId)
    setNotifications(updated)
    setUnreadCount(updated.filter(n => !n.read).length)
    if (user) saveNotifications(user.id, updated)
  }

  // Delete all notifications
  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
    if (user) saveNotifications(user.id, [])
  }

  // ===============================
  // ✅ LOGIN (EMAIL)
  // ===============================
  const login = async (email, password) => {
    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = result.user
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        avatar: firebaseUser.photoURL || ''
      })
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      let errorMessage = error.message
      
      if (errorMessage.includes('auth/user-not-found')) {
        errorMessage = 'auth/user-not-found'
      } else if (errorMessage.includes('auth/wrong-password')) {
        errorMessage = 'auth/wrong-password'
      } else if (errorMessage.includes('auth/invalid-email')) {
        errorMessage = 'auth/invalid-email'
      } else if (errorMessage.includes('auth/too-many-requests')) {
        errorMessage = 'auth/too-many-requests'
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // ✅ REGISTER (EMAIL)
  // ===============================
  const register = async (email, password, name) => {
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
      
      setUser({
        id: result.user.uid,
        email: result.user.email,
        name: name,
        avatar: ''
      })
      
      setTimeout(() => addNotification('welcome', {}), 1000)
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      let errorMessage = error.message
      
      if (errorMessage.includes('auth/email-already-in-use')) {
        errorMessage = 'auth/email-already-in-use'
      } else if (errorMessage.includes('auth/weak-password')) {
        errorMessage = 'auth/weak-password'
      } else if (errorMessage.includes('auth/invalid-email')) {
        errorMessage = 'auth/invalid-email'
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // ✅ SOCIAL LOGIN (با تشخیص موبایل)
  // ===============================
  const socialLogin = async (provider, providerName) => {
    setLoading(true)
    try {
      if (isMobile()) {
        // موبایل: استفاده از redirect
        await signInWithRedirect(auth, provider)
        return { success: true, redirect: true }
      } else {
        // دسکتاپ: استفاده از popup
        const result = await signInWithPopup(auth, provider)
        const firebaseUser = result.user
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email,
          avatar: firebaseUser.photoURL
        })
        return { success: true }
      }
    } catch (error) {
      console.error(`${providerName} login error:`, error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = () => socialLogin(googleProvider, 'Google')
  const loginWithFacebook = () => socialLogin(facebookProvider, 'Facebook')
  const loginWithGithub = () => socialLogin(githubProvider, 'GitHub')

  // ===============================
  // ✅ LOGOUT
  // ===============================
  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // ===============================
  // ✅ UPDATE PROFILE
  // ===============================
  const updateUserProfile = async ({ name, avatar }) => {
    try {
      if (!auth.currentUser) {
        return { success: false, error: 'No user' }
      }
      
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: avatar
      })
      
      setUser(prev => ({ ...prev, name, avatar }))
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
    loginWithFacebook,
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