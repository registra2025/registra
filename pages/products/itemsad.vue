<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Header with Scan Button -->
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-2xl font-bold text-[#2966b1]">Product Details</h1>
                <NuxtLink to="/scanpr" class="px-4 py-2 bg-[#2966b1] text-white rounded-lg hover:bg-[#1e4c8a]">
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
                <NuxtLink to="/scanpr" class="mt-4 inline-block px-4 py-2 bg-[#2966b1] text-white rounded-lg hover:bg-[#1e4c8a]">
                    Try Another Scan
                </NuxtLink>
            </div>
            
            <!-- Product Details -->
            <div v-else-if="product" class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="flex">
                    <!-- Product Image Placeholder -->
                    <div class="w-1/2 p-8 flex items-center justify-center">
                        <div class="w-64 h-64  rounded-lg flex items-center justify-center">
                            <img v-if="product.imageUrl" :src="product.imageUrl" alt="Item Image" class="w-full h-full object-contain rounded mb-4 border border-gray-200 shadow" />
                            <div v-else class="w-40 h-40 flex items-center justify-center bg-gray-100 rounded text-gray-400 mb-4">No image</div>
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
                                <p class="text-lg font-semibold">BHD {{ product.itemPrice.toFixed(2) }}</p>
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
                <NuxtLink to="/scanpr" class="mt-4 inline-block px-4 py-2 bg-[#2966b1] text-white rounded-lg hover:bg-[#1e4c8a]">
                    Scan Product
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

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
</script>