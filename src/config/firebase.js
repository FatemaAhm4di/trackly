import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  GithubAuthProvider 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7WN1cm4TL1aQL_uzOfuUzGEJBorycbvs",
  authDomain: "trackly-6c907.firebaseapp.com",
  projectId: "trackly-6c907",
  storageBucket: "trackly-6c907.firebasestorage.app",
  messagingSenderId: "912300533367",
  appId: "1:912300533367:web:8865781781d373deacc872",
  measurementId: "G-G2FR9JB7DJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

// Optional: Add scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');
githubProvider.addScope('user:email');

// ✅ توابع جدید برای Cloud Backup
export const backupGoalsToCloud = async (userId, goals) => {
  if (!userId) throw new Error('User not authenticated');
  
  const userDocRef = doc(db, 'users', userId);
  const backupData = {
    goals: goals,
    lastBackup: new Date().toISOString(),
    version: '1.0'
  };
  
  await setDoc(userDocRef, { backup: backupData }, { merge: true });
  return { success: true, timestamp: backupData.lastBackup };
};

export const restoreGoalsFromCloud = async (userId) => {
  if (!userId) throw new Error('User not authenticated');
  
  const userDocRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userDocRef);
  
  if (docSnap.exists() && docSnap.data().backup) {
    return {
      success: true,
      goals: docSnap.data().backup.goals,
      timestamp: docSnap.data().backup.lastBackup
    };
  }
  return { success: false, error: 'No backup found' };
};

export { auth, db, googleProvider, facebookProvider, githubProvider };