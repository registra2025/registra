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
               <td class="py-1">{{ item.id }}</td>
               <td class="pb-1 italic text-gray-600">{{ item.name }}</td>
               <td>${{ item.price.toFixed(2) }}</td>
               <td>{{ item.qty }}</td>
               <td>${{ (item.qty * item.price).toFixed(2) }}</td>
            </tr>
            <!-- <tr v-for="(item, i) in products" :key="'name-' + i">
               <td colspan="4" class="pb-1 italic text-gray-600">{{ item.name }}</td>
            </tr> -->
         </tbody>
      </table>
      
      <!-- Payment Summary -->
      <div class="text-sm mt-4">
         <p><strong>Payment Method:</strong> {{ paymentMethod }}</p>
         <p><strong>Total:</strong> ${{ total.toFixed(2) }}</p>
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
import html2pdf from 'html2pdf.js'
import { ref, computed, onMounted } from 'vue'
import { usePurchaseStore } from '~/stores/purchaseStore'

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

// const downloadPDF = () => {
//   const element = document.querySelector('.receipt')
//   const options = {
//     margin: 10,
//     filename: `${invoiceNumber.value}.pdf`,
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: 'mm', format: [150, 210], orientation: 'portrait' }
//   }
//   html2pdf().set(options).from(element).save()
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
