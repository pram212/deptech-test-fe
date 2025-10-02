import api from '@/plugins/axios'

// Semua function menerima token sebagai parameter
export const getProductCategories = async (token, page = 1) => {
  const response = await api.get('/product-categories', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page },
  })
  return response.data
}

export const getProductCategory = async (id, token) => {
  const response = await api.get(`/product-categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const createProductCategory = async (data, token) => {
  const response = await api.post('/product-categories', data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const updateProductCategory = async (id, data, token) => {
  const response = await api.put(`/product-categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const deleteProductCategory = async (id, token) => {
  const response = await api.delete(`/product-categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
