import { ref, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'
import { onSnapshot, collection } from 'firebase/firestore'

const notifications = ref([])

export function useNotifications() {
  const { $firestore } = useNuxtApp()
  const unsub = onSnapshot(
    collection($firestore, 'inventory'),
    snapshot => {
      notifications.value = snapshot.docs.map(doc => {
        const item = doc.data()
        // Strip 'by author' suffix and only show name and quantity
        const rawName = item.itemName || ''
        const name = rawName.includes(' by ') ? rawName.split(' by ')[0] : rawName
        if (item.itemQty < 20) return { message: `${name} is low on stock. Remaining: ${item.itemQty}`, severity: 'critical' }
        if (item.itemQty < 50) return { message: `${name} is low on stock. Remaining: ${item.itemQty}`, severity: 'warning' }
        return null
      }).filter(n => n)
    },
    err => console.error('Notification listener error:', err)
  )

  onUnmounted(() => unsub())
  return { notifications }
}
