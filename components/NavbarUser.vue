<template>
   <header  class="w-[calc(100%-0.5rem)] h-[73px] bg-white border-2 border-primary flex items-center px-4 fixed top-1 left-1 right-1 z-50 rounded-[15px] shadow-lg">
     <button
     @click="emit('toggleSidebar')"
     class="text-text text-[32px] w-13 h-13 p-0.5 border-1 border-primary rounded-md transition transform active:scale-90 duration-100 ease-in-out"
     >
     <span class="material-symbols-outlined">menu</span>
     </button>
     <h1 class="text-text text-xl sm:text-2xl md:text-3xl ml-4">{{ title }}</h1>
     <!-- Dark Mode Toggle -->
     <!-- <div class="flex items-center ml-4"> 
       <input
         type="checkbox"
         id="dark-toggle"
         class="sr-only"
         v-model="isDark"
         @change="applyDarkReader"
       />
       <label for="dark-toggle" class="relative cursor-pointer p-4 block">
         
         <svg v-if="!isDark" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
           <path class="fill-slate-400" d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z" />
           <path class="fill-slate-500" d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z" />
         </svg>
         
         <svg v-else class="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
           <path class="fill-slate-500" d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z" />
         </svg>
         <span class="sr-only">Toggle Dark Mode</span>
       </label>
     </div> -->
     <div class="flex items-center ml-auto gap-3">
       <!-- Cart Icon with Badge -->
       <div class="relative" @click="showCart = !showCart">
         <button class="flex items-center gap-2 focus:outline-none">
           <span class="material-symbols-outlined text-3xl text-[#2170d4]">shopping_cart</span>
           <span v-if="cartItems.length" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">{{ cartItems.length }}</span>
         </button>
         <!-- Cart Dropdown -->
         <div v-if="showCart && cartItems.length" class="absolute right-0 mt-2 w-90 bg-white border border-gray-200 rounded shadow-lg z-50">
           <div class="p-2 font-bold border-b border-gray-100">Cart</div>
           <ul>
             <li v-for="item in cartItems" :key="item.id" class="flex justify-between items-center p-2 border-b last:border-b-0">
               <div>
                 <span class="font-semibold">{{ item.name || item.itemName }}</span>
                 <span class="text-xs text-gray-500 ml-1">x{{ item.qty }}</span>
               </div>
               <div class="flex items-center space-x-2">
                 <span class="text-green-700 font-bold">BHD {{ item.price }}</span>
                 <button @click="removeItem(item.id)" class="text-red-600 text-sm hover:underline">Remove</button>
               </div>
             </li>
           </ul>
           <div class="flex flex-1 justify-between p-2 text-right border-t border-gray-100">
            <button @click="clearCart" class="text-red-600 font-semibold hover:underline">Clear Cart</button>
             <button @click="syncCartAndGoToPurchase" class="text-[#2170d4] font-semibold hover:underline">Go to Purchase</button>
           </div>
         </div>
       </div>
       <!-- Profile Dropdown -->
       <div class="relative" @click="showProfile = !showProfile">
         <button class="flex items-center focus:outline-none">
           <span class="material-symbols-outlined text-3xl text-[#2170d4]">account_circle</span>
           <span>{{ userName }}</span>
         </button>
         <div v-if="showProfile" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 p-2">
           <div class="font-semibold">{{ userName }}</div>
           <div class="text-sm text-gray-600">{{ userEmail }}</div>
         </div>
       </div>
       <a @click="logout" class="text-blue-950 text-xl sm:text-xl md:text-2xl pl-2 hover:text-[#2170d4] cursor-pointer">
         LOGOUT
       </a>
     </div>
   </header>
 </template>
 
<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { navigateTo, useNuxtApp } from '#app';
import { useCartStore } from '~/stores/cart';

const emit = defineEmits(['toggleSidebar']);
const props = defineProps({
 title: String, // Accept title as a prop
});

const showCart = ref(false);
const cartStore = useCartStore();
const cartItems = computed(() => cartStore.items);

// Profile dropdown state
const showProfile = ref(false);
const user = ref(null);
const userName = computed(() => user.value?.email?.split('@')[0] || '');
const userEmail = computed(() => user.value?.email || '');

// Fetch auth user
onMounted(() => {
  const { $auth } = useNuxtApp();
  user.value = $auth.currentUser;
  onAuthStateChanged($auth, u => { user.value = u; });
});

function syncCartAndGoToPurchase() {
  // Store cart to session and clear immediately
  sessionStorage.setItem('cartSync', JSON.stringify(cartStore.items.map(item => ({ itemId: item.itemId || item.id, qty: item.qty }))));
  clearCart();
  navigateTo('/purchase');
}

function removeItem(id) {
  cartStore.removeItem(id);
}

function clearCart() {
  cartStore.clearCart();
}

const logout = async () => {
 try {
   const { $auth } = useNuxtApp();
   await signOut($auth);
   navigateTo("/login");
 } catch (error) {
   console.error("Firebase error:", error);
 }
};

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
