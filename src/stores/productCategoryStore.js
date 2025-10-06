import { defineStore } from 'pinia'
import {
  getProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  getProductCategory,
} from '@/api/productCategory'
import { useAuthStore } from './auth'
import { reactive } from 'vue'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const toast = useToast()

export const useProductCategoryStore = defineStore('productCategory', {
  state: () => ({
    productCategories: [],
    loading: false,
    error: null,
    validationErrors: reactive({}),
  }),
  actions: {
    async loadProductCategories(page = 1) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        this.productCategories = await getProductCategories(authStore.token, page)
      } catch (err) {
        this.error = err.response?.data || err.message
      } finally {
        this.loading = false
      }
    },
    async addProductCategory(data) {
      NProgress.start()
      for (const key in this.validationErrors) delete this.validationErrors[key]
      try {
        const authStore = useAuthStore()
        await createProductCategory(data, authStore.token)
        toast.success('Product category created successfully')
      } catch (err) {
        NProgress.done()
        if (err.response?.status === 422) {
          // ambil error validasi dari backend
          Object.assign(this.validationErrors, err.response.data.errors || {})
        } else {
          this.error = err.message
        }
        throw err
      }
    },
    async editProductCategory(id, data) {
      NProgress.start()
      try {
        for (const key in this.validationErrors) delete this.validationErrors[key]
        const authStore = useAuthStore()
        await updateProductCategory(id, data, authStore.token)
        toast.success('Product category updated successfully')
      } catch (err) {
        NProgress.done()
        if (err.response?.status === 422) {
          // ambil error validasi dari backend
          Object.assign(this.validationErrors, err.response.data.errors || {})
        } else {
          this.error = err.message
        }
        throw err
      }
    },
    async removeProductCategory(id) {
      try {
        // konfirmasi SweetAlert
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
        })
        if (!result.isConfirmed) return
        // hapus product category
        const authStore = useAuthStore()
        await deleteProductCategory(id, authStore.token)
        toast.success('Product category deleted successfully')
      } catch (err) {
        toast.error('Failed to delete product category', err.response.message || err.message)
        throw err
      }
    },
    async fetchProductCategory(id) {
      try {
        const authStore = useAuthStore()
        return await getProductCategory(id, authStore.token)
      } catch (err) {
        throw err
      }
    },
  },
})
