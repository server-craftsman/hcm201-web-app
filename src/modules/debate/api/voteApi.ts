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

export const voteApi = {
    // Bình chọn cho thread
    async vote(data: CreateVoteData): Promise<Vote> {
        const response = await apiClient.post<{ data: Vote }>('/debate/vote', data)
        return response.data.data
    },

    // Lấy thống kê votes cho thread
    async getVoteStats(threadId: string): Promise<VoteStats> {
        const response = await apiClient.get<{ data: VoteStats }>(`/debate/threads/${threadId}/votes/stats`)
        return response.data.data
    },

    // Lấy danh sách votes cho thread
    async getVotes(threadId: string, page: number = 1, limit: number = 20): Promise<VotesResponse> {
        const response = await apiClient.get<VotesResponse>(
            `/debate/threads/${threadId}/votes?page=${page}&limit=${limit}`
        )
        return response.data
    },

    // Lấy vote của user hiện tại cho thread
    async getMyVote(threadId: string): Promise<Vote | null> {
        const response = await apiClient.get<{ data: Vote | null }>(`/debate/threads/${threadId}/my-vote`)
        return response.data.data
    },

    // Xóa vote (unvote)
    async removeVote(threadId: string): Promise<boolean> {
        await apiClient.delete(`/debate/threads/${threadId}/vote`)
        return true
    },

    // Lấy danh sách bình chọn của user hiện tại
    async getMyVotes(page: number = 1, limit: number = 20): Promise<VotesResponse> {
        const response = await apiClient.get<VotesResponse>(`/debate/votes/mine?page=${page}&limit=${limit}`)
        return response.data
    }
}
