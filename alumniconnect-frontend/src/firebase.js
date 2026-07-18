import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDye17iP_t7bH88LsDN-vZNqMWIWJlcTHk",
  authDomain: "lumnus-web.firebaseapp.com",
  projectId: "lumnus-web",
  storageBucket: "lumnus-web.firebasestorage.app",
  messagingSenderId: "168856390325",
  appId: "1:168856390325:web:90b7a3f06d1d36270c8cfc",
  measurementId: "G-4ZSCSNBJ3K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail };
