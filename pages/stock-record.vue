<script setup>
definePageMeta({
  middleware: 'auth-global'
});
import { ref, onMounted } from "vue";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

// Use Firestore from Nuxt plugin
const { $firestore } = useNuxtApp();
const db = $firestore;

// Reactive inventory list
const inventory = ref([]);

// Fetch inventory data from Firestore
const fetchInventory = async () => {
  if (!process.client) return;
  try {
    const querySnapshot = await getDocs(collection(db, "inventory"));
    inventory.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error('Firebase error:', err);
  }
};

// Real-time listener for Firestore changes
onMounted(() => {
  const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
    inventory.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  });

  return () => unsubscribe();
});

</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Inventory</h2>
    
    <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2966b1] mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading product details...</p>
      </div>

    <table class="border-collapse w-full">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Image</th> 
          <th class="border p-2">Item ID</th>
          <th class="border p-2">Name</th>
          <th class="border p-2">Price</th>
          <th class="border p-2">Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in inventory" :key="item.id">
         <td class="border p-2">
        <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          alt="Item Image"
          class="w-16 h-16 object-cover rounded"
        />
        <span v-else class="text-gray-400">No image</span>
      </td>
          <td class="border p-2">{{ item.itemId }}</td>
          <td class="border p-2">{{ item.itemName }}</td>
          <td class="border p-2">${{ item.itemPrice }}</td>
          <td class="border p-2">{{ item.itemQty }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
