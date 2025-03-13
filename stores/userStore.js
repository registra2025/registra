import { ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const userStore = {
  user: ref(null),
  initialize() {
    const auth = getAuth();
    // Set up an observer for the user's authentication state
    onAuthStateChanged(auth, (firebaseUser) => {
      this.user.value = firebaseUser;
    });
  },
};
