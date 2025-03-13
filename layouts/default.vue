<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute } from 'nuxt/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Sidebar from '~/components/Sidebar';
import NavbarGuest from '~/components/NavbarGuest';
import NavbarUser from '~/components/NavbarUser';

// Sidebar state management
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

// Track route changes reactively
const route = useRoute();
const pageTitle = ref("DASHBOARD");

const pageTitles = {
  "/dashboard": "DASHBOARD",
  "/inventory": "INVENTORY",
  "/stock-record": "STOCK RECORD",
  "/availability": "AVAILABILITY",
  "/performance": "PERFORMANCE",
  "/transactions": "TRANSACTIONS",
  "/sales-receipt": "SALES RECEIPT",
  "/purchase-receipt": "PURCHASE RECEIPT",
  "/purchase": "PURCHASE",
  "/sales": "SALES",
  "/scan": "SCAN",
};

watchEffect(() => {
  pageTitle.value = pageTitles[route.path] || "REGISTRA";
});
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar :isSidebarOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" />

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
