import { defineStore } from 'pinia'
import { useFirebaseAuth } from 'vuefire'
import { doc, collection, addDoc } from 'firebase/firestore'
import { useNuxtApp } from '#app'

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    invoice: '',
    customer: '',
    date: '',
    payment: '',
    products: []
  }),
  actions: {
    setPurchaseData({ invoice, customer, date, payment, products }) {
      this.invoice = invoice
      this.customer = customer
      this.date = date
      this.payment = payment
      this.products = products
    },
    async savePurchaseToFirestore() {
      const { $firestore } = useNuxtApp()
      const auth = useFirebaseAuth()
      const user = auth?.currentUser
      if (!user) throw new Error('User not logged in')

      const userReceiptsRef = collection($firestore, 'users', user.uid, 'receipts')

      await addDoc(userReceiptsRef, {
        invoice: this.invoice,
        customer: this.customer,
        date: this.date,
        payment: this.payment,
        products: this.products,
        total: this.products.reduce((sum, item) => sum + item.qty * item.price, 0),
        createdAt: new Date()
      })
    }
  },
  persist: {
    enabled: true,
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined
  }
})
