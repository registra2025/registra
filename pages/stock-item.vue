<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRoute, useRouter } from '#app';

const route = useRoute();
const router = useRouter();
const { $firestore } = useNuxtApp();
const db = $firestore;
const item = ref(null);
const loading = ref(true);
const error = ref(null);

// Fetch item details by itemId (from query param)
const fetchItem = async (itemId) => {
  if (!process.client) return;
  try {
    loading.value = true;
    error.value = null;
    const q = query(collection(db, 'inventory'), where('itemId', '==', Number(itemId)));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      error.value = 'Item not found';
      item.value = null;
    } else {
      item.value = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
    }
  } catch (err) {
    console.error('Firebase error:', err);
    error.value = 'Error fetching item details';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const itemId = route.query.itemId;
  if (itemId) {
    await fetchItem(itemId);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <button @click="router.back()" class="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-[#1c4375]">Back</button>
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2966b1]"></div>
        <p class="mt-4 text-gray-600 text-lg">Loading item details...</p>
      </div>
      <div v-else-if="error" class="text-center text-red-500 text-lg py-12">{{ error }}</div>
      <div v-else-if="item" class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <img v-if="item.imageUrl" :src="item.imageUrl" alt="Item Image" class="w-full h-full object-contain rounded mb-4 border border-gray-200 shadow" />
        <div v-else class="w-40 h-40 flex items-center justify-center bg-gray-100 rounded text-gray-400 mb-4">No image</div>
        <h2 class="text-2xl font-bold text-[#1c4375] mb-2">{{ item.itemName }}</h2>
        <div class="text-gray-700 mb-2">ID: <span class="font-mono">{{ item.itemId }}</span></div>
        <div class="text-green-700 font-bold text-lg mb-2">BHD {{ item.itemPrice }}</div>
        <div class="text-blue-700 font-bold text-lg mb-4">Quantity: {{ item.itemQty }}</div>
        <div class="text-gray-600 text-base mb-2" v-if="item.itemDesc">{{ item.itemDesc }}</div>
        <div class="text-gray-400 text-sm italic" v-else>No description available.</div>
      </div>
    </div>
  </div>
</template>
