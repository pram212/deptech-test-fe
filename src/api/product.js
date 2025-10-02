import api from '@/plugins/axios'

// Semua function menerima token sebagai parameter
export const getProducts = async (token, page = 1) => {
  const response = await api.get('/products', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page },
  })
  return response.data
}

export const getProduct = async (id, token) => {
  const response = await api.get(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const createProduct = async (data, token) => {
  const response = await api.post('/products', data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const updateProduct = async (id, data, token) => {
  const response = await api.post(`/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const deleteProduct = async (id, token) => {
  const response = await api.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const getProductCategoryOptions = async (token) => {
  const response = await api.get('/options/product-categories', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
