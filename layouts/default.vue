<template>
    <div class="flex min-h-screen">
      <!-- Sidebar (Scrollable) -->
      <aside
        v-show="isSidebarOpen"
        class="sidebar w-[382px] bg-[#0f233d] px-6 py-4 transition-all duration-300 flex-shrink-0 h-screen flex flex-col pt-[90px]"
      >
        <!-- Fixed Logo at the Top -->
        <div class="flex justify-center pb-4">
          <img
            src="/reg_logo_rm.jpg"
            alt="Logo"
            class="w-[200px] h-[200px] object-contain max-w-full max-h-full md:w-[300px] md:h-[200px] sm:w-[120px] sm:h-[120px]"
          />
        </div>
  
        <!-- Scrollable Navigation -->
        <div class="flex-grow flex flex-col gap-2 overflow-y-auto">
          <NuxtLink to="/dashboard" class="text-white text-2xl block py-1">DASHBOARD</NuxtLink>
          <NuxtLink to="/inventory" class="text-white text-2xl block py-1">INVENTORY</NuxtLink>
          <NuxtLink to="/stock-record" class="text-white text-2xl block py-1">STOCK RECORD</NuxtLink>
          <NuxtLink to="/availability" class="text-white text-2xl block py-1">AVAILABILITY</NuxtLink>
          <NuxtLink to="/performance" class="text-white text-2xl block py-1">PERFORMANCE</NuxtLink>
          <NuxtLink to="/transactions" class="text-white text-2xl block py-1">TRANSACTIONS</NuxtLink>
          <NuxtLink to="/sales-receipt" class="text-white text-2xl block py-1">SALES RECEIPT</NuxtLink>
          <NuxtLink to="/purchase-receipt" class="text-white text-2xl block py-1">PURCHASE RECEIPT</NuxtLink>
        </div>
      </aside>
  
      <!-- Main Content Wrapper -->
      <div class="flex flex-col flex-grow">
        <!-- Navbar (Fixed at the top) -->
        <header class="w-full h-[82px] bg-white border-b-2 border-[#2966b1] flex items-center px-8 fixed top-0 left-0 right-0 z-50">
          <button @click="toggleSidebar" class="text-[#2966b1] text-[32px] p-2">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <h1 class="text-[#2966b1] text-[32px] ml-4">DASHBOARD</h1>
          <div class="ml-auto">
            <!-- Conditionally render the link -->
            <a
              v-if="!user"
              href="/login"
              class="text-black text-[32px] hover:text-[#2966b1]"
            >
              LOGIN
            </a>
            <a
              v-else
              @click="logout"
              class="text-black text-[32px] hover:text-[#2966b1] cursor-pointer"
            >
              LOGOUT
            </a>
          </div>
        </header>
  
        <!-- Scrollable Content -->
        <main class="flex-grow overflow-y-auto px-8 py-4 mt-[82px]">
          <slot />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  // Sidebar toggle
  const isSidebarOpen = ref(true);
  const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };
  
  // Reactive user state
  const user = ref(null);
  const router = useRouter();
  
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
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  </script>
  
  <style scoped>
  /* Sidebar transition */
  .sidebar {
    transition: transform 0.3s ease-in-out;
    height: 100vh;
    overflow-y: auto; /* Enables scrolling */
  }
  
  /* Sidebar when hidden */
  .sidebar[style*="display: none"] {
    transform: translateX(-100%);
  }
  
  /* Ensuring the navigation links don't expand sidebar height */
  .sidebar nav {
    display: flex;
    flex-direction: column;
    justify-content: start; /* Prevents stretching */
  }
  
  /* Adjust for smaller screens */
  @media (max-width: 1024px) {
    .text-[32px] {
      font-size: 24px;
    }
  }
  </style>
  