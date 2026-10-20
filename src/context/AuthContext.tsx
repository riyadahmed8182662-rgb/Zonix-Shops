/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, BOOTSTRAP_ADMIN_EMAIL } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync profile & admin status from Firestore
  const syncUserData = async (currentUser: User) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      const isBootstrapAdmin = currentUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

      // Check admin doc
      let adminVerified = false;
      try {
        const adminSnap = await getDoc(doc(db, 'admins', currentUser.uid));
        if (adminSnap.exists()) {
          adminVerified = true;
        }
      } catch (e) {
        // Ignored if unprivileged
      }

      if (isBootstrapAdmin && !adminVerified) {
        // Bootstrap admin record in /admins/{uid}
        try {
          await setDoc(doc(db, 'admins', currentUser.uid), {
            id: currentUser.uid,
            email: currentUser.email,
            role: 'super_admin',
            grantedAt: new Date().toISOString()
          }, { merge: true });
          adminVerified = true;
        } catch (e) {
          console.warn('Bootstrap admin doc sync:', e);
        }
      }

      setIsAdmin(isBootstrapAdmin || adminVerified);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setUserProfile(data);
      } else {
        // First-time profile initialization
        const initialProfile: UserProfile = {
          id: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Customer',
          phone: currentUser.phoneNumber || '',
          role: (isBootstrapAdmin || adminVerified) ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        try {
          await setDoc(userRef, initialProfile);
          setUserProfile(initialProfile);
        } catch (err) {
          console.warn('Profile doc initialization:', err);
          setUserProfile(initialProfile);
        }
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserData(currentUser);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    await syncUserData(cred.user);
  };

  const register = async (email: string, pass: string, name: string, phone?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (name) {
      await updateFirebaseProfile(cred.user, { displayName: name });
    }
    const isBootstrapAdmin = email.trim().toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
    const newProfile: UserProfile = {
      id: cred.user.uid,
      email: cred.user.email || email.trim(),
      displayName: name || email.split('@')[0],
      phone: phone || '',
      role: isBootstrapAdmin ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${cred.user.uid}`);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await syncUserData(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Not logged in');
    const updatePayload = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    try {
      await updateDoc(doc(db, 'users', user.uid), updatePayload);
      setUserProfile(prev => prev ? { ...prev, ...updatePayload } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await syncUserData(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        updateUserProfileData,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
