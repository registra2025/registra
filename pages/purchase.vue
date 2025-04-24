<template>
   <div class="p-4 bg-[#63bff7] min-h-screen text-gray-800 dark:text-white rounded-[17px] -m-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
         <h1 class="text-2xl text-blue-950 font-bold">New Purchase</h1>
         <NuxtLink
         to="/dashboard" class="bg-[#2170d4] text-white px-4 py-2 rounded hover:bg-blue-400">Go Back
      </NuxtLink>
      </div>
      
      <!-- Customer & Invoice Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <div>
            <label class="block mb-1">Customer Name</label>
            <div class="w-full border px-3 py-2 rounded text-blue-950 bg-white dark:bg-[#dcf0fd]">
               {{ customer }}
            </div>
         </div>
         <div>
            <label class="block mb-1">Invoice #</label>
            <!-- Invoice -->
            <input v-model="invoice" type="text" class="w-full border px-3 py-2 rounded text-blue-950 bg-white dark:bg-[#dcf0fd]" :placeholder="invoice" />
         </div>
         <div>
            <label class="block mb-1">Date & Time</label>
            <div class="w-full border px-3 py-2 rounded text-blue-950 bg-white dark:bg-[#dcf0fd]">
               {{ formattedDateTime }}
            </div>
         </div>
      </div>
      
      <!-- Barcode / Product Input -->
      <div class="flex items-center gap-4 mb-6">
         <input 
         type="text" 
         class="flex-1 border px-4 py-2 rounded text-blue-950 bg-white dark:bg-[#dcf0fd]" 
         placeholder="Scan barcode or enter product"
         v-model="scannedCode"
         />
         <button @click="handleManualBarcode" class="bg-[#2170d4] text-white px-4 py-2 rounded hover:bg-blue-400">
            Enter
         </button>
         <button @click="toggleCamera" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
            {{ isCameraActive ? 'Stop' : 'Scan' }}
         </button>
      </div>
      
      <!-- Product List Table -->
      <div class="overflow-x-auto max-h-[300px] overflow-y-auto mb-6 rounded border">
         <table class="min-w-full text-left border">
            <thead class="text-blue-950 bg-white dark:bg-[#c0e6fd]">
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
                   <!-- Qty Controls -->
        <td class="px-4 py-2">
          <div class="flex items-center space-x-2">
            <button
              @click="decreaseQty(index)"
              class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              :disabled="item.qty <= 1"
            >−</button>
            <span class="w-6 text-center">{{ item.qty }}</span>
            <button
              @click="increaseQty(index)"
              class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >+</button>
          </div>
        </td>
                  <td class="px-4 py-2">BHD {{ item.price }}</td>
                  <td class="px-4 py-2">BHD {{ item.qty * item.price }}</td>
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
               <select v-model="payment" class="w-full border px-3 py-2 rounded text-blue-950 bg-white dark:bg-[#dcf0fd]">
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
               </select>
            </div>
         </div>
         
         <div class="text-blue-950 bg-white dark:bg-[#dcf0fd] p-4 rounded space-y-2">
            <div class="flex justify-between">
               <span>Subtotal:</span>
               <span>BHD {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
               <span>Tax (10%):</span>
               <span>BHD {{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
               <span>Discount:</span>
               <span>BHD 0.00</span>
            </div>
            <div class="flex justify-between font-bold text-lg border-t pt-2">
               <span>Total:</span>
               <span>BHD {{ total.toFixed(2) }}</span>
            </div>
         </div>
      </div>
      
      <!-- Submit Button -->
      <div class="mt-6 flex justify-end">
               <button
      @click="completePurchase"
      class="bg-[#2170d4] text-white px-6 py-3 rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="products.length === 0"
      >
      Proceed to Counter
      </button>
      </div>
   
   <!-- Scan Component -->
   <scan v-if="isCameraActive" @scanBarcode="handleScannedBarcode" />
</div>
</template>

<script setup>

import { ref, computed, onUnmounted, onMounted } from 'vue'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { usePurchaseStore } from '~/stores/purchaseStore'
import { useCartStore } from '~/stores/cart'
import { useRouter } from 'vue-router'
import scan from './scan.vue'

const router = useRouter()
const purchaseStore = usePurchaseStore()
const { $firestore } = useNuxtApp();
const db = $firestore;
const formattedDateTime = ref('')
const scannedCode = ref('')
const isCameraActive = ref(false)
const payment = ref('Cash')

const customer = ref('Walk-in')

function generateInvoiceNumber() {
  const now = new Date()
  return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${now.getTime()}`
}

const invoice = ref('')

// Set customer name from email
onMounted(() => {
  updateDateTime()
  interval = setInterval(updateDateTime, 1000)

  const { $auth } = useNuxtApp()
  const email = $auth?.currentUser?.email
  if (email) {
    const nameFromEmail = email.split('@')[0]
    customer.value = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
  }

  invoice.value = generateInvoiceNumber()
})

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
const cartStore = useCartStore();

onMounted(async () => {
  // Sync cart to purchase table if sessionStorage.cartSync exists
  const cartSync = sessionStorage.getItem('cartSync');
  if (cartSync) {
    try {
      const items = JSON.parse(cartSync);
      for (const item of items) {
        await handleScannedBarcode(item.itemId, item.qty);
      }
    } catch (e) {
      console.error('Failed to sync cart to purchase:', e);
    }
    sessionStorage.removeItem('cartSync');
  }
})

const subtotal = computed(() => products.value.reduce((sum, item) => sum + item.qty * item.price, 0))
const tax = computed(() => subtotal.value * 0.10)
const total = computed(() => subtotal.value + tax.value)

function removeItem(index) {
   products.value.splice(index, 1)
}

function toggleCamera() {
   isCameraActive.value = !isCameraActive.value
}

const handleManualBarcode = () => {
  if (scannedCode.value.trim() !== '') {
    handleScannedBarcode(scannedCode.value.trim())
    scannedCode.value = '' // Clear the input after adding
  }
}

// On barcode scan, lookup item in inventory by numeric itemId or Firestore doc ID
const handleScannedBarcode = async (barcode, qty = 1) => {
  if (!process.client) return;
  scannedCode.value = barcode;
  try {
    let data;
    // Determine if code is numeric itemId
    if (/^\d+$/.test(barcode)) {
      // Numeric itemId lookup
      const q = query(collection(db, 'inventory'), where('itemId', '==', Number(barcode)));
      const snap = await getDocs(q);
      if (snap.empty) throw new Error('Item not found in inventory');
      data = snap.docs[0].data();
    } else {
      // Firestore doc ID lookup
      const docRef = doc(db, 'inventory', barcode);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Item not found in inventory');
      data = docSnap.data();
    }
    const idVal = data.itemId;
    // Add or update in products
    const existing = products.value.find(item => item.id === idVal);
    if (existing) {
      existing.qty += qty;
    } else {
      products.value.push({
        id: idVal,
        name: data.itemName,
        price: data.itemPrice,
        qty
      });
    }
  } catch (err) {
    console.error('Firebase or sync error:', err);
    alert(err.message);
  }
};

function increaseQty(index) {
  products.value[index].qty += 1;
}

function decreaseQty(index) {
  if (products.value[index].qty > 1) {
    products.value[index].qty -= 1;
  }
}

// Call this when completing the sale
import { setDoc } from 'firebase/firestore'
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
  if (products.value.length === 0) {
    alert('Error: No product entered. Please add at least one item before proceeding.');
    return; // Stop further execution
  }

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
    const { $auth, $firestore } = useNuxtApp()
    const user = $auth.currentUser
    if (!user) throw new Error('User not authenticated')
    const customerId = user.uid

    const pendingSale = {
      invoiceNumber: invoiceId,
      items,
      total: totalAmount,
      customerName,
      customerId,
      date: dateValue,
      payment: paymentMethod,
      timestamp: Date.now()
    }

    await setDoc(doc($firestore, 'pending_sales', `${invoiceId}-${customerId}`), pendingSale)
    // Clear form
   products.value = []
   scannedCode.value = ''
   payment.value = 'Cash'
   invoice.value = generateInvoiceNumber()


    alert('Your order has been sent to the counter. Please wait for the cashier to complete your sale.')
    alert('After the sale is completed please check your "My Receipts" section for your receipt.')
    // router.push('/waiting-for-counter') // Optional redirect
  } catch (err) {
    console.error('Failed to add pending sale:', err)
    alert('Failed to add pending sale.')
  }
}


</script>
