<script setup>
definePageMeta({
  middleware: 'auth-global'
});
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs, addDoc, onSnapshot, query, where, getDoc, doc } from "firebase/firestore";
import { getApp } from "firebase/app";
import Scan from './scan.vue'; // Import the scan component

// Ensure Firebase app is initialized
let db;
if (process.client) {
  db = getFirestore(getApp());
}

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

// New product form data
const newProduct = ref({
  itemId: "",
  itemName: "",
  itemPrice: "",
  itemQty: "",
})

// Function to check if itemId already exists in the inventory
const checkItemIdExists = async (itemId) => {
  if (!process.client) return false;
  try {
    const q = query(collection(db, "inventory"), where("itemId", "==", itemId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // returns true if itemId is unique (doesn't exist)
  } catch (err) {
    console.error('Firebase error:', err);
    return false;
  }
};

// Function to add a new product to Firestore
const addNewItem = async () => {
  if (!newProduct.value.itemName || !newProduct.value.itemPrice || !newProduct.value.itemQty) {
    alert("Please fill in all fields!");
    return;
  }

  const itemId = Number(newProduct.value.itemId);
  
  // Check if itemId already exists
  const itemIdExists = await checkItemIdExists(itemId);
  if (!itemIdExists) {
    alert("Item ID already exists. Enter another Item");
    return;
  }

  // Proceed to add item if ID is unique
  if (!process.client) return;
  try {
    await addDoc(collection(db, "inventory"), {
      itemId: Number(newProduct.value.itemId),
      itemName: newProduct.value.itemName,
      itemPrice: Number(newProduct.value.itemPrice),
      itemQty: Number(newProduct.value.itemQty),
    });
    newProduct.value = { itemId: "", itemName: "", itemPrice: "", itemQty: "" };
  } catch (err) {
    console.error('Firebase error:', err);
  }
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

// Stop camera after scanning
const stopCamera = () => {
  isCameraActive.value = false;  // Close the camera after the barcode is scanned
};


</script>

<template>
  <div class="p-6 max0h-screen">
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
    <scan @scanBarcode="handleScannedBarcode" @stopCamera="stopCamera" v-if="isCameraActive" />
  </div>
</template>
