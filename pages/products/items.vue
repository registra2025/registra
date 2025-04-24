<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { useRoute } from '#app';
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const { $firestore } = useNuxtApp();
const db = $firestore;
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const cartStore = useCartStore();
const addSuccess = ref(false);

// Function to fetch product details by numeric itemId or Firestore doc ID
const fetchProduct = async (barcode) => {
  if (!process.client) return;
  loading.value = true;
  error.value = null;
  try {
    let snapshot, data;
    if (/^\d+$/.test(barcode)) {
      // Numeric itemId lookup
      const q = query(collection(db, 'inventory'), where('itemId', '==', Number(barcode)));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) throw new Error('Product not found');
      snapshot = querySnapshot.docs[0];
      data = snapshot.data();
    } else {
      // Firestore doc ID lookup
      const docRef = doc(db, 'inventory', barcode);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Product not found');
      snapshot = docSnap;
      data = snapshot.data();
    }
    product.value = { id: snapshot.id, ...data };
  } catch (err) {
    console.error('Firebase error:', err);
    error.value = err.message || 'Error fetching product details';
    product.value = null;
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

function addToCart() {
  if (!product.value) return;
  cartStore.addItem({
    id: product.value.itemId, // Use itemId (numeric, from inventory) as the cart id
    itemId: product.value.itemId, // Store itemId explicitly for clarity
    name: product.value.itemName,
    price: product.value.itemPrice,
    qty: 1
  });
  addSuccess.value = true;
  setTimeout(() => { addSuccess.value = false; }, 1200);
}
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
      <img v-if="product.imageUrl" :src="product.imageUrl" alt="Item Image" class="w-full h-full object-contain rounded mb-4 border border-gray-200 shadow" />
      <div v-else class="w-40 h-40 flex items-center justify-center bg-gray-100 rounded text-gray-400 mb-4">No image</div>
      <h2 class="text-2xl font-bold text-[#1c4375] mb-2">{{ product.itemName }}</h2>
      <div class="text-gray-700 mb-2">ID: <span class="font-mono">{{ product.itemId }}</span></div>
      <div class="text-green-700 font-bold text-lg mb-2">BHD {{ product.itemPrice }}</div>
      <div class="text-gray-600 text-base mb-2" v-if="product.itemDesc">{{ product.itemDesc }}</div>
      <div class="text-gray-400 text-sm italic" v-else>No description available.</div>
      <button @click="addToCart" class="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">Add to Cart</button>
      <div v-if="addSuccess" class="mt-2 text-green-600 font-semibold">Added to cart!</div>
    </div>

      <!-- No Product -->
      <div v-else class="text-center text-gray-600 py-12 text-lg">
        No product selected. Please scan a barcode.
      </div>
    </div>
  </div>
</template>