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
  <div class="p-2 sm:p-6 w-full max-w-8xl min-w-4xl mx-auto">
  <h2 class="text-2xl sm:text-3xl font-extrabold mb-6 text-[#1c4375] tracking-tight text-center">Inventory</h2>

  <div v-if="loading" class="flex flex-col items-center justify-center py-16">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2966b1]"></div>
    <p class="mt-4 text-gray-600 text-lg">Loading product details...</p>
  </div>

  <!-- Responsive Table -->
  <div class="overflow-x-auto rounded-xl shadow-lg bg-white">
    <table class="w-full text-sm sm:text-base">
      <thead>
        <tr class="bg-[#c0e6fd] text-[#1c4375]">
          <th class="p-3 font-semibold text-left">Image</th>
          <th class="p-3 font-semibold text-left">Item ID</th>
          <th class="p-3 font-semibold text-left">Name</th>
          <th class="p-3 font-semibold text-left">Price</th>
          <th class="p-3 font-semibold text-left">Quantity</th>
          <th class="p-3 font-semibold text-left">Description</th>
        </tr>

      </thead>
      <tbody>
        <tr
          v-for="item in inventory"
          :key="item.id"
          class="even:bg-[#dcf0fd] hover:bg-[#95d7fb] transition cursor-pointer"
          @click="$router.push({ path: '/stock-item', query: { itemId: item.itemId } })"
        >

          <td class="p-2">
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              alt="Item Image"
              class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded shadow border border-gray-200"
            />
            <span v-else class="text-gray-400 italic">No image</span>
          </td>
          <td class="p-2 font-mono font-medium">{{ item.itemId }}</td>
          <td class="p-2 font-semibold">{{ item.itemName }}</td>
          <td class="p-2 text-green-700 font-bold">BHD {{ item.itemPrice }} </td>
          <td class="p-2 text-blue-900 font-bold">{{ item.itemQty }}</td>
          <td class="p-2 font-semibold">{{ item.itemDesc }}</td>
        </tr>

      </tbody>
    </table>
  </div>

  <!-- Mobile Card Layout -->
  <div class="sm:hidden mt-6 flex flex-col gap-4">
    <NuxtLink
      v-for="item in inventory"
      :key="item.id"
      :to="`/stock-item?itemId=${item.itemId}`"
      class="rounded-xl shadow bg-white p-4 flex gap-4 items-center hover:bg-[#eaf1fb] transition cursor-pointer"
    >
      <img
        v-if="item.imageUrl"
        :src="item.imageUrl"
        alt="Item Image"
        class="w-16 h-16 object-cover rounded border border-gray-200"
      />
      <div v-else class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-gray-400">No image</div>
      <div class="flex-1">
        <div class="font-mono font-medium text-xs text-gray-500">ID: {{ item.itemId }}</div>
        <div class="font-bold text-base text-[#1c4375]">{{ item.itemName }}</div>
        <div class="text-green-700 font-bold text-sm">BHD {{ item.itemPrice }}</div>
        <div class="text-blue-700 font-bold text-sm">Qty: {{ item.itemQty }}</div>
        <div class="text-blue-700 font-bold text-sm">Qty: {{ item.itemDesc }}</div>
      </div>
    </NuxtLink>
  </div>
</div>
</template>
