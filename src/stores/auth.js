import { defineStore } from 'pinia'
import api from '../plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(credentials) {
      const res = await api.post('/login', credentials)
      this.token = res.data.access_token

      localStorage.setItem('token', this.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      await this.getUser()
    },
    async getUser() {
      const res = await api.get('/me', {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      this.user = res.data
    },
    async logout() {
      await api.post('/logout', {}, { headers: { Authorization: `Bearer ${this.token}` } })
      this.user = null
      this.token = null

      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    },
  },
})
