"use client";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getFirestore, 
  Firestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  query,
  orderBy,
  limit,
  writeBatch
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDKyt5-UzvCOftPLMS_Uuf52MOyYCtw_nM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "devtechempid.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "devtechempid",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "devtechempid.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "936273036908",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:936273036908:web:02117199d021edb9e0ba49",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-S51VSWKWFK"
};

const isPlaceholderKey = (val?: string): boolean => {
  if (!val) return true;
  const v = val.trim();
  return (
    v === "" ||
    v.includes("your-") ||
    v.includes("placeholder")
  );
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !isPlaceholderKey(firebaseConfig.apiKey) &&
  !isPlaceholderKey(firebaseConfig.projectId)
);

let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

if (typeof window !== "undefined" || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  try {
    if (isFirebaseConfigured) {
      firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(firebaseApp);
      storage = getStorage(firebaseApp);
      auth = getAuth(firebaseApp);
      
      if (typeof window !== "undefined") {
        isSupported().then(supported => {
          if (supported && firebaseApp) {
            analytics = getAnalytics(firebaseApp);
          }
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.warn("Firebase initialization skipped or failed:", err);
  }
}

export { firebaseApp, db, storage, auth, analytics };
export { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  writeBatch
};
