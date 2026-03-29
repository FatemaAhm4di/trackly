// import { db } from '../config/firebase'
// import { doc, setDoc, getDoc } from 'firebase/firestore'

// // 📤 ذخیره در cloud
// export const backupGoals = async (userId, goals) => {
//   try {
//     await setDoc(doc(db, 'users', userId), {
//       goals,
//       updatedAt: new Date()
//     })

//     return { success: true }
//   } catch (error) {
//     return { success: false, error: error.message }
//   }
// }

// // 📥 گرفتن از cloud
// export const restoreGoals = async (userId) => {
//   try {
//     const docRef = doc(db, 'users', userId)
//     const snap = await getDoc(docRef)

//     if (!snap.exists()) {
//       return { success: false, error: 'No backup found' }
//     }

//     return { success: true, data: snap.data().goals }

//   } catch (error) {
//     return { success: false, error: error.message }
//   }
// }