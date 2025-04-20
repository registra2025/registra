<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'

const receipts = ref([])
const loading = ref(true)

onMounted(async () => {
  const { $auth, $firestore } = useNuxtApp() 
  const currentUser = $auth.currentUser

  if (!currentUser) return

  const snapshot = await getDocs(
    collection($firestore, 'users', currentUser.uid, 'receipts')
  )
  receipts.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  loading.value = false
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">My Receipts</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="receipts.length === 0">No receipts found.</div>
    <ul v-else class="space-y-2">
      <li
        v-for="receipt in receipts"
        :key="receipt.id"
        class="border rounded-md p-4 shadow-sm"
      >
        <p><strong>Invoice #:</strong> {{ receipt.invoiceNumber }}</p>
        <p><strong>Date:</strong> {{ new Date(receipt.timestamp).toLocaleString() }}</p>
        <p><strong>Total:</strong> ₦{{ receipt.total }}</p>
        <p><strong>Items:</strong></p>
        <ul class="pl-4 list-disc">
          <li v-for="item in receipt.items" :key="item.itemId">
            {{ item.itemName }} (x{{ item.quantity }}) - ₦{{ item.price }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
