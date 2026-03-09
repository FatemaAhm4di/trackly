import React, { createContext, useState } from 'react'
import { 
  auth, 
  googleProvider, 
  facebookProvider, 
  githubProvider 
} from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'

const AuthContext = createContext()
export { AuthContext }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

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
      const user = result.user
      setUser({
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL
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
      const user = result.user
      setUser({
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL
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
      const user = result.user
      setUser({
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}