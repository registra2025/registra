<template>
  <section class="flex flex-col h-screen p-10 bg-gray-100">
    <div class="flex justify-between items-start gap-4">
      <NuxtLink to="/scanpr" class="w-[258px] h-40 bg-[#63bff7] text-blue-950 text-xl rounded-[7px] flex items-center justify-center transition hover:bg-blue-400 active:shadow-inner">
        SCAN
      </NuxtLink>
      <div class="w-74 h-40 bg-white shadow rounded p-4 overflow-hidden">
        <h3 class="text-lg font-semibold mb-2">Notifications</h3>
        <marquee direction="up" scrollamount="2" class="h-full">
          <div v-for="(n, i) in notifications" :key="i" class="py-1">{{ n }}</div>
        </marquee>
      </div>
    </div>
    <!-- Row 2: Charts Container -->
    <div class="mt-6">
      <div class="p-6">
        <h3 class="text-xl font-bold">Reports</h3>
      </div>
      <div class="bg-white shadow rounded p-5 flex gap-4 h-100">
        <div class="w-1/2 flex flex-col items-center">
          <h4 class="text-lg font-semibold mb-2 text-center">Inventory</h4>
          <PieChart :chartData="pieData" />
        </div>
        <div class="w-1/2 flex flex-col items-center">
          <h4 class="text-lg font-semibold -mb-2 text-center">Top Products</h4>
          <BarChart :chartData="barData" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { collection, collectionGroup, onSnapshot } from 'firebase/firestore'
import PieChart from '~/components/PieChart.vue'
import BarChart from '~/components/BarChart.vue'
import { useNuxtApp } from '#app'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({ middleware: 'auth-global' })

// Use shared notifications from inventory low-stock watcher
const { notifications } = useNotifications()

// Dynamic chart data
const pieData = ref({ labels: [], datasets: [{ data: [], backgroundColor: [] }] })
const barData = ref({ labels: [], datasets: [{ label: 'Stock Qty', data: [], backgroundColor: [] }] })

// Firestore references
const { $firestore } = useNuxtApp()
const inventory = ref([])
const receipts = ref([])

onMounted(() => {
  let unsubscribeInv = () => {}
  try {
    unsubscribeInv = onSnapshot(
      collection($firestore, 'inventory'),
      snapshot => { inventory.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) },
      error => { console.error('[inventory] snapshot error:', error) }
    )
  } catch (err) {
    console.error('Failed to subscribe to inventory:', err)
  }

  let unsubscribeSales = () => {}
  try {
    unsubscribeSales = onSnapshot(
      collection($firestore, 'completed_sales'),
      snapshot => { receipts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) },
      error => { console.error('[completed_sales] snapshot error:', error) }
    )
  } catch (err) {
    console.error('Failed to subscribe to completed_sales:', err)
  }

  let unsubscribeGroup = () => {}
  try {
    unsubscribeGroup = onSnapshot(
      collectionGroup($firestore, 'receipts'),
      snapshot => { receipts.value = receipts.value.concat(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))) },
      error => { console.error('[receipts] snapshot error:', error) }
    )
  } catch (err) {
    console.error('Failed to subscribe to receipts group:', err)
  }

  return () => {
    unsubscribeInv()
    unsubscribeSales()
    unsubscribeGroup()
  }
})

// Update pie chart on inventory changes
const colors = ['#63bff7', '#1c4375', '#dcf0fd', '#95d7fb', '#2966b1']
watch(inventory, (items) => {
  pieData.value.labels = items.map(i => i.itemName)
  pieData.value.datasets[0].data = items.map(i => i.itemQty)
  pieData.value.datasets[0].backgroundColor = items.map((_, idx) => colors[idx % colors.length])
}, { deep: true })

// Update bar chart with top 3 sold products
watch(receipts, receiptsList => {
  const counts = {}
  receiptsList.forEach(r => {
    (r.items || []).forEach(item => {
      const qty = item.quantity ?? item.qty ?? 0
      const label = item.itemName || item.name || 'Unknown'
      counts[label] = (counts[label] || 0) + qty
    })
  })
  const sorted = Object.entries(counts).sort(([,a], [,b]) => b - a)
  const top3 = sorted.slice(0, 3)
  barData.value.labels = top3.map(([name]) => name)
  barData.value.datasets[0].data = top3.map(([,qty]) => qty)
  barData.value.datasets[0].backgroundColor = top3.map((_, idx) => colors[idx % colors.length])
}, { deep: true })
</script>
