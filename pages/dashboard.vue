<script setup>
definePageMeta({
  middleware: 'auth-global'
});
</script>

<template>
    <!-- <div class="flex flex-row justify-between p-10 gap-4">
      <NuxtLink to="/sales" class="w-full max-w-[258px] h-[135px] bg-[#1c4375] text-white text-[32px] rounded-[7px] flex items-center justify-center transition hover:bg-[#1a3352] active:shadow-inner active:bg-[#1a3352]">
        SALES
      </NuxtLink>

      <NuxtLink to="/purchase" class="w-full max-w-[258px] h-[135px] bg-[#1c4375] text-white text-[32px] rounded-[7px] flex items-center justify-center transition hover:bg-[#1a3352] active:shadow-inner active:bg-[#1a3352]">
        PURCHASE
      </NuxtLink>

      <NuxtLink to="/scanpr" class="w-full max-w-[258px] h-[135px] bg-[#1c4375] text-white text-[32px] rounded-[7px] flex items-center justify-center transition hover:bg-[#1a3352] active:shadow-inner active:bg-[#1a3352]">
        SCAN
      </NuxtLink>
    </div> -->
    <section class="grid gap-4 p-10" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
      <NuxtLink to="/purchase" class="w-full max-w-[258px] h-[135px] bg-[#1c4375] text-white text-[32px] rounded-[7px] flex items-center justify-center transition hover:bg-[#1a3352] active:shadow-inner active:bg-[#1a3352]">
        PURCHASE
      </NuxtLink>

      <NuxtLink to="/scanpr" class="w-full max-w-[258px] h-[135px] bg-[#1c4375] text-white text-[32px] rounded-[7px] flex items-center justify-center transition hover:bg-[#1a3352] active:shadow-inner active:bg-[#1a3352]">
        SCAN
      </NuxtLink>
   </section>
</template>
