<template>
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <Sidebar :isSidebarOpen="isSidebarOpen" />
  
      <!-- Main Content Wrapper -->
      <div class="flex flex-col flex-grow">
        <!-- Dynamic Navbar -->
        <NavbarGuest v-if="!user" @toggleSidebar="toggleSidebar" />
        <NavbarUser v-else :title="pageTitle" @toggleSidebar="toggleSidebar" />
  
        <!-- Scrollable Content -->
        <main class="flex-grow overflow-y-auto px-8 py-4 mt-[82px]">
          <slot />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import Sidebar from '~/components/Sidebar.vue';
  import NavbarGuest from '~/components/NavbarGuest.vue';
  import NavbarUser from '~/components/NavbarUser.vue';
  
  const isSidebarOpen = ref(true);
  const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };
  
  // Track user authentication state
  const user = ref(null);
  onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
    });
  });
  
  // Get the current route
  const route = useRoute();
  
  // Define the page titles for different routes
  const pageTitles = {
    "/dashboard": "DASHBOARD",
    "/inventory": "INVENTORY",
    "/stock-record": "STOCK RECORD",
    "/availability": "AVAILABILITY",
    "/performance": "PERFORMANCE",
    "/transactions": "TRANSACTIONS",
    "/sales-receipt": "SALES RECEIPT",
    "/purchase-receipt": "PURCHASE RECEIPT",
  };
  
  // Compute the page title dynamically
  const pageTitle = computed(() => pageTitles[route.path] || "DASHBOARD");
  </script>
  