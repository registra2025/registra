<template>
    <aside
      v-show="isSidebarOpen"
      class="sidebar w-[360px] bg-[#0f233d] px-6 py-4 transition-all duration-300 flex-shrink-0 h-screen flex flex-col pt-[90px]"
    >
    <div class="flex justify-center pb-4">
      <NuxtLink :to="user ? '/dashboard' : '/'">
        <img
          src="/reg_logo_rm.png"
          alt="Logo"
          class="w-[200px] h-[200px] object-contain max-w-full max-h-full md:w-[300px] md:h-[200px] sm:w-[120px] sm:h-[120px]"
        />
      </NuxtLink>
    </div>
  
      <div class="flex-grow flex flex-col gap-2 overflow-y-auto">
        <template v-if="user">
          <NuxtLink to="/dashboard" class="text-white text-2xl block py-1">DASHBOARD</NuxtLink>
          <NuxtLink to="/inventory" class="text-white text-2xl block py-1">INVENTORY</NuxtLink>
          <NuxtLink to="/stock-record" class="text-white text-2xl block py-1">STOCK RECORD</NuxtLink>
          <NuxtLink to="/availability" class="text-white text-2xl block py-1">AVAILABILITY</NuxtLink>
          <NuxtLink to="/performance" class="text-white text-2xl block py-1">PERFORMANCE</NuxtLink>
          <NuxtLink to="/transactions" class="text-white text-2xl block py-1">TRANSACTIONS</NuxtLink>
          <NuxtLink to="/sales-receipt" class="text-white text-2xl block py-1">SALES RECEIPT</NuxtLink>
          <NuxtLink to="/purchase-receipt" class="text-white text-2xl block py-1">PURCHASE RECEIPT</NuxtLink>
        </template>
  
        <template v-else>
          <NuxtLink to="/about" class="text-white text-2xl block py-1">ABOUT US</NuxtLink>
          <NuxtLink to="/contact" class="text-white text-2xl block py-1">CONTACT US</NuxtLink>
          <NuxtLink to="/faq" class="text-white text-2xl block py-1">FAQ</NuxtLink>
          <NuxtLink to="/pricing" class="text-white text-2xl block py-1">PRICING</NuxtLink>
        </template>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  
  defineProps(["isSidebarOpen"]);
  
  const user = ref(null);
  
  onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
    });
  });
  </script>
  