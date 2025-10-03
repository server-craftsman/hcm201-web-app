import { apiClient } from '@/core/utils/api'

// Argument Types
export interface Argument {
    _id: string
    title: string
    content: string
    threadId: string
    authorId: string
    author: {
        _id: string
        email: string
        username: string
        firstName: string
        lastName: string
        avatar?: string
    }
    argumentType: 'SUPPORT' | 'OPPOSE' | 'NEUTRAL'
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED'
    moderatorId?: string
    parentArgumentId?: string
    moderationNotes?: string
    isHighlighted: boolean
    likesCount: number
    dislikesCount: number
    source?: string
    evidenceUrls?: string[]
    createdAt: string
    updatedAt: string
    __v: number
}

export interface CreateArgumentData {
    title: string
    content: string
    threadId: string
    argumentType: 'SUPPORT' | 'OPPOSE' | 'NEUTRAL'
    source?: string
    evidenceUrls?: string[]
}

export interface Reply {
    _id: string
    content: string
    title: string
    source?: string
    evidenceUrls?: string[]
    argumentId?: string
    authorId?: string | {
        _id: string
        email: string
        username: string
        firstName: string
        lastName: string
        avatar?: string
    }
    author?: {
        _id: string
        email: string
        username: string
        firstName: string
        lastName: string
        avatar?: string
    }
    threadId?: {
        _id: string
        title: string
        status: string
    }
    parentArgumentId?: {
        _id: string
        title: string
        content: string
    }
    argumentType?: string
    status?: string
    upvotes?: number
    downvotes?: number
    score?: number
    viewCount?: number
    upvotedBy?: string[]
    downvotedBy?: string[]
    isHighlighted?: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

export interface CreateReplyData {
    content: string
    title: string
    source?: string
    evidenceUrls?: string[]
}

export interface ModerationAction {
    argumentId: string
    action: 'APPROVE' | 'REJECT' | 'FLAG' | 'HIGHLIGHT' | 'UNHIGHLIGHT'
    reason?: string
    notes?: string
}

export interface ArgumentsResponse {
    statusCode: number
    message: string
    data: {
        items: Argument[]
        totalItems: number
        page: number
        limit: number
        totalPages: number
    }
    timestamp: string
}

export interface GetArgumentsParams {
    threadId?: string
    status?: string
    argumentType?: string
    authorId?: string
    search?: string
    page?: number
    limit?: number
    sort?: string
}

export const argumentApi = {
    // Tạo luận điểm mới
    async createArgument(data: CreateArgumentData): Promise<Argument> {
        const response = await apiClient.post<{ data: Argument }>('/debate/arguments', data)
        return response.data.data
    },

    // Lấy danh sách luận điểm theo thread
    async getArguments(params: GetArgumentsParams = {}): Promise<ArgumentsResponse> {
        const queryParams = new URLSearchParams()

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString())
            }
        })

        const response = await apiClient.get<ArgumentsResponse>(
            `/debate/threads/${params.threadId}/arguments?${queryParams.toString()}`
        )
        return response.data
    },

    // Lấy chi tiết một luận điểm
    async getArgumentById(id: string): Promise<Argument> {
        const response = await apiClient.get<{ data: Argument }>(`/debate/arguments/${id}`)
        return response.data.data
    },

    // Lấy các luận điểm do user hiện tại tạo
    async getMyArguments(page: number = 1, limit: number = 20): Promise<ArgumentsResponse> {
        const response = await apiClient.get<ArgumentsResponse>(`/debate/arguments/mine?page=${page}&limit=${limit}`)
        return response.data
    },

    // Thực hiện hành động kiểm duyệt
    async moderateArgument(data: ModerationAction): Promise<Argument> {
        const response = await apiClient.post<{ data: Argument }>('/debate/moderate', data)
        return response.data.data
    },

    // Approve argument (convenience method)
    async approveArgument(argumentId: string, notes?: string): Promise<Argument> {
        return this.moderateArgument({
            argumentId,
            action: 'APPROVE',
            notes
        })
    },

    // Reject argument (convenience method)
    async rejectArgument(argumentId: string, notes?: string): Promise<Argument> {
        return this.moderateArgument({
            argumentId,
            action: 'REJECT',
            notes
        })
    },

    // Highlight argument (convenience method)
    async highlightArgument(argumentId: string, notes?: string): Promise<Argument> {
        return this.moderateArgument({
            argumentId,
            action: 'HIGHLIGHT',
            notes
        })
    },

    // Unhighlight argument (convenience method)
    async unhighlightArgument(argumentId: string, notes?: string): Promise<Argument> {
        return this.moderateArgument({
            argumentId,
            action: 'UNHIGHLIGHT',
            notes
        })
    },

    // Add feedback to argument
    async addFeedback(argumentId: string, feedback: string): Promise<Argument> {
        const response = await apiClient.post<{ data: Argument }>(`/debate/arguments/${argumentId}/feedback`, { feedback })
        return response.data.data
    },

    // Like/Unlike luận điểm
    async likeArgument(argumentId: string): Promise<{ likesCount: number; dislikesCount: number }> {
        const response = await apiClient.post<{ data: { likesCount: number; dislikesCount: number } }>(
            `/debate/arguments/${argumentId}/like`
        )
        return response.data.data
    },

    // Dislike luận điểm
    async dislikeArgument(argumentId: string): Promise<{ likesCount: number; dislikesCount: number }> {
        const response = await apiClient.post<{ data: { likesCount: number; dislikesCount: number } }>(
            `/debate/arguments/${argumentId}/dislike`
        )
        return response.data.data
    },

    // Reply to argument
    async replyToArgument(argumentId: string, data: CreateReplyData): Promise<Reply> {
        const response = await apiClient.post<{ data: Reply }>(`/debate/arguments/${argumentId}/reply`, data)
        return response.data.data
    },

    // Get replies for an argument
    async getReplies(argumentId: string, page: number = 1, limit: number = 20): Promise<{ items: Reply[]; totalItems: number; page: number; limit: number }> {
        const response = await apiClient.get<{ data: { items: Reply[]; totalItems: number; page: number; limit: number } }>(`/debate/arguments/${argumentId}/replies`, {
            params: { page, limit }
        })
        return response.data.data
    }
}
