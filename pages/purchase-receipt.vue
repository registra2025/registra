<template>
    <div class="receipt bg-white text-black p-4 mx-auto" style="width: 210mm; height: 150mm; font-family: sans-serif;">
        <!-- Logo -->
        <div class="text-center mb-4">
            <img src="/reg_logo_rm.png" alt="Register Logo" class="mx-auto mb-2" style="max-height: 50px;" />
        </div>
        
        <!-- Invoice Info -->
        <div class="mb-4 text-sm">
            <p><strong>Invoice #:</strong> {{ invoiceNumber }}</p>
            <p><strong>Customer:</strong> {{ customer }}</p>
            <p><strong>Date:</strong> {{ formattedDate }}</p>
        </div>
        
        <!-- Product Details -->
        <table class="w-full text-xs mb-4">
            <thead>
                <tr class="border-t border-b">
                    <th class="text-left py-1">Item ID</th>
                    <th class="text-left">Item Name</th>
                    <th class="text-left">Price</th>
                    <th class="text-left">Qty</th>
                    <th class="text-left">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in products" :key="i" class="border-b">
                    <td class="py-1">{{ item.itemId || item.id }}</td>
                    <td class="pb-1 italic text-gray-600">{{ item.itemName || item.name }}</td>
                    <td>BHD {{ (item.price || 0).toFixed(2) }}</td>
                    <td>{{ item.quantity ?? item.qty }}</td>
                    <td>BHD {{ ((item.quantity ?? item.qty) * (item.price || 0)).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
        
        <!-- Payment Summary -->
        <div class="text-sm mt-4">
            <p><strong>Payment Method:</strong> {{ paymentMethod }}</p>
            <p><strong>Total:</strong> BHD{{ total.toFixed(2) }}</p>
        </div>
        
        <!-- PDF Download Button -->
        <div class="mt-4 flex justify-end">
            <!-- <button
            @click="downloadPDF"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            Download Receipt PDF
        </button> -->
    </div>
    
    <!-- Optional Notes Section -->
    <div class="mt-6 text-center text-xs italic text-gray-500">
        Thank you for your purchase! 
        <!-- Add custom messages or legal notices here -->
    </div>
</div>
</template>

<script setup>
import { useRoute } from 'vue-router'
// import html2pdf from 'html2pdf.js'
import { ref, computed, onMounted } from 'vue'
import { usePurchaseStore } from '~/stores/purchaseStore'
import { doc, setDoc } from 'firebase/firestore'
import { useNuxtApp } from '#app'

// Firestore save function
async function saveReceiptToFirestore({ customer, date, invoice, payment, products, total }) {
    const { $auth, $firestore } = useNuxtApp()
    const user = $auth.currentUser
    if (!user) {
        alert('User not authenticated')
        return
    }
    const userId = user.uid
    const receiptId = `receipt-${Date.now()}`
    const receiptData = {
        customer,
        date,
        invoice,
        payment,
        products,
        total,
        timestamp: Date.now()
    }
    try {
        await setDoc(doc($firestore, 'users', userId, 'receipts', receiptId), receiptData)
        alert('Receipt saved to Firestore!')
    } catch (err) {
        console.error('Error saving receipt:', err)
        alert('Failed to save receipt to Firestore.')
    }
}

const route = useRoute()
const purchaseStore = usePurchaseStore()

const invoiceNumber = ref(purchaseStore.invoice)
const customer = ref(purchaseStore.customer)
const formattedDate = ref(purchaseStore.date)
const paymentMethod = ref(purchaseStore.payment)
const products = ref(purchaseStore.products)

const total = computed(() =>
products.value.reduce((sum, item) => sum + item.qty * item.price, 0)
)

// Safe fallback if empty or invalid
let parsedProducts = []
try {
    parsedProducts = JSON.parse(route.query.products || '[]')
} catch (err) {
    console.error('Failed to parse products:', err)
}

//  const downloadPDF = async () => {
//   if (process.client) {
//     const html2pdf = (await import('html2pdf.js')).default
//     const element = document.querySelector('.receipt')
//     const options = {
//       margin: 10,
//       filename: `${invoiceNumber.value}.pdf`,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: 'mm', format: [150, 210], orientation: 'portrait' }
//     }
//     html2pdf().set(options).from(element).save()
//   }
// }

// onMounted(() => {
//   // Auto-download after 1 second delay
//   setTimeout(downloadPDF, 2000)
// })

onUnmounted(() => {
    purchaseStore.setPurchaseData({
        invoice: '',
        customer: '',
        date: '',
        payment: '',
        products: []
    })
})

</script>

<style scoped>
.receipt {
    border: 1px dashed #ccc;
    overflow: hidden;
}
</style>
