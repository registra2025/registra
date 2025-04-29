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
  // Write receipt to user if customerId is present and valid
  if (sale.customerId) {
    // Coerce DocumentReference or string to ID
    let customerIdStr = sale.customerId
    if (typeof sale.customerId !== 'string' && sale.customerId.id) {
      customerIdStr = sale.customerId.id
    }
    if (typeof customerIdStr === 'string') {
      try {
        await setDoc(
          doc(
            $firestore,
            'users',
            String(customerIdStr),
            'receipts',
            String(receiptId)
          ),
          receiptData
        )
      } catch (err) {
        console.error('Error saving user receipt:', err)
      }
    } else {
      console.warn('Invalid customerId on sale, skipping user receipt write:', sale.customerId)
    }
  } else {
    console.warn('No customerId on sale, skipping user receipt write')
  }
  // Optionally, save to a global sales collection
  await setDoc(doc($firestore, 'completed_sales', String(receiptId)), receiptData)
  // Record aggregated sales stats per item, skipping invalid IDs
  for (const item of sale.items) {
    const statsId = item.itemId ?? item.id
    if (typeof statsId !== 'string') {
      console.warn('Skipping sales_stats for item without valid id:', item)
      continue
    }
    const statsRef = doc($firestore, 'sales_stats', String(statsId))
    const statsSnap = await getDoc(statsRef)
    const qty = item.quantity ?? item.qty ?? 0
    if (!statsSnap.exists()) {
      await setDoc(statsRef, { itemName: item.itemName || item.name, qty })
    } else {
      await updateDoc(statsRef, { qty: increment(qty) })
    }
  }
  // Decrement inventory quantities
  await decrementInventoryQuantities(sale.items)
  // Remove from pending sales
  await deleteDoc(doc($firestore, 'pending_sales', String(sale.id)))
}
