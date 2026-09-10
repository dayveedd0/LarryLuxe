// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6DGU0fBPea395RwXuH5Oesdbh-6FNznc",
  authDomain: "larreluxe.firebaseapp.com",
  projectId: "larreluxe",
  storageBucket: "larreluxe.firebasestorage.app",
  messagingSenderId: "535426138265",
  appId: "1:535426138265:web:85bf96cde0d28340e6b808",
  measurementId: "G-VKQ2G2YFDH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence support
export const db = getFirestore(app);

// Enable offline persistence gracefully if supported in browser
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence not supported in this browser');
    }
  });
}

// Initialize Analytics safely
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional fallback
  });
}

export default app;
