import React, { createContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { browserLocalPersistence, setPersistence, initializeAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// Importing the environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth: Auth = initializeAuth(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export const db: Firestore = getFirestore(app);

// Placeholder for platform-specific recaptcha setup
export const setupRecaptcha = () => {
  if (Platform.OS === 'web') {
    // Logic for web platforms
    console.warn("ReCAPTCHA setup for web is not implemented in this file.");
  } else {
    console.warn("ReCAPTCHA setup for native platforms will require custom integration.");
  }
};

// AuthContext for centralized state
export const AuthContext = createContext<{ auth: any; db: any; user: FirebaseUser | null } | null>(null);

export default function Authentication({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        console.log("User is validated: " + firebaseUser.email);
      } else {
        setUser(null);
        console.log("Logged out");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, db, user }}>
      {children}
    </AuthContext.Provider>
  );
}
