import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import {
  auth, googleProvider,
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, sendPasswordResetEmail
} from '../firebase';
import { fetchSignInMethodsForEmail, linkWithCredential, EmailAuthProvider } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ac_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('ac_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseIdToken = await userCredential.user.getIdToken();
      const res = await api.post('/auth/firebase-login', { token: firebaseIdToken });
      localStorage.setItem('ac_token', res.data.token);
      setUser(res.data);
      return res.data;
    } catch (err) {
      // Check if user exists but signed up with Google only
      if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found'
      ) {
        try {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods.includes('google.com') && !methods.includes('password')) {
            throw new Error('This email is linked to Google Sign-In. Please use the "Continue with Google" button below.');
          }
        } catch (checkErr) {
          if (checkErr.message.includes('Google Sign-In')) throw checkErr;
          // If fetchSignInMethods also fails, fall through
        }
      }
      throw err;
    }
  };

  const loginWithGoogle = async (role) => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseIdToken = await result.user.getIdToken();
    const res = await api.post('/auth/firebase-login', { token: firebaseIdToken, role });

    // Backend signals that this is a new user and needs a role selection
    if (res.status === 202 && res.data?.needsRole) {
      const err = new Error('NEEDS_ROLE');
      err.needsRole = true;
      err.firebaseIdToken = firebaseIdToken;
      throw err;
    }

    localStorage.setItem('ac_token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const loginWithGoogleAndRole = async (firebaseIdToken, role, batch) => {
    const res = await api.post('/auth/firebase-login', { token: firebaseIdToken, role, batch });
    localStorage.setItem('ac_token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (payload) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
      const firebaseIdToken = await userCredential.user.getIdToken();
      const res = await api.post('/auth/firebase-register', {
        token: firebaseIdToken,
        name: payload.name,
        role: payload.role,
        batch: payload.batch,
        branch: payload.branch,
        company: payload.company
      });
      localStorage.setItem('ac_token', res.data.token);
      setUser(res.data);
      return res.data;
    } catch (err) {
      // If user already signed up with Google, link email/password to existing account
      if (err.code === 'auth/email-already-in-use') {
        try {
          const methods = await fetchSignInMethodsForEmail(auth, payload.email);
          if (methods.includes('google.com')) {
            // Sign in with Google first, then link email/password
            const googleResult = await signInWithPopup(auth, googleProvider);
            const credential = EmailAuthProvider.credential(payload.email, payload.password);
            await linkWithCredential(googleResult.user, credential);
            const firebaseIdToken = await googleResult.user.getIdToken();
            const res = await api.post('/auth/firebase-register', {
              token: firebaseIdToken,
              name: payload.name,
              role: payload.role,
              batch: payload.batch,
              branch: payload.branch,
              company: payload.company
            });
            localStorage.setItem('ac_token', res.data.token);
            setUser(res.data);
            return res.data;
          }
        } catch (linkErr) {
          throw new Error('This email is already registered. Try logging in instead.');
        }
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase signOut error', err);
    }
    localStorage.removeItem('ac_token');
    setUser(null);
  };

  const resetPassword = async (email) => {
    // Check what providers the email is linked to
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length === 0) {
      throw new Error('No account found with this email address.');
    }
    if (methods.includes('google.com') && !methods.includes('password')) {
      throw new Error('This account uses Google Sign-In and has no password. Please use the "Continue with Google" button to log in.');
    }
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, loginWithGoogle, loginWithGoogleAndRole, register, logout, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

