import api from '@/plugins/axios'

// Ambil semua transaksi
export const getTransactions = async (token, page = 1) => {
  const response = await api.get('/transactions', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page },
  })
  return response.data
}

// Ambil transaksi spesifik
export const getTransaction = async (id, token) => {
  const response = await api.get(`/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

// Tambah transaksi baru
export const createTransaction = async (data, token) => {
  const response = await api.post('/transactions', data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const getProductOptions = async (token) => {
  const response = await api.get('/options/products', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
