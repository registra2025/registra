<template>
   <div class="p-4 bg-[#1c4375] min-h-full text-gray-800 dark:text-white rounded-[17px] -m-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
         <h1 class="text-2xl font-bold">New Purchase</h1>
         <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Go Back</button>
      </div>
      
      <!-- Customer & Invoice Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"> 
         <div>
            <label class="block mb-1">Customer</label>
            <select v-model="customer" class="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800">
               <option>Select Customer</option>
               <option>Walk-in</option>
               <option>John Doe</option>
            </select>
         </div>
         <div>
            <label class="block mb-1">Date & Time</label>
            <div class="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800">
               {{ formattedDateTime }}
            </div>
         </div>
         <div>
            <label class="block mb-1">Invoice #</label>
            <!-- Invoice -->
            <input v-model="invoice" type="text" class="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800" :placeholder="invoice" />
         </div>
      </div>
      
      <!-- Barcode / Product Input -->
      <div class="flex items-center gap-4 mb-6">
         <input 
         type="text" 
         class="flex-1 border px-4 py-2 rounded bg-white dark:bg-gray-800" 
         placeholder="Scan barcode or enter product"
         v-model="scannedCode"
         />
         <button @click="toggleCamera" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {{ isCameraActive ? 'Stop' : 'Scan' }}
         </button>
      </div>
      
      <!-- Product List Table -->
      <div class="overflow-x-auto mb-6">
         <table class="min-w-full text-left border">
            <thead class="bg-gray-200 dark:bg-gray-700">
               <tr>
                  <th class="px-4 py-2">Product</th>
                  <th class="px-4 py-2">Qty</th>
                  <th class="px-4 py-2">Price</th>
                  <th class="px-4 py-2">Total</th>
                  <th class="px-4 py-2">Actions</th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="(item, index) in products" :key="index" class="border-t">
                  <td class="px-4 py-2">{{ item.name }}</td>
                  <td class="px-4 py-2">{{ item.qty }}</td>
                  <td class="px-4 py-2">${{ item.price }}</td>
                  <td class="px-4 py-2">${{ item.qty * item.price }}</td>
                  <td class="px-4 py-2">
                     <button class="text-red-600 hover:underline" @click="removeItem(index)">Remove</button>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
      
      <!-- Summary Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div class="space-y-4">
            <div>
               <label class="block mb-1">Payment Method</label>
               <!-- Payment -->
               <select v-model="payment" class="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800">
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
               </select>
            </div>
         </div>
         
         <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded space-y-2">
            <div class="flex justify-between">
               <span>Subtotal:</span>
               <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
               <span>Tax (10%):</span>
               <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
               <span>Discount:</span>
               <span>$0.00</span>
            </div>
            <div class="flex justify-between font-bold text-lg border-t pt-2">
               <span>Total:</span>
               <span>${{ total.toFixed(2) }}</span>
            </div>
         </div>
      </div>
      
      <!-- Submit Button -->
      <div class="mt-6 flex justify-end">
        <!-- <button @click="completePurchase" class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
         Complete Purchase
        </button> -->
        <NuxtLink
         to="/purchase-receipt"
         @click="completePurchase"
         class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
         >
         Complete Purchase
      </NuxtLink>
      </div>
   
   <!-- Scan Component -->
   <scan v-if="isCameraActive" @scanBarcode="handleScannedBarcode" />
</div>
</template>

<script setup>

import { ref, computed, onUnmounted, onMounted } from 'vue'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { usePurchaseStore } from '~/stores/purchaseStore'
import { useRouter } from 'vue-router'
import scan from './scan.vue'

const router = useRouter()
const purchaseStore = usePurchaseStore()
const { $firestore } = useNuxtApp();
const db = $firestore;
const formattedDateTime = ref('')
const scannedCode = ref('')
const isCameraActive = ref(false)
const customer = ref('Walk-in')
const payment = ref('Cash')

let interval

onMounted(() => {
   updateDateTime()
   interval = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
   clearInterval(interval)
   isCameraActive.value = false
})

function updateDateTime() {
   const now = new Date()
   formattedDateTime.value = now.toLocaleString()
}

const products = ref([])

const subtotal = computed(() => products.value.reduce((sum, item) => sum + item.qty * item.price, 0))
const tax = computed(() => subtotal.value * 0.10)
const total = computed(() => subtotal.value + tax.value)

function removeItem(index) {
   products.value.splice(index, 1)
}

function toggleCamera() {
   isCameraActive.value = !isCameraActive.value
}

// On barcode scan, lookup item by ID
const handleScannedBarcode = async (barcode) => {
  if (!process.client) return;
  scannedCode.value = barcode;
  try {
    const q = query(collection(db, 'inventory'), where('itemId', '==', Number(barcode)));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0].data();
      const existing = products.value.find(item => item.id === doc.itemId);
      if (existing) {
        existing.qty += 1;
      } else {
        products.value.push({
          id: doc.itemId,
          name: doc.itemName,
          price: doc.itemPrice,
          qty: 1
        });
      }
    } else {
      alert('Item not found in inventory');
    }
  } catch (err) {
    console.error('Firebase error:', err); 
  }
};

function generateInvoiceNumber() {
  const now = new Date()
  return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${now.getTime()}`
}

const invoice = ref('')

onMounted(() => {
  invoice.value = generateInvoiceNumber()
})

// Call this when completing the sale
import { doc, setDoc } from 'firebase/firestore'
import { useNuxtApp } from '#app'

// Save receipt to Firestore under users/{userId}/receipts/{receiptId}
async function saveReceiptToFirestore({ items, total, invoiceNumber, customer, date, payment }) {
  const { $auth, $firestore } = useNuxtApp()
  const user = $auth.currentUser
  if (!user) throw new Error('User not authenticated')
  const userId = user.uid
  const timestamp = Date.now()
  const receiptId = `receipt-${timestamp}`
  const receiptData = {
    invoiceNumber,
    items,
    total,
    customer,
    date,
    payment,
    timestamp,
  }
  await setDoc(doc($firestore, 'users', userId, 'receipts', receiptId), receiptData)
  console.log('Receipt saved!')
}

async function completePurchase() {
  const invoiceId = generateInvoiceNumber()
  const items = products.value.map(item => ({
    itemId: item.id,
    itemName: item.name,
    quantity: item.qty,
    price: item.price
  }))
  const totalAmount = total.value
  const customerName = customer.value
  const dateValue = formattedDateTime.value
  const paymentMethod = payment.value

  try {
    await saveReceiptToFirestore({
      items,
      total: totalAmount,
      invoiceNumber: invoiceId,
      customer: customerName,
      date: dateValue,
      payment: paymentMethod
    })
    // Update the store for the receipt page
    purchaseStore.setPurchaseData({
      invoice: invoiceId,
      customer: customerName,
      date: dateValue,
      payment: paymentMethod,
      products: items,
      total: totalAmount,
      createdAt: new Date()
    })
    router.push('/purchase-receipt')
  } catch (err) {
    console.error('Failed to save receipt:', err)
    alert('Failed to save receipt.')
  }
}
</script>
