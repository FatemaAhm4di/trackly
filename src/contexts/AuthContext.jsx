import React, { createContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
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

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ✅ sync with firebase
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,  // ✅ اضافه شد - مهم برای Cloud Backup
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'User',
          avatar: firebaseUser.photoURL || ''
        })
      } else {
        setUser(null)
      }

      setLoading(false)

    })

    return () => unsubscribe()

  }, [])

  // ===============================
  // ✅ LOGIN (EMAIL)
  // ===============================
  const login = async (email, password) => {
    setLoading(true)

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = result.user

      setUser({
        id: firebaseUser.uid,  // ✅ اضافه شد
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

  // ===============================
  // ✅ REGISTER (EMAIL)
  // ===============================
  const register = async (email, password, name) => {
    setLoading(true)

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // ✅ set display name in firebase
      await updateProfile(result.user, {
        displayName: name
      })

      setUser({
        id: result.user.uid,  // ✅ اضافه شد
        email: result.user.email,
        name: name,
        avatar: ''
      })

      return { success: true }

    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // ✅ GOOGLE LOGIN
  // ===============================
  const loginWithGoogle = async () => {
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      setUser({
        id: firebaseUser.uid,  // ✅ اضافه شد
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

  // ===============================
  // ✅ FACEBOOK LOGIN
  // ===============================
  const loginWithFacebook = async () => {
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, facebookProvider)
      const firebaseUser = result.user

      setUser({
        id: firebaseUser.uid,  // ✅ اضافه شد
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

  // ===============================
  // ✅ GITHUB LOGIN
  // ===============================
  const loginWithGithub = async () => {
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, githubProvider)
      const firebaseUser = result.user

      setUser({
        id: firebaseUser.uid,  // ✅ اضافه شد
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email,
        avatar: firebaseUser.photoURL
      })

      return { success: true }

    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // ✅ LOGOUT
  // ===============================
  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  // ===============================
  // ✅ UPDATE PROFILE (REAL)
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

      setUser(prev => ({
        ...prev,
        name,
        avatar
      }))

      return { success: true }

    } catch (error) {
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
    updateUserProfile
  }

  if (loading) return null

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}