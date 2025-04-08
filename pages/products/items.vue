<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { useRoute, useRouter } from '#app';

const route = useRoute();
const router = useRouter();
const db = getFirestore(getApp());

const product = ref(null);
const loading = ref(true);
const error = ref(null);

// Function to fetch product details by barcode/itemId
const fetchProduct = async (barcode) => {
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
    console.error('Error fetching product:', err);
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

      <!-- Product Details -->
      <div v-else-if="product" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="flex">
          <!-- Product Image Placeholder -->
          <div class="w-1/2 p-8 flex items-center justify-center bg-gray-100">
            <div class="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Product Information -->
          <div class="w-1/2 p-8">
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Item ID</h3>
                <p class="text-lg font-semibold">{{ product.itemId }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Product Name</h3>
                <p class="text-lg font-semibold">{{ product.itemName }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Price</h3>
                <p class="text-lg font-semibold">${{ product.itemPrice.toFixed(2) }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Quantity in Stock</h3>
                <p class="text-lg font-semibold">{{ product.itemQty }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Product Selected State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 text-lg">No product selected. Please scan a product barcode.</p>
        <NuxtLink 
          to="/scanpr"
          class="mt-4 inline-block px-4 py-2 bg-[#2966b1] text-white rounded-lg hover:bg-[#1e4c8a]"
        >
          Scan Product
        </NuxtLink>
      </div>
    </div>
  </div>
</template>