<template>
   <aside
     v-show="isSidebarOpen"
     class="sidebar w-[fit] bg-[#1c4375] px-6 py-4 transition-all duration-300 flex-shrink-0 h-[calc(100vh-0.5rem)] flex flex-col pt-[90px] rounded-[15px] m-1 shadow-lg">
     <div class="flex justify-center pb-4">
       <NuxtLink to="/dashboard-admin">
         <img
           src="/reg_logo_rm.png"
           alt="Logo"
           class="w-[200px] h-[200px] object-contain max-w-full max-h-full md:w-[300px] md:h-[200px] sm:w-[120px] sm:h-[120px]"
         />
       </NuxtLink>
     </div>

     <div class="flex-grow flex flex-col gap-2 overflow-y-auto">
      <NuxtLink to="/dashboard-admin" class="w-[307px] min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center text-black pl-4 text-[25px] font-normal">DASHBOARD</NuxtLink>
         <NuxtLink to="/cart" class="w-[307px] min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center pl-4 text-black text-[25px] font-normal">CART</NuxtLink>
         <NuxtLink to="/inventory" class="w-[307px] min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center pl-4 text-black text-[25px] font-normal">INVENTORY</NuxtLink>
         <NuxtLink to="/stock-record" class="w-[307px] min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center pl-4 text-black text-[25px] font-normal">STOCK RECORD</NuxtLink>
         <NuxtLink to="/performance" class="w-[307px] min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center pl-4 text-black text-[25px] font-normal">PERFORMANCE</NuxtLink>
         <NuxtLink to="/sales-receipt" class="w-[307px] min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center pl-4 text-black text-[25px] font-normal">SALES RECEIPT</NuxtLink>
         <NuxtLink to="/purchase-receipt" class="w-[307px] min-h-[49px] bg-[#ffffff] rounded-[7px] flex items-center pl-4 text-black text-[25px] font-normal">PURCHASE RECEIPT</NuxtLink>
       <!-- <NuxtLink to="/sales" class="nav-link">SALES</NuxtLink>
       <NuxtLink to="/purchase" class="nav-link">PURCHASE</NuxtLink>
       <NuxtLink to="/scanpr" class="nav-link">SCAN</NuxtLink> -->
     </div>
   </aside>
 </template>
 
 <script setup>
 defineProps(["isSidebarOpen"]);
// Use $auth from useNuxtApp if needed

 </script>
