<script setup>
definePageMeta({ middleware: "auth" });
</script>

<template>
  <div>
      <!-- <h1>Home Page Content</h1> -->
  <div class="grid grid-cols-3 content-center">
    <div class="w-full max-w-[258px] h-[135px] bg-[#0f243d] rounded-[7px] flex items-center justify-center">
      <a href="/purchase" class="text-white text-[32px]">PURCHASE</a>
    </div>
    <div class="w-full max-w-[258px] h-[135px] bg-[#0f243d] rounded-[7px] flex items-center justify-center">
      <a href="/sales" class="text-white text-[32px]">SALES</a>
    </div>
    <div class="w-full max-w-[258px] h-[135px] bg-[#0f243d] rounded-[7px] flex items-center justify-center">
      <a href="/scan" class="text-white text-[32px]">SCAN</a>
    </div>
  </div>
    </div>
</template>
