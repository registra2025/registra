import { defineNuxtPlugin } from "#app";
import { initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBZ_2s2w9IYWmlScbC6rpwXHk6hd6Rlmck",
    authDomain: "registra-ddd8f.firebaseapp.com",
    projectId: "registra-ddd8f",
    storageBucket: "registra-ddd8f.firebasestorage.app",
    messagingSenderId: "472865052274",
    appId: "1:472865052274:web:7ae2f2c16992060d7e14eb"
};

export default defineNuxtPlugin(nuxtApp => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    const storage = getStorage(app);
    
    // Always return an object, even if empty, for SSR safety
    nuxtApp.provide("auth", auth);
    nuxtApp.provide("firestore", firestore);
    nuxtApp.provide("storage", storage);
});