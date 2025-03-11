<template>
    <header class="w-full h-[82px] bg-white border-b-2 border-[#2966b1] flex items-center px-8 fixed top-0 left-0 right-0 z-50">
      <button @click="emit('toggleSidebar')" class="text-[#2966b1] text-[32px] p-2">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <h1 class="text-[#2966b1] text-[32px] ml-4">REGISTRA</h1>
      <div class="ml-auto">
        <NuxtLink to="/login" class="text-black text-[32px] hover:text-[#2966b1]">
          LOGIN
        </NuxtLink>
      </div>
    </header>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['toggleSidebar']);
  </script>
  