import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { castVote } from '../../api/votes'
import { useNavigate } from 'react-router-dom'

export default function VoteButton({ votableType, votableId, upvoteCount, downvoteCount, userVote, onVoteChange }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [localUpvotes, setLocalUpvotes] = useState(upvoteCount)
  const [localDownvotes, setLocalDownvotes] = useState(downvoteCount)
  const [localUserVote, setLocalUserVote] = useState(userVote)

  const handleVote = async (type) => {
    if (!isAuthenticated) return navigate('/login')
    if (loading) return

    setLoading(true)

    const prevVote = localUserVote
    const prevUp = localUpvotes
    const prevDown = localDownvotes

    if (localUserVote === type) {
      setLocalUserVote(null)
      type === 'upvote' ? setLocalUpvotes(v => v - 1) : setLocalDownvotes(v => v - 1)
    } else {
      if (localUserVote === 'upvote') setLocalUpvotes(v => v - 1)
      if (localUserVote === 'downvote') setLocalDownvotes(v => v - 1)
      setLocalUserVote(type)
      type === 'upvote' ? setLocalUpvotes(v => v + 1) : setLocalDownvotes(v => v + 1)
    }

    try {
      const res = await castVote(votableType, votableId, type)
      setLocalUpvotes(res.data.upvote_count)
      setLocalDownvotes(res.data.downvote_count)
      setLocalUserVote(res.data.user_vote)
      onVoteChange?.(res.data)
    } catch {
      setLocalUserVote(prevVote)
      setLocalUpvotes(prevUp)
      setLocalDownvotes(prevDown)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleVote('upvote')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          localUserVote === 'upvote'
            ? 'bg-forest-700 text-cream'
            : 'bg-gray-100 text-muted hover:bg-forest-50 hover:text-forest-700'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2L11 7H8.5V12H5.5V7H3L7 2Z" fill="currentColor"/>
        </svg>
        <span>{localUpvotes}</span>
      </button>
      <button
        onClick={() => handleVote('downvote')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          localUserVote === 'downvote'
            ? 'bg-terra text-white'
            : 'bg-gray-100 text-muted hover:bg-red-50 hover:text-terra'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 12L3 7H5.5V2H8.5V7H11L7 12Z" fill="currentColor"/>
        </svg>
        <span>{localDownvotes}</span>
      </button>
    </div>
  )
}