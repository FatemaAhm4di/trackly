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

// Scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');
githubProvider.addScope('user:email');

// ========== توابع Cloud Backup با دیباگ ==========

// 📤 پشتیبان‌گیری از اهداف
export const backupGoalsToCloud = async (userId, goals) => {
  console.log('🔵 [BACKUP] Function called');
  console.log('🔵 [BACKUP] userId:', userId);
  console.log('🔵 [BACKUP] goals count:', goals?.length);
  
  if (!userId) {
    console.log('🔴 [BACKUP] ERROR: No userId');
    throw new Error('User not authenticated');
  }
  
  try {
    const userDocRef = doc(db, 'users', userId);
    console.log('🔵 [BACKUP] Document reference:', userDocRef.path);
    
    const backupData = {
      goals: goals,
      lastBackup: new Date().toISOString(),
      version: '1.0'
    };
    
    console.log('🟢 [BACKUP] Saving to Firestore:', backupData);
    await setDoc(userDocRef, { backup: backupData }, { merge: true });
    console.log('✅ [BACKUP] Success!');
    
    return { success: true, timestamp: backupData.lastBackup };
  } catch (error) {
    console.error('❌ [BACKUP] Error:', error);
    console.error('❌ [BACKUP] Error code:', error.code);
    console.error('❌ [BACKUP] Error message:', error.message);
    throw error;
  }
};

// 📥 بازیابی اهداف از فضای ابری
export const restoreGoalsFromCloud = async (userId) => {
  console.log('🔵 [RESTORE] Function called');
  console.log('🔵 [RESTORE] userId:', userId);
  
  if (!userId) {
    console.log('🔴 [RESTORE] ERROR: No userId');
    throw new Error('User not authenticated');
  }
  
  try {
    const userDocRef = doc(db, 'users', userId);
    console.log('🔵 [RESTORE] Document reference:', userDocRef.path);
    
    const docSnap = await getDoc(userDocRef);
    console.log('🟢 [RESTORE] Document exists:', docSnap.exists());
    
    if (docSnap.exists() && docSnap.data().backup) {
      const backupData = docSnap.data().backup;
      console.log('✅ [RESTORE] Found backup:', {
        goalsCount: backupData.goals?.length,
        timestamp: backupData.lastBackup,
        version: backupData.version
      });
      return {
        success: true,
        goals: backupData.goals,
        timestamp: backupData.lastBackup
      };
    }
    
    console.log('🟡 [RESTORE] No backup found');
    return { success: false, error: 'No backup found' };
  } catch (error) {
    console.error('❌ [RESTORE] Error:', error);
    console.error('❌ [RESTORE] Error code:', error.code);
    console.error('❌ [RESTORE] Error message:', error.message);
    throw error;
  }
};

export { auth, db, googleProvider, facebookProvider, githubProvider };