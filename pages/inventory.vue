<template>
    <div class="min-h-[80vh] flex items-center justify-center">
        <div class="w-full max-w-md bg-primary rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <h3 class="text-2xl font-extrabold text-[#1c4375] mb-6">Add Item</h3>
            <div class="w-full flex flex-col gap-4">
                <input v-model="newItem.itemId" placeholder="Item ID" class="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1c4375] focus:ring-[#1c4375] text-black bg-[#dcf0fd] focus:outline-none transition" />
                <input v-model="newItem.itemName" placeholder="Name" class="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1c4375] focus:ring-[#1c4375] text-black bg-[#dcf0fd] focus:outline-none transition" />
                <input
                v-model="newItem.itemPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                @keypress="validateNumberInput"
                class="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1c4375] focus:ring-[#1c4375] text-black bg-[#dcf0fd] focus:outline-none transition"
                />
                <input
                v-model="newItem.itemQty"
                type="number"
                min="0"
                step="1"
                placeholder="Quantity"
                @keypress="validateNumberInput"
                class="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1c4375] focus:ring-[#1c4375] text-black bg-[#dcf0fd] focus:outline-none transition"
                />
                
                <input v-model="newItem.itemDesc" placeholder="Description" class="w-full p-3 rounded-lg border border-gray-300 focus:border-[#1c4375] focus:ring-[#1c4375] text-black bg-[#dcf0fd] focus:outline-none transition" />
                <!-- Image Upload Input -->
                <label class="block w-full">
                    <span class="text-gray-600 text-sm font-semibold mb-1">Upload Image</span>
                    <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    @change="handleImageChange"
                    class="w-full p-2 rounded-lg border border-gray-300 bg-[#dcf0fd] hover:bg-[#c0e6fd] active-bg-[#c0e6fd] text-black focus:outline-none mt-1"
                    />
                </label>
                <!-- Preview the selected image -->
                <div v-if="previewUrl" class="flex flex-col items-center mt-2">
                    <p class="text-xs text-gray-600 mb-1">Preview:</p>
                    <img :src="previewUrl" alt="Image Preview" class="w-32 h-32 object-cover border rounded-lg shadow" />
                </div>
                <div v-if="selectedImage" class="mt-2 text-center">
                    <p class="text-xs text-gray-600">Selected image: {{ selectedImage.name }}</p>
                </div>
            </div>
            <!-- Buttons -->
            <div class="flex gap-4 mt-6 w-full">
                <button @click="addNewItem" class="flex-1 bg-[#1c4375] hover:bg-[#2966b1] text-white font-semibold p-3 rounded-lg shadow transition">Add Item</button>
                <button @click="toggleCamera" class="flex-1 bg-primary hover:bg-primary-hover text-black font-semibold p-3 rounded-lg shadow transition hover:bg-blue-300 active:shadow-inner active:bg-blue-300">
                    {{ isCameraActive ? 'Stop' : 'Scan' }}
                </button>
            </div>
            <!-- Barcode Scanner -->
            <scan @scanBarcode="handleScannedBarcode" @stopCamera="stopCamera" v-if="isCameraActive" />
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth-global'
});
import { ref, onMounted } from "vue";
import { collection, getDocs, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Scan from './scan.vue';
import { v4 as uuidv4 } from 'uuid';

const { $firestore, $firebaseApp } = useNuxtApp();
const db = $firestore;
const storage = getStorage($firebaseApp);

// Inventory list
const inventory = ref([]);

onMounted(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
        inventory.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    });
    
    return () => unsubscribe();
});

// New item form
const newItem = ref({
    itemId: "",
    itemName: "",
    itemPrice: "",
    itemQty: "",
    itemDesc: "",
    imageUrl: "", // Image URL field
});

const blockNonInteger = (e) => {
    const key = e.key;
    // Block non-numeric and decimal point input
    if (!/^\d$/.test(key)) {
        e.preventDefault();
    }
};

const validateNumberInput = (e) => {
    const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.'];
    if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
};

// Selected image file
const selectedImage = ref(null);
const previewUrl = ref(null);

// Image input change handler
const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedImage.value = file;
        previewUrl.value = URL.createObjectURL(file);
    }
};

// Upload image to Firebase Storage and return its URL
const uploadImage = async (file, itemId) => {
    const imgRef = storageRef(storage, `item-images/${itemId}-${Date.now()}`);
    await uploadBytes(imgRef, file);
    return await getDownloadURL(imgRef);
};

const checkItemIdExists = async (itemId) => {
    const q = query(collection(db, "inventory"), where("itemId", "==", itemId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
};

// Add new item to Firestore with image URL
const addNewItem = async () => {
    if (!newItem.value.itemName || !newItem.value.itemPrice || !newItem.value.itemQty || !newItem.value.itemDesc) {
        alert("Please fill in all fields!");
        return;
    }
    
    
    const itemId = Number(newItem.value.itemId);
    const itemIdExists = await checkItemIdExists(itemId);
    if (!itemIdExists) {
        alert("Item ID already exists. Enter another Item");
        return;
    }
    
    let imageUrl = "";
    if (selectedImage.value) {
        const imagePath = `inventory/${uuidv4()}-${selectedImage.value.name}`;
        const imgRef = storageRef(storage, imagePath);
        console.log("Uploading to path:", imagePath);
        
        try {
            const snapshot = await uploadBytes(imgRef, selectedImage.value);
            imageUrl = await getDownloadURL(snapshot.ref);
        } catch (err) {
            console.error("Image upload error:", err);
            alert("Failed to upload image.");
            return;
        }
    }
    
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            selectedImage.value = file;
            previewUrl.value = URL.createObjectURL(file); // Create a local preview
        }
    };
    
    try {
        await addDoc(collection(db, "inventory"), {
            itemId,
            itemName: newItem.value.itemName,
            itemPrice: Number(newItem.value.itemPrice),
            itemQty: Number(newItem.value.itemQty),
            itemDesc: newItem.value.itemDesc,
            imageUrl: imageUrl || ""
        });
        newItem.value = { itemId: "", itemName: "", itemPrice: "", itemQty: "", itemDesc:"", imageUrl: "" };
        selectedImage.value = null;
        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value);
            previewUrl.value = null;
        }
        alert("Item added successfully!");
    } catch (err) {
        console.error("Firebase error:", err);
        alert("Failed to add item.");
    }
};

// Barcode + camera logic...
const handleScannedBarcode = (barcode) => { newItem.value.itemId = barcode; };
const isCameraActive = ref(false);
const toggleCamera = () => { isCameraActive.value = !isCameraActive.value; };
const stopCamera = () => { isCameraActive.value = false; };
</script>
