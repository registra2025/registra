<template>
   <div class="receipt bg-white text-black p-4 mx-auto my-4 transition-all" 
        style="width: 210mm; height: auto; font-family: sans-serif; max-height: 1500px;">
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
 
     <!-- Product Table -->
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
           <td>₦{{ (item.price || 0).toFixed(2) }}</td>
           <td>{{ item.quantity ?? item.qty }}</td>
           <td>₦{{ ((item.quantity ?? item.qty) * (item.price || 0)).toFixed(2) }}</td>
         </tr>
       </tbody>
     </table>
 
     <!-- Summary -->
     <div class="text-sm mt-4">
       <p><strong>Payment Method:</strong> {{ paymentMethod }}</p>
       <p><strong>Total:</strong> ₦{{ total.toFixed(2) }}</p>
     </div>
 
     <!-- Download Button -->
     <div class="mt-4">
       <button 
         @click="downloadReceipt" 
         class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
       >
         Download Receipt
       </button>
     </div>
 
     <div class="mt-6 text-center text-xs italic text-gray-500">
       Thank you for your purchase!
     </div>
   </div>
 </template>
 
 <script setup>
 import { ref } from 'vue'
 // Dynamic import of jsPDF will be used in downloadReceipt to avoid SSR issues
 
 const props = defineProps({
   invoiceNumber: String,
   customer: String,
   formattedDate: String,
   paymentMethod: String,
   products: Array,
   total: Number
 })
 

 // Download receipt as PDF
const downloadReceipt = async () => {
  // Dynamically import jsPDF only on client
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF('p', 'mm', 'a4') // PDF document setup (portrait mode, mm units, A4 paper size)

  // Set font size for the document
  doc.setFontSize(16)

  // Adding the invoice information to the PDF
  doc.setFontSize(16)
  doc.text("Invoice #" + props.invoiceNumber, 10, 10)
  doc.text("Customer: " + props.customer, 10, 20)
  doc.text("Date: " + props.formattedDate, 10, 30)
  doc.text("Payment Method: " + props.paymentMethod, 10, 40)
  doc.text("Total: ₦" + props.total.toFixed(2), 10, 50)

  // Adding the product list to the PDF
  doc.text("Items:", 10, 60)
  props.products.forEach((item, index) => {
    const yPos = 70 + (index * 10) // Calculating Y position for each item
    doc.text(`${item.itemName} (x${item.quantity || item.qty}) - ₦${(item.price * (item.quantity || item.qty)).toFixed(2)}`, 10, yPos)
  })
  
  // Saving the PDF file
  doc.save(`receipt-${props.invoiceNumber}.pdf`)
}

 </script>
 
 <style scoped>
 .receipt {
   max-width: 210mm;
   margin: 0 auto;
   padding: 20px;
 }
 
 .receipt table {
   width: 100%;
   border-collapse: collapse;
 }
 
 .receipt table th, .receipt table td {
   padding: 8px;
   text-align: left;
   border-bottom: 1px solid #ccc;
 }
 </style>
 