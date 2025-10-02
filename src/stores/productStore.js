import { defineStore } from 'pinia'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategoryOptions,
} from '@/api/product'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import { useAuthStore } from './auth'
import { reactive } from 'vue'
const toast = useToast()

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    productCategories: [],
    loading: false,
    error: null,
    validationErrors: reactive({}),
  }),
  actions: {
    async loadProducts(page = 1) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        this.products = await getProducts(authStore.token, page)
        console.log(this.products.data)
      } catch (err) {
        this.error = err.response?.data || err.message
      } finally {
        this.loading = false
      }
    },
    async addProduct(data) {
      for (const key in this.validationErrors) delete this.validationErrors[key]
      try {
        const authStore = useAuthStore()
        await createProduct(data, authStore.token)
        toast.success('Product created successfully')
      } catch (err) {
        if (err.response?.status === 422) {
          // ambil error validasi dari backend
          Object.assign(this.validationErrors, err.response.data.errors || {})
        } else {
          this.error = err.message
        }
        throw err
      }
    },
    async editProduct(id, data) {
      try {
        for (const key in this.validationErrors) delete this.validationErrors[key]
        const authStore = useAuthStore()
        await updateProduct(id, data, authStore.token)
        toast.success('Product updated successfully')
      } catch (err) {
        if (err.response?.status === 422) {
          // ambil error validasi dari backend
          Object.assign(this.validationErrors, err.response.data.errors || {})
        } else {
          this.error = err.message
        }
        throw err
      }
    },
    async removeProduct(id) {
      try {
        // konfirmasi SweetAlert
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        })

        if (!result.isConfirmed) return

        const authStore = useAuthStore()
        await deleteProduct(id, authStore.token)
        toast.success('Product deleted successfully')
      } catch (err) {
        throw err
      }
    },
    async fetchProduct(id) {
      try {
        const authStore = useAuthStore()
        return await getProduct(id, authStore.token)
      } catch (err) {
        throw err
      }
    },
    async loadProductCategoryOptions() {
      try {
        const authStore = useAuthStore()
        const res = await getProductCategoryOptions(authStore.token)
        this.productCategories = res.data || []
      } catch (err) {
        throw err
      }
    },
  },
})
