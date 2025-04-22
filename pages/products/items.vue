<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRoute } from '#app';

const route = useRoute();
const { $firestore } = useNuxtApp();
const db = $firestore;
const product = ref(null);
const loading = ref(true);
const error = ref(null);

// Function to fetch product details by barcode/itemId 
const fetchProduct = async (barcode) => {
  if (!process.client) return;
  try {
    loading.value = true;
    error.value = null;
    
    const q = query(collection(db, 'inventory'), where('itemId', '==', Number(barcode)));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      error.value = 'Product not found';
      product.value = null;
    } else {
      product.value = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
    }
  } catch (err) {
    console.error('Firebase error:', err);
    error.value = 'Error fetching product details';
  } finally {
    loading.value = false;
  }
};

// Watch for route changes to handle barcode parameter
onMounted(async () => {
  const barcode = route.query.barcode;
  if (barcode) {
    await fetchProduct(barcode);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header with Scan Button -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-[#2966b1]">Product Details</h1>
        <NuxtLink 
          to="/scanpr"
          class="px-4 py-2 bg-[#2966b1] text-white rounded-lg hover:bg-[#1e4c8a]"
        >
          Scan Product
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2966b1] mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading product details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <NuxtLink 
          to="/scanpr"
          class="mt-4 inline-block px-4 py-2 bg-[#2966b1] text-white rounded-lg hover:bg-[#1e4c8a]"
        >
          Try Another Scan
        </NuxtLink>
      </div>

    <!-- Product Display -->
    <div v-else-if="product" class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <!-- Image -->
  <div class="w-100 h-100 mb-4 border border-gray-200 shadow rounded flex items-center justify-center bg-white">
    <img
      v-if="product.imageUrl"
      :src="product.imageUrl"
      alt="Product Image"
      class="w-full h-full object-contain rounded"
    />
    <div v-else class="text-gray-400">No image</div>
  </div>
        <!-- Product Info -->
        <h2 class="text-2xl font-bold text-[#1c4375] mb-2">{{ product.itemName }}</h2>
        <div class="text-gray-700 mb-2">ID: <span class="font-mono">{{ product.itemId }}</span></div>
        <div class="text-green-700 font-bold text-lg mb-2">₦{{ product.itemPrice }}</div>
        <div class="text-blue-700 font-bold text-lg mb-4">Qty in Stock: {{ product.itemQty }}</div>
        
        <!-- Description -->
        <div class="text-gray-600 text-base mb-2" v-if="product.itemDesc">{{ product.itemDesc }}</div>
        <div class="text-gray-400 text-sm italic" v-else>No description available.</div>
      </div>

      <!-- No Product -->
      <div v-else class="text-center text-gray-600 py-12 text-lg">
        No product selected. Please scan a barcode.
      </div>
    </div>
  </div>
</template>