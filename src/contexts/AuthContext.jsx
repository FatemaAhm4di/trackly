// import React, { createContext, useState, useEffect } from 'react'
// import { useLocalStorage } from '../hooks/useLocalStorage'

// // ایجاد Context
// const AuthContext = createContext()

// // export خود Context
// export { AuthContext }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useLocalStorage('trackly_user', null)
//   const [loading, setLoading] = useState(true)

//   // کاربر پیشفرض برای تست
//   const defaultUser = {
//     id: '1',
//     email: 'demo@trackly.com',
//     fullName: 'کاربر آزمایشی',
//     avatar: null,
//     bio: '',
//     birthday: '',
//     location: '',
//     job: '',
//     gender: '',
//     maritalStatus: '',
//     phone: '',
//     createdAt: new Date().toISOString()
//   }

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (!user) {
//         setUser(defaultUser)
//       }
//       setLoading(false)
//     }, 500)
    
//     return () => clearTimeout(timer)
//   }, [])

//   const login = (email, password) => {
//     if (email && password) {
//       setUser({ ...defaultUser, email })
//       return { success: true }
//     }
//     return { success: false, error: 'Invalid credentials' }
//   }

//   const logout = () => {
//     setUser(null)
//   }

//   const updateUser = (userData) => {
//     setUser(prev => ({ ...prev, ...userData }))
//   }

//   const value = {
//     user,
//     login,
//     logout,
//     updateUser,
//     loading
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }