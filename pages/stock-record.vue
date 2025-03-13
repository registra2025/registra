<script setup>
definePageMeta({ middleware: "auth" });
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { getApp } from "firebase/app";

// Ensure Firebase app is initialized
const db = getFirestore(getApp());

// Reactive inventory list
const inventory = ref([]);

// Fetch inventory data from Firestore
const fetchInventory = async () => {
  const querySnapshot = await getDocs(collection(db, "inventory"));
  inventory.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
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
    
    <table class="border-collapse w-full">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Item ID</th>
          <th class="border p-2">Name</th>
          <th class="border p-2">Price</th>
          <th class="border p-2">Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in inventory" :key="item.id">
          <td class="border p-2">{{ item.itemId }}</td>
          <td class="border p-2">{{ item.itemName }}</td>
          <td class="border p-2">${{ item.itemPrice }}</td>
          <td class="border p-2">{{ item.itemQty }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
