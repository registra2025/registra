<script setup>
import { useHead } from 'nuxt/app';
import { provide } from 'vue';
import { userStore } from '@/stores/userStore';
import { Analytics } from '@vercel/analytics/nuxt'

userStore.initialize();
provide('userStore', userStore);

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { 
      rel: 'stylesheet', 
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap' 
    },
    { 
      rel: 'stylesheet', 
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap' 
    }
  ]
});
</script>

<template>
    <NuxtLayout>
        <NuxtPage :key="$route.fullPath" />
        <!-- <Analytics /> -->
    </NuxtLayout>
  </template>
  