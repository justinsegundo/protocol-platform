import api from './axios'

export const getProtocols = (params) => api.get('/protocols', { params })
export const getProtocol = (id) => api.get(`/protocols/${id}`)
export const createProtocol = (data) => api.post('/protocols', data)
export const updateProtocol = (id, data) => api.put(`/protocols/${id}`, data)
export const deleteProtocol = (id) => api.delete(`/protocols/${id}`)
export const createReview = (protocolId, data) => api.post(`/protocols/${protocolId}/reviews`, data)
export const updateReview = (protocolId, data) => api.put(`/protocols/${protocolId}/reviews`, data)
export const deleteReview = (protocolId) => api.delete(`/protocols/${protocolId}/reviews`)