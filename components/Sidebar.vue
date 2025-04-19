<template>
    <aside
      v-show="isSidebarOpen"
      class="sidebar w-[fit] bg-[#1c4375] px-6 py-4 transition-all duration-300 flex-shrink-0 h-[calc(100vh-0.5rem)] flex flex-col pt-[90px] rounded-[15px] m-1 shadow-lg">
      <div class="flex flex-col items-center ">
      <NuxtLink :to="user ? '/dashboard' : '/'">
        <img
          src="/reg_logo_rm.png"
          alt="Logo"
          class="w-[200px] h-[200px] object-contain max-w-full max-h-full md:w-[270px] md:h-[200px] sm:w-[120px] sm:h-[120px]"
        />
      </NuxtLink>
  
      <div class="flex flex-col gap-2 w-full overflow-y-auto">
        <template v-if="user">
         <NuxtLink to="/dashboard" class="min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center text-black pl-4 text-[25px] font-normal">DASHBOARD</NuxtLink>
         <NuxtLink to="/cart" class="min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center pl-4 text-black text-[25px] font-normal">CART</NuxtLink>
         <!-- <NuxtLink to="/sales-receipt" class="w-[307px] min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center pl-4 text-black text-[25px] font-normal">SALES RECEIPT</NuxtLink> -->
         <NuxtLink to="/purchase-receipt" class=" min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center pl-4 text-black text-[25px] font-normal">PURCHASE RECEIPT</NuxtLink>
        </template>
  
        <template v-else>
          <NuxtLink to="/about" class="h-[49px] bg-[#ffffff] rounded-[7px] flex items-center text-black pl-4 text-[25px] font-normal">ABOUT US</NuxtLink>
          <NuxtLink to="/contact" class="h-[49px] bg-[#ffffff] rounded-[7px] flex items-center text-black pl-4 text-[25px] font-normal">CONTACT US</NuxtLink>
          <NuxtLink to="/faq" class="h-[49px] bg-[#ffffff] rounded-[7px] flex items-center text-black pl-4 text-[25px] font-normal">FAQ</NuxtLink>
          <NuxtLink to="/pricing" class="h-[49px] bg-[#ffffff] rounded-[7px] flex items-center text-black  pl-4 text-[25px] font-normal">PRICING</NuxtLink>
        </template>
      </div>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { onAuthStateChanged } from "firebase/auth";
  
  defineProps(["isSidebarOpen"]);
  
  const user = ref(null);
  
  onMounted(() => {
  if (process.client) {
    const { $auth } = useNuxtApp();
    onAuthStateChanged($auth, (firebaseUser) => {
      user.value = firebaseUser;
    });
  }
});
  </script>
  