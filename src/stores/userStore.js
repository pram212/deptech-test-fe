import { defineStore } from 'pinia'
import { getUsers, createUser, updateUser, deleteUser, getUser } from '@/api/users'
import { useAuthStore } from './auth'
import { reactive } from 'vue'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const toast = useToast()

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
    validationErrors: reactive({}),
  }),
  actions: {
    async loadUsers(page = 1) {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        this.users = await getUsers(authStore.token, page)
      } catch (err) {
        this.error = err.response?.data || err.message
      } finally {
        this.loading = false
      }
    },
    async addUser(data) {
      NProgress.start()
      for (const key in this.validationErrors) delete this.validationErrors[key]
      try {
        const authStore = useAuthStore()
        await createUser(data, authStore.token)
        toast.success('User created successfully')
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
    async editUser(id, data) {
      NProgress.start()
      try {
        for (const key in this.validationErrors) delete this.validationErrors[key]
        const authStore = useAuthStore()
        await updateUser(id, data, authStore.token)
        toast.success('User updated successfully')
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
    async removeUser(id) {
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
        // hapus user
        const authStore = useAuthStore()
        await deleteUser(id, authStore.token)
        toast.success('User deleted successfully')
      } catch (err) {
        throw err
      }
    },
    async fetchUser(id) {
      try {
        const authStore = useAuthStore()
        return await getUser(id, authStore.token)
      } catch (err) {
        throw err
      }
    },
  },
})
