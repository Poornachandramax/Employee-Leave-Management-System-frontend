import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
})

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message
      || (error.code === 'ERR_NETWORK'
        ? 'Cannot connect to the backend. Make sure Spring Boot is running at http://localhost:8080.'
        : error.message || 'Something went wrong.')
    return Promise.reject(new Error(message))
  }
)

export const authApi = {
  login: credentials => api.post('/api/auth/login', credentials).then(r => r.data)
}
export const leaveApi = {
  getMine: username => api.get('/api/leaves', { params: { username } }).then(r => r.data),
  create: payload => api.post('/api/leaves', payload).then(r => r.data),
  getBalance: username => api.get('/api/leave-balance', { params: { username } }).then(r => r.data),
  getAll: () => api.get('/api/admin/leaves').then(r => r.data),
  decide: (id, payload) => api.patch(`/api/admin/leaves/${id}`, payload).then(r => r.data)
}
export default api
