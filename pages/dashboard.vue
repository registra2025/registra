<script setup>
definePageMeta({ middleware: "auth" });
</script>

<template>
  <div>
      <!-- <h1>Home Page Content</h1> -->
 <div class="flex flex-row justify-between p-10">
    <div class="w-full max-w-[258px] h-[135px] bg-[#0f243d] rounded-[7px] flex items-center justify-center">
      <NuxtLink to="/sales" class="text-white text-[32px]">SALES</NuxtLink>
    </div>
    <div class="w-full max-w-[258px] h-[135px] bg-[#0f243d] rounded-[7px] flex items-center justify-center">
      <NuxtLink to="/purchase" class="text-white text-[32px]">PURCHASE</NuxtLink>
    </div>
    <div class="w-full max-w-[258px] h-[135px] bg-[#0f243d] rounded-[7px] flex items-center justify-center">
      <NuxtLink to="/scanpr" class="text-white text-[32px]">SCAN</NuxtLink>
    </div>
  </div>
    </div>
</template>
