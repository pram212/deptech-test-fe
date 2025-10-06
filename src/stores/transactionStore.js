import { defineStore } from 'pinia'
import {
  getTransactions,
  createTransaction,
  getTransaction,
  getProductOptions,
} from '@/api/transactions'
import { useAuthStore } from './auth'
import { reactive } from 'vue'
import { useToast } from 'vue-toastification'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const toast = useToast()

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [], // array riwayat transaksi
    products: [], // array opsi produk untuk dropdown
    loading: false,
    error: null,
    validationErrors: reactive({}),
  }),
  actions: {
    async loadTransactions(page = 1) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const res = await getTransactions(authStore.token, page)
        this.transactions = res.data || []
      } catch (err) {
        this.error = err.response?.data || err.message
      } finally {
        this.loading = false
      }
    },

    async fetchTransaction(id) {
      try {
        const authStore = useAuthStore()
        const res = await getTransaction(id, authStore.token)
        return res
      } catch (err) {
        throw err
      }
    },

    async addTransaction(data) {
      NProgress.start()
      // reset validation errors
      for (const key in this.validationErrors) delete this.validationErrors[key]
      try {
        const authStore = useAuthStore()
        await createTransaction(data, authStore.token)
        toast.success('Transaction created successfully!')
      } catch (err) {
        NProgress.done()
        if (err.response?.status === 422) {
          Object.assign(this.validationErrors, err.response.data.errors || {})
        } else {
          this.error = err.message
          toast.error('Failed to create transaction.')
        }
        throw err
      }
    },

    async loadProductOptions() {
      try {
        const authStore = useAuthStore()
        const res = await getProductOptions(authStore.token)
        this.products = res.data || []
      } catch (err) {
        throw err
      }
    },
  },
})
