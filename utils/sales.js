// utils/sales.js
import { collection, query, orderBy, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { useNuxtApp } from '#app'

// Fetch all pending sales for employees (e.g., from a 'pending_sales' collection)
export async function getPendingSales() {
  const { $firestore } = useNuxtApp()
  const snapshot = await getDocs(
    query(collection($firestore, 'pending_sales'), orderBy('timestamp', 'asc'))
  )
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function cancelSale(invoiceId, customerId) {
   const { $firestore } = useNuxtApp()
   const db = $firestore
 
   try {
     const pendingDocRef = doc(db, 'pending_sales', `${invoiceId}-${customerId}`)
     await deleteDoc(pendingDocRef)
     alert('Sale canceled successfully!')
   } catch (err) {
     console.error('Error canceling sale:', err)
     alert('Failed to cancel sale.')
   }
 }
 

// Complete a sale, save receipt for customer, and remove from pending
export async function completeSaleAndSaveReceipt(sale) {
  const { $firestore } = useNuxtApp()
  // Save to customer's receipts
  const receiptId = `receipt-${Date.now()}`
  const receiptData = {
    invoiceNumber: sale.invoiceNumber,
    items: sale.items,
    total: sale.total,
    customer: sale.customerName,
    date: sale.date,
    payment: sale.payment,
    timestamp: Date.now()
  }
  await setDoc(doc($firestore, 'users', sale.customerId, 'receipts', receiptId), receiptData)
  // Optionally, save to a global sales collection
  await setDoc(doc($firestore, 'completed_sales', receiptId), receiptData)
  // Remove from pending sales
  await deleteDoc(doc($firestore, 'pending_sales', sale.id))
}
