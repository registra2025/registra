<template>
    <div class="customer-sales">
        <h1>Customer Sales</h1>
        <div v-if="loading" class="loading">Loading sales...</div>
        <div v-else>
            <div v-if="sales.length === 0">No pending sales.</div>
            <div v-for="(sale, idx) in sales" :key="sale.id" class="sale-item">
                <div class="sale-summary" @click="toggleExpand(idx)" style="cursor:pointer;">
                    <div><strong>Invoice #:</strong> {{ sale.invoiceNumber }}</div>
                    <div><strong>Customer:</strong> {{ sale.customerName }}</div>
                    <div><strong>Total:</strong> {{ formatCurrency(sale.total) }}</div>
                    <div><strong>Date:</strong> {{ formatDate(sale.timestamp) }}</div>
                    <div class="dropdown-arrow">{{ expanded[idx] ? '▲' : '▼' }}</div>
                </div>
                <div v-if="expanded[idx]" class="sale-details">
                    <!-- Product Table -->
                    <div class="overflow-x-auto mb-4">
                        <table class="min-w-full text-left border">
                            <thead class="bg-gray-200">
                                <tr>
                                    <th class="px-4 py-2">Product</th>
                                    <th class="px-4 py-2">Qty</th>
                                    <th class="px-4 py-2">Price</th>
                                    <th class="px-4 py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in sale.items" :key="i" class="border-t">
                                    <td class="px-4 py-2">{{ item.itemName || item.name }}</td>
                                    <td class="px-4 py-2">{{ item.quantity ?? item.qty }}</td>
                                    <td class="px-4 py-2">{{ formatCurrency(item.price) }}</td>
                                    <td class="px-4 py-2">{{ formatCurrency((item.quantity ?? item.qty) * item.price) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Payment and Summary Info -->
                    <div class="summary-section mb-4">
                        <div>
                            <label class="block mb-1">Payment Method</label>
                            <select v-model="sale.payment" class="w-full border px-3 py-2 rounded text-blue-950 bg-white dark:bg-[#dcf0fd]">
                                <option>Cash</option>
                                <option>Card</option>
                                <option>Tabby</option>
                            </select>
                        </div>
                        <div><strong>Total:</strong> {{ formatCurrency(sale.total) }}</div>
                    </div>
                    <div class="flex gap-2">
                        <button @click="completeSale(sale, idx)">Complete Sale</button>
                        <button @click="cancelPendingSale(sale, idx)" class="bg-red-500 hover:bg-red-600">Cancel Sale</button>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth-global'
});
import { ref, onMounted } from 'vue'
import { getPendingSales, completeSaleAndSaveReceipt, cancelSale } from '~/utils/sales.js'

const sales = ref([])
const loading = ref(true)
const expanded = ref([]) // Track expanded state for each sale

const fetchSales = async () => {
    loading.value = true
    sales.value = await getPendingSales()
    expanded.value = sales.value.map(() => false)
    loading.value = false
}

const toggleExpand = (idx) => {
    expanded.value[idx] = !expanded.value[idx]
}

const cancelPendingSale = async (sale, idx) => {
    await cancelSale(sale.id)
    sales.value.splice(idx, 1)
    expanded.value.splice(idx, 1)
}


const completeSale = async (sale, idx) => {
    // Save receipt to Firestore for the customer, but do not show to employee
    await completeSaleAndSaveReceipt(sale)
    sales.value.splice(idx, 1)
    expanded.value.splice(idx, 1)
}

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return ''
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BHD',
    }).format(amount)
}

const formatDate = (ts) => ts ? new Date(ts).toLocaleString() : ''

onMounted(() => {
    fetchSales()
})
</script>

<style scoped>
.customer-sales {
    max-width: 800px;
    margin: 0 auto;
}
.sale-item {
    border: 1px solid #eee;
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: #fafafa;
}
.sale-summary {
    margin-bottom: 8px;
}
button {
    background: #2d8cf0;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}
button:hover {
    background: #1a73e8;
}
.loading {
    text-align: center;
    padding: 32px;
}
</style>
