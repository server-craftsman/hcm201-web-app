import { useState, useEffect } from 'react'
import { voteApi, VoteStats, CreateVoteData, Vote } from '@/modules/debate/api/voteApi'

interface UseDebateVotingOptions {
    threadId: string
    autoRefresh?: boolean
    refreshInterval?: number
}

interface UseDebateVotingReturn {
    stats: VoteStats | null
    userVote: Vote | null
    isLoading: boolean
    error: string | null
    vote: (data: CreateVoteData) => Promise<void>
    removeVote: () => Promise<void>
    refreshStats: () => Promise<void>
    isVoting: boolean
}

export const useDebateVoting = ({
    threadId,
    autoRefresh = false,
    refreshInterval = 30000
}: UseDebateVotingOptions): UseDebateVotingReturn => {
    const [stats, setStats] = useState<VoteStats | null>(null)
    const [userVote, setUserVote] = useState<Vote | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isVoting, setIsVoting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch voting stats
    const fetchStats = async () => {
        if (!threadId) return

        try {
            const voteStats = await voteApi.getVoteStats(threadId)
            setStats(voteStats)
        } catch (err) {
            console.error('Error fetching vote stats:', err)
            setError('Không thể tải thống kê bình chọn')
        }
    }

    // Fetch user's vote
    const fetchUserVote = async () => {
        if (!threadId) return

        try {
            const vote = await voteApi.getMyVote(threadId)
            setUserVote(vote)
        } catch (err) {
            console.error('Error fetching user vote:', err)
            // Don't set error for user vote as it's optional
        }
    }

    // Initial data fetch
    const loadData = async () => {
        setIsLoading(true)
        setError(null)

        try {
            await Promise.all([
                fetchStats(),
                fetchUserVote()
            ])
        } catch (err) {
            console.error('Error loading voting data:', err)
        } finally {
            setIsLoading(false)
        }
    }

    // Vote function
    const vote = async (data: CreateVoteData) => {
        setIsVoting(true)
        setError(null)

        try {
            const newVote = await voteApi.vote(data)
            setUserVote(newVote)

            // Update stats optimistically
            if (stats) {
                const oldVoteType = userVote?.voteType
                const newVoteType = data.voteType

                let newSupportVotes = stats.support
                let newOpposeVotes = stats.oppose

                // Remove old vote
                if (oldVoteType === 'SUPPORT') {
                    newSupportVotes -= 1
                } else if (oldVoteType === 'OPPOSE') {
                    newOpposeVotes -= 1
                }

                // Add new vote
                if (newVoteType === 'SUPPORT') {
                    newSupportVotes += 1
                } else if (newVoteType === 'OPPOSE') {
                    newOpposeVotes += 1
                }

                const newTotalVotes = newSupportVotes + newOpposeVotes

                setStats({
                    ...stats,
                    support: newSupportVotes,
                    oppose: newOpposeVotes,
                    totalVotes: newTotalVotes,
                    supportPercentage: newTotalVotes > 0 ? Math.round((newSupportVotes / newTotalVotes) * 100) : 0,
                    opposePercentage: newTotalVotes > 0 ? Math.round((newOpposeVotes / newTotalVotes) * 100) : 0,
                    userVote: newVoteType
                })
            }

            // Fetch fresh stats to ensure accuracy
            setTimeout(fetchStats, 500)
        } catch (err) {
            console.error('Error voting:', err)
            setError('Không thể gửi bình chọn. Vui lòng thử lại.')
        } finally {
            setIsVoting(false)
        }
    }

    // Remove vote function
    const removeVote = async () => {
        if (!userVote) return

        setIsVoting(true)
        setError(null)

        try {
            await voteApi.removeVote(threadId)

            // Update stats optimistically
            if (stats) {
                const oldVoteType = userVote.voteType
                let newSupportVotes = stats.support
                let newOpposeVotes = stats.oppose

                if (oldVoteType === 'SUPPORT') {
                    newSupportVotes -= 1
                } else if (oldVoteType === 'OPPOSE') {
                    newOpposeVotes -= 1
                }

                const newTotalVotes = newSupportVotes + newOpposeVotes

                setStats({
                    ...stats,
                    support: newSupportVotes,
                    oppose: newOpposeVotes,
                    totalVotes: newTotalVotes,
                    supportPercentage: newTotalVotes > 0 ? Math.round((newSupportVotes / newTotalVotes) * 100) : 0,
                    opposePercentage: newTotalVotes > 0 ? Math.round((newOpposeVotes / newTotalVotes) * 100) : 0,
                    userVote: null
                })
            }

            setUserVote(null)

            // Fetch fresh stats to ensure accuracy
            setTimeout(fetchStats, 500)
        } catch (err) {
            console.error('Error removing vote:', err)
            setError('Không thể hủy bình chọn. Vui lòng thử lại.')
        } finally {
            setIsVoting(false)
        }
    }

    // Refresh function
    const refreshStats = async () => {
        await fetchStats()
    }

    // Auto refresh effect
    useEffect(() => {
        if (!autoRefresh || !threadId) return

        const interval = setInterval(() => {
            fetchStats()
        }, refreshInterval)

        return () => clearInterval(interval)
    }, [threadId, autoRefresh, refreshInterval])

    // Initial load effect
    useEffect(() => {
        if (threadId) {
            loadData()
        }
    }, [threadId])

    return {
        stats,
        userVote,
        isLoading,
        error,
        vote,
        removeVote,
        refreshStats,
        isVoting
    }
}
