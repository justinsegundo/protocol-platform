import api from './axios'

export const castVote = (votableType, votableId, type) =>
  api.post('/votes', { votable_type: votableType, votable_id: votableId, type })