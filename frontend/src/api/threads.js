import api from './axios'

export const getThreads = (params) => api.get('/threads', { params })
export const getThread = (id) => api.get(`/threads/${id}`)
export const createThread = (data) => api.post('/threads', data)
export const updateThread = (id, data) => api.put(`/threads/${id}`, data)
export const deleteThread = (id) => api.delete(`/threads/${id}`)
export const getComments = (threadId) => api.get(`/threads/${threadId}/comments`)
export const createComment = (threadId, data) => api.post(`/threads/${threadId}/comments`, data)
export const deleteComment = (threadId, commentId) => api.delete(`/threads/${threadId}/comments/${commentId}`)