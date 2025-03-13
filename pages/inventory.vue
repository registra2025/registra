<script setup>
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { getApp } from "firebase/app";
import Scan from './scan.vue'; // Import the scan component

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

// New product form data
const newProduct = ref({
  itemId: "",
  itemName: "",
  itemPrice: "",
  itemQty: "",
});

// Function to add a new product to Firestore
const addNewItem = async () => {
  if (!newProduct.value.itemName || !newProduct.value.itemPrice || !newProduct.value.itemQty) {
    alert("Please fill in all fields!");
    return;
  }

  await addDoc(collection(db, "inventory"), {
    itemId: Number(newProduct.value.itemId),
    itemName: newProduct.value.itemName,
    itemPrice: Number(newProduct.value.itemPrice),
    itemQty: Number(newProduct.value.itemQty),
  });

  newProduct.value = { itemId: "", itemName: "", itemPrice: "", itemQty: "" };
};

// Function to handle scanned barcode input
const handleScannedBarcode = (scannedBarcode) => {
  newProduct.value.itemId = scannedBarcode; // Set scanned barcode to itemId field
};

// Camera active state for barcode scanning
const isCameraActive = ref(false);

// Toggle Camera On/Off for Barcode Scanning
const toggleCamera = () => {
  isCameraActive.value = !isCameraActive.value;
};
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Inventory</h2>

    <div class="mt-4">
      <h3 class="text-lg font-bold">Add Product</h3>
      <input v-model="newProduct.itemId" placeholder="Item ID" class="border p-2 m-1" />
      <input v-model="newProduct.itemName" placeholder="Name" class="border p-2 m-1" />
      <input v-model="newProduct.itemPrice" placeholder="Price" class="border p-2 m-1" />
      <input v-model="newProduct.itemQty" placeholder="Quantity" class="border p-2 m-1" />
      
      <button @click="addNewItem" class="bg-green-500 text-white p-2">Add</button>
      <!-- Scan Button -->
      <button @click="toggleCamera" class="bg-blue-500 text-white p-2 ml-2">Scan</button>
    </div>
    
    <!-- Scan Barcode Modal (Only Show When Scan is Active) -->
    <scan @scanBarcode="handleScannedBarcode" v-if="isCameraActive" />
    
    <!-- Barcode Text Display Below Camera (This will auto-populate the Item ID field) -->
    <div v-if="isCameraActive" class="mt-4">
      <p class="text-lg font-semibold">Scanned Barcode: {{ newProduct.itemId }}</p>
    </div>
  </div>
</template>
