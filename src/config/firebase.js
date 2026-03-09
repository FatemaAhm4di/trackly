import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from 'firebase/auth';

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

export { auth, googleProvider, facebookProvider, githubProvider };