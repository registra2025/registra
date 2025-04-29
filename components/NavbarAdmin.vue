<template>
    <header class="w-[calc(100%-0.5rem)] h-[73px] bg-white border-2 border-[#2170d4] flex items-center px-4 fixed top-1 left-1 right-1 z-50 rounded-[15px] shadow-lg">
        <button
        @click="emit('toggleSidebar')"
        class="text-[#2170d4] text-[32px] w-13 h-13 p-0.5 border-1 border-[#2170d4] rounded-md transition transform active:scale-90 duration-100 ease-in-out"
        >
        <span class="material-symbols-outlined">menu</span>
    </button>
    <h1 class="text-[#2170d4] text-xl sm:text-2xl md:text-3xl ml-4">{{ title }}</h1>
    <div class="flex items-center ml-auto gap-3">
        <!-- Profile Dropdown -->
        <div class="relative" @click="showProfile = !showProfile">
          <button class="flex items-center gap-2 focus:outline-none">
            <span class="material-symbols-outlined text-3xl text-[#2170d4]">account_circle</span>
            <span>{{ userName }}</span>
          </button>
          <div v-if="showProfile" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 p-2">
            <div class="font-semibold">{{ userName }}</div>
            <div class="text-sm text-gray-600">{{ userEmail }}</div>
          </div>
        </div>
        <!-- Notification Dropdown -->
        <div class="relative" @click="showNotifications = !showNotifications">
          <button class="flex items-center gap-2 focus:outline-none">
            <span class="material-symbols-outlined text-3xl text-[#2170d4]">notifications</span>
            <span v-if="notifications.length" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">{{ notifications.length }}</span>
          </button>
          <div v-if="showNotifications" class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-50 p-2">
            <div v-if="!notifications.length" class="text-gray-500 text-sm">No notifications</div>
            <ul>
              <li v-for="(notif, i) in notifications" :key="i" :class="{ 'text-red-500': notif.severity==='critical', 'text-orange-500': notif.severity==='warning' }" class="text-sm p-1">{{ notif.message }}</li>
            </ul>
          </div>
        </div>
        <a @click="logout" class="text-blue-950 text-xl sm:text-2xl md:text-2xl hover:text-[#2170d4] cursor-pointer pl-3">LOGOUT</a>
    </div>
</header>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted, onUnmounted } from 'vue';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { navigateTo, useNuxtApp } from '#app';
import { onSnapshot, collection } from 'firebase/firestore';

const props = defineProps({ title: String });
const emit = defineEmits(['toggleSidebar']);

// Profile dropdown state
const showProfile = ref(false);
const user = ref(null);
const userName = computed(() => user.value?.email?.split('@')[0] || '');
const userEmail = computed(() => user.value?.email || '');

// Notification dropdown state
const showNotifications = ref(false);
const notifications = ref([]);

// Fetch auth user
onMounted(() => {
  const { $auth } = useNuxtApp();
  user.value = $auth.currentUser;
  onAuthStateChanged($auth, u => (user.value = u));
});

// Subscribe to inventory for low stock notifications
onMounted(() => {
  const { $firestore } = useNuxtApp();
  const unsubNotif = onSnapshot(collection($firestore, 'inventory'), snapshot => {
    notifications.value = snapshot.docs.map(doc => {
      const item = doc.data();
      if (item.itemQty < 20) return { message: `${item.itemName} is critically low (${item.itemQty})`, severity: 'critical' };
      if (item.itemQty < 50) return { message: `${item.itemName} is low (${item.itemQty})`, severity: 'warning' };
      return null;
    }).filter(n => n);
  });
  onUnmounted(() => unsubNotif());
});

const logout = async () => {
    try {
        const { $auth } = useNuxtApp();
        await signOut($auth);
        navigateTo('/login');
    } catch (err) {
        console.error('Logout error:', err);
    }
};
</script>
