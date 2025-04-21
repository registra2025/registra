<template>
    <aside v-show="isSidebarOpen" class="w-full h-full">
    <!-- Sidebar Content Wrapper (scrollable) -->
    <div class="flex flex-col items-center px-6 py-4 h-fit">
      <!-- Logo -->
      <NuxtLink to="/">
        <img
          src="/reg_logo_rm.png"
          alt="Logo"
          class="w-[200px] h-[200px] object-contain max-w-full max-h-full md:w-[270px] md:h-[200px] sm:w-[120px] sm:h-[120px]"
        />
      </NuxtLink>
  
      <!-- Guest Links -->
      <div class="flex flex-col gap-2 w-full overflow-y-auto">
        <NuxtLink to="/about" class="h-[49px] bg-[#ffffff] rounded-[7px] flex items-center text-black pl-4 text-xl sm:text-2xl font-normal">ABOUT US</NuxtLink>
        <NuxtLink to="/contact" class="h-[49px] bg-[#ffffff] rounded-[7px] flex items-center text-black pl-4 text-xl sm:text-2xl font-normal">CONTACT US</NuxtLink>
        <NuxtLink to="/faq" class="h-[49px] bg-[#ffffff] rounded-[7px] flex items-center text-black pl-4 text-xl sm:text-2xl font-normal">FAQ</NuxtLink>
        <NuxtLink to="/pricing" class="h-[49px] bg-[#ffffff] rounded-[7px] flex items-center text-black pl-4 text-xl sm:text-2xl font-normal">PRICING</NuxtLink>
      </div>
      </div>
    </aside>
  </template>
  
  <script setup>
  
  defineProps(["isSidebarOpen"]);
  
  
  
  </script>
  