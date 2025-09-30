import { apiClient } from '@/core/utils/api'

// Vote Types
export interface Vote {
    _id: string
    threadId: string
    userId: string
    user: {
        _id: string
        email: string
        username: string
        firstName: string
        lastName: string
        avatar?: string
    }
    voteType: 'SUPPORT' | 'OPPOSE'
    createdAt: string
    updatedAt: string
    __v: number
}

export interface CreateVoteData {
    threadId: string
    voteType: 'SUPPORT' | 'OPPOSE'
}

export interface VoteStats {
    threadId: string
    totalVotes: number
    support: number
    oppose: number
    supportPercentage: number
    opposePercentage: number
    userVote?: 'SUPPORT' | 'OPPOSE' | null
}

export interface VotesResponse {
    statusCode: number
    message: string
    data: {
        items: Vote[]
        totalItems: number
        page: number
        limit: number
        totalPages: number
        stats: VoteStats
    }
    timestamp: string
}

// Mock data for development
const mockVotes: Vote[] = [
    {
        _id: 'vote1',
        threadId: 'thread123',
        userId: 'user1',
        user: {
            _id: 'user1',
            email: 'nguyen.van.a@email.com',
            username: 'nguyenvana',
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            avatar: 'N'
        },
        voteType: 'SUPPORT',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        __v: 0
    },
    {
        _id: 'vote2',
        threadId: 'thread123',
        userId: 'user2',
        user: {
            _id: 'user2',
            email: 'tran.thi.b@email.com',
            username: 'tranthib',
            firstName: 'Trần',
            lastName: 'Thị B',
            avatar: 'T'
        },
        voteType: 'OPPOSE',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        __v: 0
    }
]

export const voteApi = {
    // Bình chọn cho thread
    async vote(data: CreateVoteData): Promise<Vote> {
        try {
            const response = await apiClient.post<{ data: Vote }>('/debate/vote', data)
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for vote')

            // Create mock vote
            const mockVote: Vote = {
                _id: `vote_${Date.now()}`,
                threadId: data.threadId,
                userId: 'current_user',
                user: {
                    _id: 'current_user',
                    email: 'user@example.com',
                    username: 'user',
                    firstName: 'Người',
                    lastName: 'Dùng',
                    avatar: 'N'
                },
                voteType: data.voteType,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                __v: 0
            }

            return mockVote
        }
    },

    // Lấy thống kê votes cho thread
    async getVoteStats(threadId: string): Promise<VoteStats> {
        try {
            const response = await apiClient.get<{ data: VoteStats }>(`/debate/threads/${threadId}/votes/stats`)
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for getVoteStats')

            // Calculate mock stats
            const threadVotes = mockVotes.filter(vote => vote.threadId === threadId)
            const supportVotes = threadVotes.filter(vote => vote.voteType === 'SUPPORT').length
            const opposeVotes = threadVotes.filter(vote => vote.voteType === 'OPPOSE').length
            const totalVotes = supportVotes + opposeVotes

            return {
                threadId,
                totalVotes,
                support: supportVotes,
                oppose: opposeVotes,
                supportPercentage: totalVotes > 0 ? Math.round((supportVotes / totalVotes) * 100) : 0,
                opposePercentage: totalVotes > 0 ? Math.round((opposeVotes / totalVotes) * 100) : 0,
                userVote: null // Would be determined by current user's vote
            }
        }
    },

    // Lấy danh sách votes cho thread
    async getVotes(threadId: string, page: number = 1, limit: number = 20): Promise<VotesResponse> {
        try {
            const response = await apiClient.get<VotesResponse>(
                `/debate/threads/${threadId}/votes?page=${page}&limit=${limit}`
            )
            return response.data
        } catch (error) {
            console.warn('Backend not available, using mock data for getVotes')

            // Filter mock votes by thread
            const threadVotes = mockVotes.filter(vote => vote.threadId === threadId)

            // Calculate stats
            const supportVotes = threadVotes.filter(vote => vote.voteType === 'SUPPORT').length
            const opposeVotes = threadVotes.filter(vote => vote.voteType === 'OPPOSE').length
            const totalVotes = supportVotes + opposeVotes

            const stats: VoteStats = {
                threadId,
                totalVotes,
                support: supportVotes,
                oppose: opposeVotes,
                supportPercentage: totalVotes > 0 ? Math.round((supportVotes / totalVotes) * 100) : 0,
                opposePercentage: totalVotes > 0 ? Math.round((opposeVotes / totalVotes) * 100) : 0,
                userVote: null
            }

            return {
                statusCode: 200,
                message: 'Success',
                data: {
                    items: threadVotes,
                    totalItems: threadVotes.length,
                    page,
                    limit,
                    totalPages: Math.ceil(threadVotes.length / limit),
                    stats
                },
                timestamp: new Date().toISOString()
            }
        }
    },

    // Lấy vote của user hiện tại cho thread
    async getMyVote(threadId: string): Promise<Vote | null> {
        try {
            const response = await apiClient.get<{ data: Vote | null }>(`/debate/threads/${threadId}/my-vote`)
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for getMyVote')

            // Return null as user hasn't voted yet in mock
            return null
        }
    },

    // Xóa vote (unvote)
    async removeVote(threadId: string): Promise<boolean> {
        try {
            await apiClient.delete(`/debate/threads/${threadId}/vote`)
            return true
        } catch (error) {
            console.warn('Backend not available, using mock data for removeVote')
            return true
        }
    },

    // Lấy danh sách bình chọn của user hiện tại
    async getMyVotes(page: number = 1, limit: number = 20): Promise<VotesResponse> {
        try {
            const response = await apiClient.get<VotesResponse>(`/debate/votes/mine?page=${page}&limit=${limit}`)
            return response.data
        } catch (error) {
            console.warn('Backend not available, using mock data for getMyVotes')

            // Reuse mockVotes
            return {
                statusCode: 200,
                message: 'Success',
                data: {
                    items: mockVotes,
                    totalItems: mockVotes.length,
                    page,
                    limit,
                    totalPages: Math.ceil(mockVotes.length / limit),
                    stats: {
                        threadId: '',
                        totalVotes: mockVotes.length,
                        support: mockVotes.filter(v => v.voteType === 'SUPPORT').length,
                        oppose: mockVotes.filter(v => v.voteType === 'OPPOSE').length,
                        supportPercentage: 0,
                        opposePercentage: 0,
                        userVote: null
                    }
                },
                timestamp: new Date().toISOString()
            }
        }
    }
}
