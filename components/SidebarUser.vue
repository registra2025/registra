<template>
    <aside v-show="isSidebarOpen" class="w-full h-full">
        <!-- Sidebar Content Wrapper (scrollable) -->
        <div class="flex flex-col items-center px-6 py-4 h-fit">
            <!-- Logo -->
            <NuxtLink :to="user ? '/dashboard' : '/'">
                <img
                src="/reg_logo_rm.png"
                alt="Logo"
                class="w-[200px] h-[200px] object-contain max-w-full max-h-full md:w-[260px] md:h-[200px] sm:w-[120px] sm:h-[120px]"
                />
            </NuxtLink>
            
            <!-- User Links -->
            <div class="flex flex-col gap-2 w-full overflow-y-auto">
                <NuxtLink to="/dashboard" class="min-h-[49px] bg-[#c0e6fd] rounded-[7px] flex items-center text-blue-950 pl-4 text-xl sm:text-xl md:text-xl font-normal hover:bg-[#95d7fb] active:bg-[#95d7fb]">DASHBOARD</NuxtLink>
                <NuxtLink to="/my-receipts" class="min-h-[49px] bg-[#c0e6fd] rounded-[7px] flex items-center text-blue-950 pl-4 text-xl sm:text-xl md:text-xl font-normal hover:bg-[#95d7fb] active:bg-[#95d7fb]">MY RECEIPTS</NuxtLink>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onAuthStateChanged } from "firebase/auth";

defineProps(["isSidebarOpen"]);

const user = ref(null);

onMounted(() => {
    if (process.client) {
        const { $auth } = useNuxtApp();
        onAuthStateChanged($auth, (firebaseUser) => {
            user.value = firebaseUser;
        });
    }
});
</script>
