<template>
    <header class="w-full h-[82px] bg-white border-b-2 border-[#2966b1] flex items-center px-8 fixed top-0 left-0 right-0 z-50">
      <button @click="emit('toggleSidebar')" class="text-[#2966b1] text-[32px] p-2">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <h1 class="text-[#2966b1] text-[32px] ml-4">DASHBOARD</h1>
      <div class="ml-auto">
        <!-- Conditionally render the link -->
        <NuxtLink v-if="!user" to="/login" class="text-black text-[32px] hover:text-[#2966b1]">
          LOGIN
        </NuxtLink>
        <a v-else @click="logout" class="text-black text-[32px] hover:text-[#2966b1] cursor-pointer">
          LOGOUT
        </a>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref, onMounted, defineEmits } from 'vue';
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { navigateTo } from '#app'; // Use Nuxt's navigation
  
  const user = ref(null);
  const emit = defineEmits(['toggleSidebar']);
  
  // Listen to Firebase auth state changes
  onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
    });
  });
  
  // Logout function
  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      user.value = null;
      navigateTo("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  </script>
  