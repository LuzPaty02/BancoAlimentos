import React, { createContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

//Importing the environment variables
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
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);


//createContext() is a react hook that allows components in a tree to easily access shared data 
//centralized access to Firebase services and the authenticated user's state
// allowing child components to easily access these resources throughout the application 
//without the need to pass props manually.
export const AuthContext = createContext<{ auth: any; db: any; user: FirebaseUser | null } | null>(null);


//Componente para autenticación
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

  //los children son los componentes que se encuentran dentro de este componente (ver App.tsx)
  return (
    <AuthContext.Provider value={{ auth, db, user }}>
      {children}
    </AuthContext.Provider>
  );
}
