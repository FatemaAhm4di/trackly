import React, { createContext, useState, useEffect } from 'react'
import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider
} from '../config/firebase'

import {
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'

const AuthContext = createContext()
export { AuthContext }

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔹 این قسمت مشکل login دائم را حل می‌کند
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          avatar: firebaseUser.photoURL
        })
      } else {
        setUser(null)
      }

      setLoading(false)

    })

    return () => unsubscribe()

  }, [])

  const login = (email, password) => {
    if (email === 'demo@trackly.com' && password === '123456') {
      setUser({ email, name: 'Demo User' })
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    try {

      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      setUser({
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        avatar: firebaseUser.photoURL
      })

      return { success: true }

    } catch (error) {

      return { success: false, error: error.message }

    } finally {
      setLoading(false)
    }
  }

  const loginWithFacebook = async () => {
    setLoading(true)
    try {

      const result = await signInWithPopup(auth, facebookProvider)
      const firebaseUser = result.user

      setUser({
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        avatar: firebaseUser.photoURL
      })

      return { success: true }

    } catch (error) {

      return { success: false, error: error.message }

    } finally {
      setLoading(false)
    }
  }

  const loginWithGithub = async () => {
    setLoading(true)
    try {

      const result = await signInWithPopup(auth, githubProvider)
      const firebaseUser = result.user

      setUser({
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        avatar: firebaseUser.photoURL
      })

      return { success: true }

    } catch (error) {

      return { success: false, error: error.message }

    } finally {
      setLoading(false)
    }
  }

  // 🔹 logout واقعی
  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithGithub,
    logout
  }

  // 🔹 تا وقتی auth چک نشده چیزی رندر نکن
  if (loading) {
    return null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}