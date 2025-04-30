<template>
    <div v-if="splashVisible" class="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <img src="/reg_logo_rm.png" alt="Registra Logo" class="h-16 lg:h-24 mb-4" />
        <svg class="animate-spin h-6 w-6 lg:h-8 lg:w-8 text-[#2170d4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    </div>
    <section v-else class="flex flex-wrap justify-center items-center gap-6 p-10 max-h-screen">
        <NuxtLink to="/purchase" class="w-full max-w-[258px] h-[135px] bg-[#63bff7] text-blue-950 text-xl sm:text-2xl md:text-3xl lg:text-4xl rounded-[7px] flex items-center justify-center transition hover:bg-blue-400 active:shadow-inner active:bg-blue-400">
            BUY
        </NuxtLink>
        
        <NuxtLink to="/scanpr" class="w-full max-w-[258px] h-[135px] bg-[#63bff7] text-blue-950 text-xl sm:text-2xl md:text-3xl lg:text-4xl rounded-[7px] flex items-center justify-center transition hover:bg-blue-400 active:shadow-inner active:bg-blue-400">
            SCAN
        </NuxtLink>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
definePageMeta({
    middleware: 'auth-global'
});
const splashVisible = ref(true);
onMounted(() => setTimeout(() => splashVisible.value = false, 500));
</script>
