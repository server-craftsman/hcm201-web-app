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

// Mock data for development
const mockArguments: Argument[] = [
    {
        _id: 'arg1',
        title: 'Tư tưởng độc lập dân tộc',
        content: 'Hồ Chí Minh đã vận dụng tư tưởng độc lập dân tộc một cách sáng tạo trong việc giải phóng dân tộc Việt Nam.',
        threadId: 'thread123',
        authorId: 'user1',
        author: {
            _id: 'user1',
            email: 'nguyen.van.a@email.com',
            username: 'nguyenvana',
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            avatar: 'N'
        },
        argumentType: 'SUPPORT',
        status: 'APPROVED',
        isHighlighted: true,
        likesCount: 24,
        dislikesCount: 3,
        source: 'Toàn tập Hồ Chí Minh, tập 4',
        evidenceUrls: ['https://example.com/evidence1'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        __v: 0
    },
    {
        _id: 'arg2',
        title: 'Thực học gắn với hành động',
        content: 'Triết lý giáo dục của Hồ Chí Minh nhấn mạnh việc kết hợp lý thuyết với thực tiễn.',
        threadId: 'thread123',
        authorId: 'user2',
        author: {
            _id: 'user2',
            email: 'tran.thi.b@email.com',
            username: 'tranthib',
            firstName: 'Trần',
            lastName: 'Thị B',
            avatar: 'T'
        },
        argumentType: 'SUPPORT',
        status: 'PENDING',
        isHighlighted: false,
        likesCount: 12,
        dislikesCount: 1,
        source: 'Nghiên cứu giáo dục học',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        __v: 0
    }
]

export const argumentApi = {
    // Tạo luận điểm mới
    async createArgument(data: CreateArgumentData): Promise<Argument> {
        try {
            const response = await apiClient.post<{ data: Argument }>('/debate/arguments', data)
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for createArgument')

            // Create mock argument
            const mockArgument: Argument = {
                _id: `arg_${Date.now()}`,
                ...data,
                authorId: 'current_user',
                author: {
                    _id: 'current_user',
                    email: 'user@example.com',
                    username: 'user',
                    firstName: 'Người',
                    lastName: 'Dùng',
                    avatar: 'N'
                },
                status: 'PENDING',
                isHighlighted: false,
                likesCount: 0,
                dislikesCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                __v: 0
            }

            return mockArgument
        }
    },

    // Lấy danh sách luận điểm theo thread
    async getArguments(params: GetArgumentsParams = {}): Promise<ArgumentsResponse> {
        try {
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
        } catch (error) {
            console.warn('Backend not available, using mock data for getArguments')

            // Filter mock data based on params
            let filteredArguments = mockArguments

            if (params.threadId) {
                filteredArguments = filteredArguments.filter(arg => arg.threadId === params.threadId)
            }

            if (params.status) {
                filteredArguments = filteredArguments.filter(arg => arg.status === params.status)
            }

            if (params.argumentType) {
                filteredArguments = filteredArguments.filter(arg => arg.argumentType === params.argumentType)
            }

            return {
                statusCode: 200,
                message: 'Success',
                data: {
                    items: filteredArguments,
                    totalItems: filteredArguments.length,
                    page: params.page || 1,
                    limit: params.limit || 20,
                    totalPages: Math.ceil(filteredArguments.length / (params.limit || 20))
                },
                timestamp: new Date().toISOString()
            }
        }
    },

    // Lấy chi tiết một luận điểm
    async getArgumentById(id: string): Promise<Argument> {
        try {
            const response = await apiClient.get<{ data: Argument }>(`/debate/arguments/${id}`)
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for getArgumentById')

            const argument = mockArguments.find(arg => arg._id === id)
            if (!argument) {
                throw new Error('Argument not found')
            }

            return argument
        }
    },

    // Lấy các luận điểm do user hiện tại tạo
    async getMyArguments(page: number = 1, limit: number = 20): Promise<ArgumentsResponse> {
        try {
            const response = await apiClient.get<ArgumentsResponse>(`/debate/arguments/mine?page=${page}&limit=${limit}`)
            return response.data
        } catch (error) {
            console.warn('Backend not available, using mock data for getMyArguments')
            return {
                statusCode: 200,
                message: 'Success',
                data: {
                    items: mockArguments,
                    totalItems: mockArguments.length,
                    page,
                    limit,
                    totalPages: Math.ceil(mockArguments.length / limit)
                },
                timestamp: new Date().toISOString()
            }
        }
    },

    // Thực hiện hành động kiểm duyệt
    async moderateArgument(data: ModerationAction): Promise<Argument> {
        try {
            const response = await apiClient.post<{ data: Argument }>('/debate/moderate', data)
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for moderateArgument')

            const argument = mockArguments.find(arg => arg._id === data.argumentId)
            if (!argument) {
                throw new Error('Argument not found')
            }

            // Update mock argument based on action
            const updatedArgument = { ...argument }

            switch (data.action) {
                case 'APPROVE':
                    updatedArgument.status = 'APPROVED'
                    break
                case 'REJECT':
                    updatedArgument.status = 'REJECTED'
                    break
                case 'FLAG':
                    updatedArgument.status = 'FLAGGED'
                    break
                case 'HIGHLIGHT':
                    updatedArgument.isHighlighted = true
                    break
                case 'UNHIGHLIGHT':
                    updatedArgument.isHighlighted = false
                    break
            }

            if (data.notes) {
                updatedArgument.moderationNotes = data.notes
            }

            updatedArgument.updatedAt = new Date().toISOString()

            return updatedArgument
        }
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
        try {
            const response = await apiClient.post<{ data: Argument }>(`/debate/arguments/${argumentId}/feedback`, { feedback })
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for addFeedback')

            const argument = mockArguments.find(arg => arg._id === argumentId)
            if (!argument) {
                throw new Error('Argument not found')
            }

            // Update mock argument with feedback
            const updatedArgument = { ...argument }
            updatedArgument.moderationNotes = feedback
            updatedArgument.updatedAt = new Date().toISOString()

            return updatedArgument
        }
    },

    // Like/Unlike luận điểm
    async likeArgument(argumentId: string): Promise<{ likesCount: number; dislikesCount: number }> {
        try {
            const response = await apiClient.post<{ data: { likesCount: number; dislikesCount: number } }>(
                `/debate/arguments/${argumentId}/like`
            )
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for likeArgument')

            return {
                likesCount: Math.floor(Math.random() * 50) + 1,
                dislikesCount: Math.floor(Math.random() * 10)
            }
        }
    },

    // Dislike luận điểm
    async dislikeArgument(argumentId: string): Promise<{ likesCount: number; dislikesCount: number }> {
        try {
            const response = await apiClient.post<{ data: { likesCount: number; dislikesCount: number } }>(
                `/debate/arguments/${argumentId}/dislike`
            )
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for dislikeArgument')

            return {
                likesCount: Math.floor(Math.random() * 50),
                dislikesCount: Math.floor(Math.random() * 10) + 1
            }
        }
    },

    // Reply to argument
    async replyToArgument(argumentId: string, data: CreateReplyData): Promise<Reply> {
        try {
            const response = await apiClient.post<{ data: Reply }>(`/debate/arguments/${argumentId}/reply`, data)
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for replyToArgument')

            // Create mock reply
            const mockReply: Reply = {
                _id: `reply_${Date.now()}`,
                ...data,
                argumentId,
                authorId: {
                    _id: 'current_user',
                    email: 'user@example.com',
                    username: 'user',
                    firstName: 'Người',
                    lastName: 'Dùng',
                    avatar: 'N'
                },
                status: 'PENDING',
                upvotes: 0,
                downvotes: 0,
                score: 0,
                viewCount: 0,
                upvotedBy: [],
                downvotedBy: [],
                isHighlighted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                __v: 0
            }

            return mockReply
        }
    },

    // Get replies for an argument
    async getReplies(argumentId: string, page: number = 1, limit: number = 20): Promise<{ items: Reply[]; totalItems: number; page: number; limit: number }> {
        try {
            const response = await apiClient.get<{ data: { items: Reply[]; totalItems: number; page: number; limit: number } }>(`/debate/arguments/${argumentId}/replies`, {
                params: { page, limit }
            })
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for getReplies')

            // Return empty replies for now
            return {
                items: [],
                totalItems: 0,
                page,
                limit
            }
        }
    }
}
