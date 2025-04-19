<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute } from 'nuxt/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Sidebar from '~/components/Sidebar.vue';
import SidebarAdmin from '~/components/SidebarAdmin.vue';
import NavbarGuest from '~/components/NavbarGuest.vue';
import NavbarUser from '~/components/NavbarUser.vue';

// Sidebar toggle
const isSidebarOpen = ref(true);
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };

// Track user and admin
const user = ref(null);
const isAdmin = ref(false);

onMounted(() => {

    const auth = getAuth();
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
      isAdmin.value = firebaseUser?.email === 'admin@registra.com';
    });

});

// Page title logic
const route = useRoute();
const pageTitle = ref("DASHBOARD");

const pageTitles = {
  "/dashboard": "DASHBOARD",
  "/dashboard-admin": "DASHBOARD-ADMIN",
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
   <div class="flex h-screen overflow-hidden">
     <!-- Conditional Sidebar -->
     <component
       :is="isAdmin ? SidebarAdmin : Sidebar"
       :isSidebarOpen="isSidebarOpen"
       @toggleSidebar="toggleSidebar"
       class="overflow-y-auto"
     />
 
     <!-- Main Content -->
     <div class="flex flex-col flex-1 overflow-hidden">
       <!-- Navbar -->
       <NavbarGuest v-if="!user" @toggleSidebar="toggleSidebar" />
       <NavbarUser v-else :title="pageTitle" @toggleSidebar="toggleSidebar" />
 
       <!-- Main slot -->
       <main class="flex-1 overflow-y-auto px-4 py-4 mt-[95px] m-1 rounded-[15px] bg-white dark:bg-darkBg shadow-md">
         <slot />
       </main>
     </div>
   </div>
 </template>
 
