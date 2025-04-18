import { defineStore } from 'pinia'

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
    }
  }
})
