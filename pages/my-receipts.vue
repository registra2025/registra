<template>
    <div class="">
        <!-- <h2 class="text-xl font-semibold mb-4">My Receipts</h2> -->
        <div v-if="loading">Loading...</div>
        <div v-else-if="receipts.length === 0">No receipts found.</div>
        <ul v-else class="space-y-4">
            <li v-for="receipt in receipts" :key="receipt.id" class="border rounded-md p-4 shadow-sm w-full max-w-full overflow-auto">
                <p><strong>Invoice #:</strong> {{ receipt.invoiceNumber }}</p>
                <p><strong>Date:</strong> {{ new Date(receipt.timestamp).toLocaleString() }}</p>
                <p><strong>Total:</strong> BHD {{ receipt.total }}</p>
                
                <button class="mt-2 text-[#2170d4] hover:underline" @click="toggleDetails(receipt.id)">
                    {{ receipt.showDetails ? 'Hide Details' : 'View Details' }}
                </button>
                
                <!-- 👇 Show full receipt layout if toggled -->
                <ReceiptDetails
                v-if="receipt.showDetails"
                :invoiceNumber="receipt.invoiceNumber"
                :customer="receipt.customer || 'N/A'"
                :formattedDate="new Date(receipt.timestamp).toLocaleString()"
                :paymentMethod="receipt.payment || 'Cash'"
                :products="receipt.items"
                :total="receipt.total"
                />
            </li>
        </ul>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth-global'
});
import { ref, onMounted } from 'vue'
import { query, orderBy, collection, getDocs } from 'firebase/firestore'
import ReceiptDetails from '~/components/receipt-details.vue'

const receipts = ref([])
const loading = ref(true)

onMounted(async () => {
    const { $auth, $firestore } = useNuxtApp() 
    const currentUser = $auth.currentUser
    
    if (!currentUser) return
    
    const snapshot = await getDocs(
    query(
    collection($firestore, 'users', currentUser.uid, 'receipts'),
    orderBy('timestamp', 'desc')
    )
    
    ) 
    receipts.value = snapshot.docs.map(doc => ({
        id: doc.id,
        showDetails:false,
        ...doc.data()
    }))
    loading.value = false
})

const toggleDetails = (id) => {
    const receipt = receipts.value.find(r => r.id === id)
    if (receipt) receipt.showDetails = !receipt.showDetails
}

</script>
