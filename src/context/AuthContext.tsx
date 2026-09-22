import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS, mockStore } from '../firebase/mockStore';
import { subscribeToUserProfile } from '../firebase/firestoreService';
import { auth, isFirebaseConfigured, db } from '../firebase/config';
import {
  signInWithEmail,
  signUpWithEmail,
  logoutUser,
  SignUpParams,
  mapFirestoreDocToUserProfile,
} from '../firebase/authService';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: UserProfile;
  activeRole: UserRole;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (params: SignUpParams) => Promise<UserProfile>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateUserCarbonCredits: (delta: number) => void;
  isSimulatingLiveBids: boolean;
  toggleLiveBidSimulation: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('buyer');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('cropcronical_active_user'));
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cropcronical_active_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch {}
    }
    return INITIAL_USERS['buyer-1'];
  });
  const [isSimulatingLiveBids, setIsSimulatingLiveBids] = useState<boolean>(true);

  // Monitor Firebase Auth state change
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        // Look up user profile in Firestore
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const profile = mapFirestoreDocToUserProfile(firebaseUser.uid, userDoc.data());
              setCurrentUser(profile);
              setActiveRole(profile.role);
              localStorage.setItem('cropcronical_active_user', JSON.stringify(profile));
              setAuthLoading(false);
              return;
            }
          } catch (e) {
            console.warn('Error reading user doc on auth change:', e);
          }
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to real-time updates for currentUser.uid in the `users` collection
  useEffect(() => {
    const unsub = subscribeToUserProfile(currentUser.uid, (updatedUser) => {
      setCurrentUser((prev) => {
        if (prev.carbonCredits !== updatedUser.carbonCredits || prev.uid !== updatedUser.uid) {
          const merged = { ...prev, ...updatedUser };
          localStorage.setItem('cropcronical_active_user', JSON.stringify(merged));
          return merged;
        }
        return prev;
      });
    });
    return () => unsub();
  }, [currentUser.uid]);

  // Login handler
  const login = async (email: string, password: string): Promise<UserProfile> => {
    setAuthLoading(true);
    try {
      const user = await signInWithEmail({ email, password });
      setCurrentUser(user);
      setActiveRole(user.role);
      setIsAuthenticated(true);
      return user;
    } finally {
      setAuthLoading(false);
    }
  };

  // Registration handler
  const register = async (params: SignUpParams): Promise<UserProfile> => {
    setAuthLoading(true);
    try {
      const user = await signUpWithEmail(params);
      setCurrentUser(user);
      setActiveRole(user.role);
      setIsAuthenticated(true);
      return user;
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const logout = async (): Promise<void> => {
    setAuthLoading(true);
    try {
      await logoutUser();
      setIsAuthenticated(false);
      // Reset to initial demo profile
      setCurrentUser(INITIAL_USERS['buyer-1']);
      setActiveRole('buyer');
    } finally {
      setAuthLoading(false);
    }
  };

  // Switch role handler
  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'farmer') {
      setCurrentUser(INITIAL_USERS['farmer-1']);
    } else if (role === 'buyer') {
      setCurrentUser(INITIAL_USERS['buyer-1']);
    } else {
      setCurrentUser(INITIAL_USERS['driver-1']);
    }
  };

  const updateUserCarbonCredits = (delta: number) => {
    mockStore.updateCarbonCredits(currentUser.uid, delta);
    setCurrentUser((prev) => ({
      ...prev,
      carbonCredits: Math.round((prev.carbonCredits + delta) * 10) / 10,
    }));
  };

  const toggleLiveBidSimulation = () => {
    setIsSimulatingLiveBids((prev) => !prev);
  };

  // Background simulation of market bidding activity when enabled
  useEffect(() => {
    if (!isSimulatingLiveBids) return;

    const interval = setInterval(() => {
      // Simulate live incoming bids across industrial players
      mockStore.simulateIncomingBid();
    }, 28000); // every 28 seconds

    return () => clearInterval(interval);
  }, [isSimulatingLiveBids]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        isAuthenticated,
        authLoading,
        login,
        register,
        logout,
        switchRole,
        updateUserCarbonCredits,
        isSimulatingLiveBids,
        toggleLiveBidSimulation,
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
