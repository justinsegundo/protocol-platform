import api from './axios'

export const search = (params) => api.get('/search', { params })