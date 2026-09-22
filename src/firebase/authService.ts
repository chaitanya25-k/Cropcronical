import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';
import { mockStore, INITIAL_USERS } from './mockStore';
import { UserProfile, UserRole } from '../types';

export interface SignUpParams {
  email: string;
  password: string;
  role: 'farmer' | 'buyer';
  fullName: string;
  organization?: string;
  phone?: string;
  locationName?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

// Convert Firestore doc or fallback to UserProfile
export function mapFirestoreDocToUserProfile(uid: string, data: any): UserProfile {
  return {
    uid,
    fullName: data.fullName || 'CropCronical User',
    role: (data.role as UserRole) || 'farmer',
    email: data.email || '',
    phone: data.phone || '',
    organization: data.organization || (data.role === 'farmer' ? 'Green Valley Farm' : 'EcoUpcycling Industrial Hub'),
    carbonCredits: Number(data.carbonCredits || 0),
    location: data.location?.latitude && data.location?.longitude
      ? { latitude: data.location.latitude, longitude: data.location.longitude }
      : { latitude: 29.9695, longitude: 76.8783 },
  };
}

/**
 * Register a new Farmer or Industrial Buyer using Email & Password
 */
export async function signUpWithEmail(params: SignUpParams): Promise<UserProfile> {
  const { email, password, role, fullName, organization, phone, locationName } = params;

  // Coordinate estimation based on role / region
  const defaultLocation = role === 'farmer'
    ? { latitude: 29.9695, longitude: 76.8783 } // Agricultural hub
    : { latitude: 28.5355, longitude: 77.3910 }; // Industrial cluster

  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth Display Name
      try {
        await updateProfile(user, { displayName: fullName });
      } catch (profileErr) {
        console.warn('Failed to update displayName in Firebase Auth:', profileErr);
      }

      const initialCredits = role === 'farmer' ? 25.0 : 0.0; // Promotional onboarding credits for green farmers!

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        fullName,
        role,
        organization: organization || (role === 'farmer' ? `${fullName}'s Agro Farm` : 'Green Biomass Refining Corp'),
        phone: phone || '',
        carbonCredits: initialCredits,
        location: defaultLocation,
      };

      // Persist to Firestore `users/{uid}`
      if (db) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email || email,
            fullName,
            role,
            organization: userProfile.organization,
            phone: userProfile.phone,
            carbonCredits: initialCredits,
            location: new GeoPoint(defaultLocation.latitude, defaultLocation.longitude),
            locationName: locationName || (role === 'farmer' ? 'Ludhiana Agricultural Belt' : 'National Green Energy Corridor'),
            createdAt: serverTimestamp(),
          }, { merge: true });
        } catch (dbErr) {
          console.warn('Firestore user profile save notice:', dbErr);
        }
      }

      // Sync with local store
      mockStore.setUser(userProfile);
      localStorage.setItem('cropcronical_active_user', JSON.stringify(userProfile));

      return userProfile;
    } catch (authError: any) {
      console.warn('Firebase Auth signUp error:', authError);

      // Handle specific Firebase error codes
      if (authError.code === 'auth/operation-not-allowed') {
        const fallbackProfile: UserProfile = {
          uid: `farmer-custom-${Date.now().toString().slice(-4)}`,
          email,
          fullName,
          role,
          organization: organization || (role === 'farmer' ? `${fullName}'s Agro Farm` : 'Green Biomass Refining Corp'),
          phone: phone || '',
          carbonCredits: role === 'farmer' ? 25.0 : 0.0,
          location: defaultLocation,
        };
        mockStore.setUser(fallbackProfile);
        localStorage.setItem('cropcronical_active_user', JSON.stringify(fallbackProfile));
        return fallbackProfile;
      }

      if (authError.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email address already exists. Please log in instead.');
      }
      if (authError.code === 'auth/weak-password') {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (authError.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }

      throw new Error(authError.message || 'Failed to create account.');
    }
  }

  // Fallback if Firebase Auth is offline or in mock mode
  const newUid = `user-${Date.now().toString().slice(-5)}`;
  const localProfile: UserProfile = {
    uid: newUid,
    email,
    fullName,
    role,
    organization: organization || (role === 'farmer' ? `${fullName}'s Agro Farm` : 'Green Biomass Refining Corp'),
    phone: phone || '',
    carbonCredits: role === 'farmer' ? 25.0 : 0.0,
    location: defaultLocation,
  };
  mockStore.setUser(localProfile);
  localStorage.setItem('cropcronical_active_user', JSON.stringify(localProfile));
  return localProfile;
}

/**
 * Sign in existing Farmer or Industrial Buyer with Email & Password
 */
export async function signInWithEmail(params: SignInParams): Promise<UserProfile> {
  const { email, password } = params;

  // Quick check for matching demo users in mockStore
  const candidateUsers: UserProfile[] = [
    INITIAL_USERS['farmer-1'],
    INITIAL_USERS['buyer-1'],
    INITIAL_USERS['driver-1'],
    ...Object.values((mockStore as any).users as Record<string, UserProfile> || {}),
  ];
  const existingMockUser: UserProfile | undefined = candidateUsers.find(
    (u) => Boolean(u && u.email && u.email.toLowerCase() === email.toLowerCase())
  );

  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userProfile: UserProfile | null = null;

      // Fetch user profile from Firestore `users/{uid}`
      if (db) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            userProfile = mapFirestoreDocToUserProfile(user.uid, docSnap.data());
          }
        } catch (dbErr) {
          console.warn('Firestore fetch user profile notice:', dbErr);
        }
      }

      if (!userProfile) {
        // Fallback default profile if not in Firestore yet
        userProfile = {
          uid: user.uid,
          email: user.email || email,
          fullName: user.displayName || (email.split('@')[0].toUpperCase()),
          role: email.includes('buyer') || email.includes('industry') ? 'buyer' : 'farmer',
          organization: email.includes('buyer') ? 'Industrial Bio-Energy Plant' : 'Family Agro Farm',
          carbonCredits: 120.0,
          location: { latitude: 29.9695, longitude: 76.8783 },
        };

        if (db) {
          try {
            await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
          } catch {}
        }
      }

      mockStore.setUser(userProfile);
      localStorage.setItem('cropcronical_active_user', JSON.stringify(userProfile));
      return userProfile;
    } catch (authError: any) {
      console.warn('Firebase Auth signIn error:', authError);

      if (authError.code === 'auth/operation-not-allowed') {
        // If email/password provider is not yet activated in console, check if user matches demo
        if (existingMockUser) {
          localStorage.setItem('cropcronical_active_user', JSON.stringify(existingMockUser));
          return existingMockUser;
        }
        // Create demo session so user is never blocked
        const fallbackProfile: UserProfile = {
          uid: `usr-${Date.now().toString().slice(-4)}`,
          email,
          fullName: email.split('@')[0],
          role: email.includes('buyer') ? 'buyer' : 'farmer',
          organization: email.includes('buyer') ? 'Industrial BioCNG Ltd' : 'Heritage Organic Farms',
          carbonCredits: 148.5,
          location: { latitude: 29.9695, longitude: 76.8783 },
        };
        mockStore.setUser(fallbackProfile);
        localStorage.setItem('cropcronical_active_user', JSON.stringify(fallbackProfile));
        return fallbackProfile;
      }

      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
        // Check demo accounts
        if (existingMockUser) {
          localStorage.setItem('cropcronical_active_user', JSON.stringify(existingMockUser));
          return existingMockUser;
        }
        throw new Error('Invalid email or password. Please verify your credentials or register a new account.');
      }

      if (authError.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      }

      throw new Error(authError.message || 'Failed to sign in.');
    }
  }

  // Local fallback
  if (existingMockUser) {
    localStorage.setItem('cropcronical_active_user', JSON.stringify(existingMockUser));
    return existingMockUser;
  }

  const defaultRole: UserRole = email.includes('buyer') ? 'buyer' : 'farmer';
  const localProfile: UserProfile = {
    uid: `local-${Date.now().toString().slice(-4)}`,
    email,
    fullName: email.split('@')[0],
    role: defaultRole,
    organization: defaultRole === 'farmer' ? 'Local Agro Farm' : 'Regional Bio-Gas Utility',
    carbonCredits: defaultRole === 'farmer' ? 148.5 : 0,
    location: { latitude: 29.9695, longitude: 76.8783 },
  };
  mockStore.setUser(localProfile);
  localStorage.setItem('cropcronical_active_user', JSON.stringify(localProfile));
  return localProfile;
}

/**
 * Sign out current authenticated user
 */
export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
  }
  localStorage.removeItem('cropcronical_active_user');
}
