// utils/sales.js
import { collection, query, orderBy, getDocs, doc, setDoc, deleteDoc, updateDoc, increment, getDoc, where } from 'firebase/firestore'
import { useNuxtApp } from '#app'

// Fetch all pending sales for employees (e.g., from a 'pending_sales' collection)
export async function getPendingSales() {
  const { $firestore } = useNuxtApp()
  const snapshot = await getDocs(
    query(collection($firestore, 'pending_sales'), orderBy('timestamp', 'asc'))
  )
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function cancelSale(saleId) {
  const { $firestore } = useNuxtApp()
  const db = $firestore

  try {
    const pendingDocRef = doc(db, 'pending_sales', saleId)
    await deleteDoc(pendingDocRef)
    alert('Sale canceled successfully!')
  } catch (err) {
    console.error('Error canceling sale:', err)
    alert('Failed to cancel sale.')
  }
}

// Decrement inventory quantities for each purchased item
export async function decrementInventoryQuantities(items) {
  const { $firestore } = useNuxtApp()
  for (const item of items) {
    // Query inventory by itemId field, not by doc ID
    const q = query(collection($firestore, 'inventory'), where('itemId', '==', item.itemId))
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      const inventoryDoc = snapshot.docs[0]
      const itemRef = doc($firestore, 'inventory', inventoryDoc.id)
      await updateDoc(itemRef, {
        itemQty: increment(-(item.quantity ?? item.qty ?? 1))
      })
    } else {
      console.warn(`Inventory item with itemId ${item.itemId} does not exist. Skipping.`)
    }
  }
}

// Complete a sale, save receipt for customer, decrement inventory, and remove from pending
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
  // Decrement inventory quantities
  await decrementInventoryQuantities(sale.items)
  // Remove from pending sales
  await deleteDoc(doc($firestore, 'pending_sales', sale.id))
}
