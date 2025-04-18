import { defineNuxtPlugin } from "#app";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBZ_2s2w9IYWmlScbC6rpwXHk6hd6Rlmck",
    authDomain: "registra-ddd8f.firebaseapp.com",
    projectId: "registra-ddd8f",
    storageBucket: "registra-ddd8f.firebasestorage.app",
    messagingSenderId: "472865052274",
    appId: "1:472865052274:web:7ae2f2c16992060d7e14eb"
};

export default defineNuxtPlugin(() => {
  if (process.client) {
    // Ensure Firebase is initialized only once on the client
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    return {
      provide: {
        firestore: getFirestore(app),
        auth: getAuth(app)
      },
    };
  }
});