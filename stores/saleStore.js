import { defineStore } from 'pinia'

export const useSaleStore = defineStore('sale', {
  state: () => ({
    invoice: '',
    customer: '',
    date: '',
    payment: '',
    products: []
  }),
  actions: {
    setSaleData({ invoice, customer, date, payment, products }) {
      this.invoice = invoice
      this.customer = customer
      this.date = date
      this.payment = payment
      this.products = products
    }
  }
})
