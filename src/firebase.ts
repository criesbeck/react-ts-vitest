// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyBpCK4TIWJ_jDAPt9-7oZIwk5Ig2Dd1RYA",
  authDomain: "flushrush-a2eaa.firebaseapp.com",
  databaseURL: "https://flushrush-a2eaa-default-rtdb.firebaseio.com",
  projectId: "flushrush-a2eaa",
  storageBucket: "flushrush-a2eaa.firebasestorage.app",
  messagingSenderId: "170697941156",
  appId: "1:170697941156:web:c98d1754b12b68a8a70631",
  measurementId: "G-5DZ7CR5SD5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const rtdb = getDatabase(app);

export { app, analytics, db, auth, storage, rtdb };
