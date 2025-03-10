// src/composables/useInventory.js
import { ref } from 'vue';
import { db } from '@/firebase';  // Import your Firestore db
import { collection, getDocs, addDoc } from 'firebase/firestore';

export function useInventory() {
  // Reactive variables
  const inventory = ref([]);
  const loading = ref(true);
  
  // Fetch inventory from Firestore
  const fetchInventory = async () => {
    const querySnapshot = await getDocs(collection(db, "inventory"));
    inventory.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    loading.value = false;
  };
  
  // Add new product to Firestore
  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, "inventory"), {
        itemId: product.itemId,
        itemName: product.itemName,
        itemPrice: product.itemPrice,
        itemQty: product.itemQty,
      });
      fetchInventory();  // Refresh the inventory after adding
    } catch (error) {
      console.error("Error adding product: ", error);
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
