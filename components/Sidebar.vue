<template>
    <aside
      v-show="isSidebarOpen"
      class="sidebar w-[fit] bg-[#0f233d] px-6 py-4 transition-all duration-300 flex-shrink-0 h-[calc(100vh-0.5rem)] flex flex-col pt-[90px] rounded-[15px] m-1 shadow-lg">
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
         <NuxtLink to="/dashboard" class="w-[307px] min-h-[49px] bg-[#1C4577] rounded-[7px] flex items-center text-white pl-4 text-[25px] font-light">DASHBOARD</NuxtLink>
         <NuxtLink to="/cart" class="w-[307px] min-h-[49px] bg-[#1C4577] rounded-[7px] flex items-center pl-4 text-white text-[25px] font-light">CART</NuxtLink>
         <NuxtLink to="/sales-receipt" class="w-[307px] min-h-[49px] bg-[#1C4577] rounded-[7px] flex items-center pl-4 text-white text-[25px] font-light">SALES RECEIPT</NuxtLink>
        </template>
  
        <template v-else>
          <NuxtLink to="/about" class="w-[307px] h-[49px] bg-[#1C4577] rounded-[7px] flex items-center text-white pl-4 text-[25px] font-light">ABOUT US</NuxtLink>
          <NuxtLink to="/contact" class="w-[307px] h-[49px] bg-[#1C4577] rounded-[7px] flex items-center text-white pl-4 text-[25px] font-light">CONTACT US</NuxtLink>
          <NuxtLink to="/faq" class="w-[307px] h-[49px] bg-[#1C4577] rounded-[7px] flex items-center text-white pl-4 text-[25px] font-light">FAQ</NuxtLink>
          <NuxtLink to="/pricing" class="w-[307px] h-[49px] bg-[#1C4577] rounded-[7px] flex items-center text-white pl-4 text-[25px] font-light">PRICING</NuxtLink>
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
  