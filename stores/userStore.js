import { ref, computed } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';

// userStore.js
export const userStore = {
   user: ref(null),
   isAdmin: ref(false),
   isAuthenticated: computed(() => !!userStore.user.value),
 
   initialize() {
  if (!process.client) return;
  const { $auth } = useNuxtApp();
  onAuthStateChanged($auth, (firebaseUser) => {
    this.user.value = firebaseUser;
    this.isAdmin.value = firebaseUser?.email === "admin@registra.com";
  });
   },
 };
 
