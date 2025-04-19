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
   <div class="min-h-screen w-screen overflow-x-hidden overflow-y-hidden flex flex-col">
     <!-- Fixed Navbar -->
     <div class="fixed top-0 left-0 right-0 z-50">
      <NavbarGuest v-if="!user" @toggleSidebar="toggleSidebar" />
      <NavbarUser v-else :title="pageTitle" @toggleSidebar="toggleSidebar" />
    </div>
 
     <!-- Sidebar + Main Content -->
     <div class="flex pt-[74px] h-[100vh]">
       <!-- Sidebar (hidden on mobile) -->
       <div class=" bg-[#1c4375] flex-shrink-0 m-2 transition-all duration-300 h-[100] pt-[15px] rounded-[15px] shadow-lg overflow-y-auto">
         <component
           :is="isAdmin ? SidebarAdmin : Sidebar"
           :isSidebarOpen="isSidebarOpen"
           @toggleSidebar="toggleSidebar"
         />
       </div>
 
       <!-- Main Content -->
       <main class="flex-1 overflow-y-auto p-4 m-2 rounded-[15px] bg-white dark:bg-darkBg shadow-md">
         <slot />
       </main>
     </div>
   </div>
 </template>
 
 
 
 
