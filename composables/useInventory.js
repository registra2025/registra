// src/composables/useInventory.js
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export function useInventory() {
    // Reactive variables
    const inventory = ref([]);
    const loading = ref(true);
    
    const { $firestore } = useNuxtApp();
    const db = $firestore;
    
    // Fetch inventory from Firestore
    const fetchInventory = async () => {
        if (!process.client) return;
        try {
            const querySnapshot = await getDocs(collection(db, "inventory"));
            inventory.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (err) {
            console.error('Firebase error:', err);
        } finally {
            loading.value = false;
        }
    };
    
    // Add new product to Firestore
    const addProduct = async (product) => {
        if (!process.client) return;
        try {
            await addDoc(collection(db, "inventory"), {
                itemId: product.itemId,
                itemName: product.itemName,
                itemPrice: product.itemPrice,
                itemQty: product.itemQty,
            });
            fetchInventory();  // Refresh the inventory after adding
        } catch (error) {
            console.error("Firebase error:", error);
        }
    };
    
    // Fetch inventory on composable setup
    fetchInventory();
    
    return {
        inventory,
        loading,
        addProduct
    };
}
