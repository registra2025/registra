<script setup>
definePageMeta({
  middleware: 'auth-global'
});
</script>

<template>
  <section class="flex flex-wrap justify-center items-center gap-6 p-10 max-h-screen">
    <NuxtLink 
      to="/sales" 
      class="w-full max-w-[258px] h-[135px] bg-[#63bff7] text-blue-950 text-xl sm:text-2xl md:text-3xl lg:text-4xl rounded-[7px] flex items-center justify-center transition hover:bg-blue-400 active:shadow-inner active:bg-blue-400">
      SALES
    </NuxtLink>

    <!-- <NuxtLink 
      to="/purchase" 
      class="w-full max-w-[258px] h-[135px] bg-[#63bff7] text-blue-950 text-xl sm:text-2xl md:text-3xl lg:text-4xl rounded-[7px] flex items-center justify-center transition hover:bg-blue-400 active:shadow-inner active:bg-[#1a3352]">
      PURCHASE
    </NuxtLink> -->

    <NuxtLink 
      to="/scanpr" 
      class="w-full max-w-[258px] h-[135px] bg-[#63bff7] text-blue-950 text-xl sm:text-2xl md:text-3xl lg:text-4xl rounded-[7px] flex items-center justify-center transition hover:bg-blue-400 active:shadow-inner active:bg-[#1a3352]">
      SCAN
    </NuxtLink>
  </section>
</template>
