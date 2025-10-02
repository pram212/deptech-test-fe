import api from '@/plugins/axios'

// Semua function menerima token sebagai parameter
export const getUsers = async (token, page = 1) => {
  const response = await api.get('/users', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page },
  })
  return response.data
}

export const getUser = async (id, token) => {
  const response = await api.get(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const createUser = async (data, token) => {
  const response = await api.post('/users', data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const updateUser = async (id, data, token) => {
  const response = await api.put(`/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const deleteUser = async (id, token) => {
  const response = await api.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
