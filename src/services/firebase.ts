// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlgniUqfDScz7TUjpFmDd8YKdam0__M2I",
  authDomain: "larreluxe-ac3c5.firebaseapp.com",
  projectId: "larreluxe-ac3c5",
  storageBucket: "larreluxe-ac3c5.firebasestorage.app",
  messagingSenderId: "97551991487",
  appId: "1:97551991487:web:c1640d353a6eb37d37fc0a",
  measurementId: "G-E9B8T7LDTC"
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
