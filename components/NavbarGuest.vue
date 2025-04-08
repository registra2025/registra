<template>
    <header class="w-full h-[82px] bg-white border-b-2 border-[#2966b1] flex items-center px-8 fixed top-0 left-0 right-0 z-50">
      <button @click="emit('toggleSidebar')" class="text-[#2966b1] text-[32px] p-2">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <h1 class="text-[#2966b1] text-[32px] ml-4">REGISTRA</h1>
          <!-- Dark Mode Toggle -->
    <div class="flex items-center ml-4">
      <input
        type="checkbox"
        id="dark-toggle"
        class="sr-only"
        v-model="isDark"
        @change="applyDarkReader"
      />
      <label for="dark-toggle" class="relative cursor-pointer p-4 block">
        <!-- Sun Icon -->
        <svg v-if="!isDark" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <path class="fill-slate-400" d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z" />
          <path class="fill-slate-500" d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z" />
        </svg>
        <!-- Moon Icon -->
        <svg v-else class="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <path class="fill-slate-500" d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z" />
        </svg>
        <span class="sr-only">Toggle Dark Mode</span>
      </label>
    </div>
      <div class="ml-auto">
        <NuxtLink to="/login" class="text-black text-[32px] hover:text-[#2966b1]">
          LOGIN
        </NuxtLink>
      </div>
    </header>
  </template>
  
  <script setup>
  import { defineEmits, ref, onMounted } from 'vue';
  const emit = defineEmits(['toggleSidebar']);

const isDark = ref(false);

const applyDarkReader = () => {
  const html = document.documentElement;

  if (isDark.value) {
    html.style.filter = 'invert(1) hue-rotate(180deg)';
    html.style.backgroundColor = '#111';
    document.querySelectorAll('img, video, iframe').forEach(el => {
      el.style.filter = 'invert(1) hue-rotate(180deg)';
    });
  } else {
    html.style.filter = '';
    html.style.backgroundColor = '';
    document.querySelectorAll('img, video, iframe').forEach(el => {
      el.style.filter = '';
    });
  }
};

// Apply on mount if already toggled
onMounted(() => {
  if (isDark.value) applyDarkReader();
});
  </script>
