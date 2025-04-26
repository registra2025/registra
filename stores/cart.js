import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] // Each item: { id, name, price, qty, ... }
    }),
    actions: {
        addItem(product) {
            const existing = this.items.find(item => item.id === product.id)
            if (existing) {
                existing.qty += product.qty || 1
            } else {
                this.items.push({ ...product, qty: product.qty || 1 })
            }
        },
        removeItem(id) {
            this.items = this.items.filter(item => item.id !== id)
        },
        clearCart() {
            this.items = []
        }
    }
})
