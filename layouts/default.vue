
<script setup>
import { ref, onMounted, watchEffect, onBeforeUnmount } from 'vue';
import { useRoute } from 'nuxt/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Sidebar from '~/components/Sidebar.vue';
import SidebarUser from '~/components/SidebarUser.vue';
import SidebarAdmin from '~/components/SidebarAdmin.vue';
import NavbarGuest from '~/components/NavbarGuest.vue';
import NavbarUser from '~/components/NavbarUser.vue';
import NavbarAdmin from '~/components/NavbarAdmin.vue';

// Sidebar toggle
const isSidebarOpen = ref(false);
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };

// Track user and admin via Firebase auth
const user = ref(null);
const isAdmin = ref(false);

onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, firebaseUser => {
        user.value = firebaseUser;
        isAdmin.value = firebaseUser?.email?.endsWith('@registra.com');
    });
});

// Page title logic
const route = useRoute();
const pageTitle = ref("REGISTRA");
const isSidebarHovered = ref(false);

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
    "/pr-receipt": "RECEIPT",
    "/my-receipts": "MY RECEIPT",
    "/purchase": "BUY",
    "/sales": "SALES",
    "/scan": "SCAN",
    "/stock-item": "STOCK ITEM",
    "/customer-sales": "CUSTOMER SALES",
    "/customer-receipts": "CUSTOMER RECEIPTS"
};

watchEffect(() => {
    pageTitle.value = pageTitles[route.path] || "REGISTRA";
});

// Auto-hide sidebar after 3s if main content is interacted with
let hideTimeout = null;
// const handleMainInteraction = () => {
//     if (isSidebarHovered.value) return; // Don't auto-close if hovered
//     clearTimeout(hideTimeout);
//     hideTimeout = setTimeout(() => {
//         isSidebarOpen.value = false;
//     }, 5000);
// };

onBeforeUnmount(() => {
    clearTimeout(hideTimeout);
});

// Splash screen visibility
const splashVisible = ref(true);
onMounted(() => setTimeout(() => splashVisible.value = false, 500));
</script>

<template>
    <div v-if="splashVisible" class="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <img src="/reg_logo_rm.png" alt="Registra Logo" class="h-16 lg:h-24 mb-4" />
        <svg class="animate-spin h-6 w-6 lg:h-8 lg:w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    </div>
    <div v-else class="min-h-screen w-screen overflow-x-hidden overflow-y-hidden flex flex-col">
        <!-- Fixed Navbar -->
        <div class="fixed top-0 left-0 right-0 z-50">
            <NavbarGuest v-if="!user" @toggleSidebar="toggleSidebar" />
            <NavbarAdmin v-else-if="isAdmin" :title="pageTitle" @toggleSidebar="toggleSidebar" />
            <NavbarUser v-else :title="pageTitle" @toggleSidebar="toggleSidebar" />
        </div>
        
        <!-- Sidebar + Main Content -->
        <div class="flex pt-[74px] h-[100vh]">
            <!-- Sidebar -->
            <div
              class="bg-primary border-2 border-primary flex-shrink-0 m-2 rounded-[15px] shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in-out"
              :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }"
              @mouseenter="isSidebarHovered = true"
              @mouseleave="isSidebarHovered = false"
            >
            <component
            :is="isAdmin ? SidebarAdmin : user ? SidebarUser : Sidebar"
            :isSidebarOpen="isSidebarOpen"
            @toggleSidebar="toggleSidebar"
            />
        </div>
        
        <!-- Main Content -->
        <main
        class="flex-grow m-2 overflow-y-auto p-4 -ml-0.5 rounded-[15px] border-2 border-primary bg-white dark:bg-darkBg shadow-md"
        @click="handleMainInteraction"
        @mouseenter="handleMainInteraction"
        @touchstart="handleMainInteraction"
        >
        <slot />
    </main>
</div>
</div>
</template>
