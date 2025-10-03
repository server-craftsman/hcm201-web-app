import { apiClient } from '@/core/utils/api'

// Types for API responses
export interface DebateThread {
    _id: string
    title: string
    description: string
    status: 'ACTIVE' | 'CLOSED' | 'PENDING'
    createdBy: {
        _id: string
        email: string
        username: string
        firstName: string
        lastName: string
        avatar?: string
    }
    moderators: string[]
    totalVotes: number
    totalArguments: number
    totalApprovedArguments: number
    allowVoting: boolean
    allowArguments: boolean
    requireModeration: boolean
    isTicketRequest: boolean
    requestedBy: string
    createdAt: string
    updatedAt: string
    __v: number
    modForSideA?: string
    modForSideB?: string
}

export interface DebateModerationItem {
    id: string
    threadId: string
    argumentType: 'SUPPORT' | 'OPPOSE' | 'NEUTRAL'
    content: string
    authorId: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
    moderatorNotes?: string
}

export interface GetDebateThreadsParams {
    status?: string
    search?: string
    createdBy?: string
    moderatorId?: string
    page?: number
    limit?: number
    sort?: string
}

export interface GetModerationQueueParams {
    status?: string
    argumentType?: string
    threadId?: string
    search?: string
    page?: number
    limit?: number
    sort?: string
    groupBySide?: boolean
}

export interface ApiResponse<T> {
    statusCode: number
    message: string
    data: {
        items: T[]
        totalItems: number
        page: number
        limit: number
    }
    timestamp: string
}

export const debateApi = {
    // GET /api/v1/debate/threads
    async getDebateThreads(params: GetDebateThreadsParams = {}): Promise<ApiResponse<DebateThread>> {
        try {
            const queryParams = new URLSearchParams()

            if (params.status) queryParams.append('status', params.status)
            if (params.search !== undefined) queryParams.append('search', params.search)
            if (params.createdBy) queryParams.append('createdBy', params.createdBy)
            if (params.moderatorId) queryParams.append('moderatorId', params.moderatorId)
            if (params.page) queryParams.append('page', params.page.toString())
            if (params.limit) queryParams.append('limit', params.limit.toString())
            if (params.sort) queryParams.append('sort', params.sort)

            const url = `/debate/threads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
            const response = await apiClient.get<ApiResponse<DebateThread>>(url)

            return response.data
        } catch (error) {
            console.error('Error fetching debate threads:', error)
            // Return mock data for development
            return {
                statusCode: 200,
                message: 'Mock data for development',
                data: {
                    items: [
                        {
                            _id: '1',
                            title: 'Vai trò của tư tưởng Hồ Chí Minh trong xây dựng đất nước hiện đại',
                            description: 'Thảo luận về những ứng dụng cụ thể của tư tưởng Hồ Chí Minh trong việc xây dựng và phát triển đất nước Việt Nam trong thời kỳ hiện đại.',
                            status: 'ACTIVE' as const,
                            createdBy: {
                                _id: 'user123',
                                email: 'user123@example.com',
                                username: 'user123',
                                firstName: 'Nguyễn',
                                lastName: 'Văn A'
                            },
                            moderators: ['mod1', 'mod2'],
                            totalVotes: 23,
                            totalArguments: 15,
                            totalApprovedArguments: 12,
                            allowVoting: true,
                            allowArguments: true,
                            requireModeration: true,
                            isTicketRequest: false,
                            requestedBy: 'user123',
                            createdAt: '2024-01-15T10:30:00Z',
                            updatedAt: '2024-01-15T10:30:00Z',
                            __v: 0
                        },
                        {
                            _id: '2',
                            title: 'Tư tưởng đạo đức Hồ Chí Minh trong giáo dục',
                            description: 'Nghiên cứu về việc ứng dụng tư tưởng đạo đức của Bác Hồ trong hệ thống giáo dục Việt Nam hiện tại.',
                            status: 'ACTIVE' as const,
                            createdBy: {
                                _id: 'user456',
                                email: 'user456@example.com',
                                username: 'user456',
                                firstName: 'Trần',
                                lastName: 'Thị B'
                            },
                            moderators: ['mod3', 'mod4'],
                            totalVotes: 18,
                            totalArguments: 22,
                            totalApprovedArguments: 20,
                            allowVoting: true,
                            allowArguments: true,
                            requireModeration: true,
                            isTicketRequest: false,
                            requestedBy: 'user456',
                            createdAt: '2024-01-14T09:15:00Z',
                            updatedAt: '2024-01-14T09:15:00Z',
                            __v: 0
                        }
                    ],
                    totalItems: 2,
                    page: 1,
                    limit: 20
                },
                timestamp: new Date().toISOString()
            }
        }
    },

    // GET /api/v1/debate/moderation/queue  
    async getModerationQueue(params: GetModerationQueueParams = {}): Promise<ApiResponse<DebateModerationItem> | any> {
        try {
            const queryParams = new URLSearchParams()

            if (params.status) queryParams.append('status', params.status)
            if (params.argumentType) queryParams.append('argumentType', params.argumentType)
            if (params.threadId) queryParams.append('threadId', params.threadId)
            if (params.search) queryParams.append('search', params.search)
            if (params.page) queryParams.append('page', params.page.toString())
            if (params.limit) queryParams.append('limit', params.limit.toString())
            if (params.sort) queryParams.append('sort', params.sort)
            if (params.groupBySide) queryParams.append('groupBySide', params.groupBySide.toString())

            const url = `/debate/moderation/queue${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
            const response = await apiClient.get<ApiResponse<DebateModerationItem>>(url)

            return response.data
        } catch (error) {
            console.error('Error fetching moderation queue:', error)
            // Return mock data for development
            return {
                statusCode: 200,
                message: 'Mock data for development',
                data: {
                    items: [
                        {
                            id: 'mod1',
                            threadId: '1',
                            argumentType: 'SUPPORT',
                            content: 'Tôi hoàn toàn đồng ý với quan điểm này. Tư tưởng Hồ Chí Minh về xây dựng đất nước thực sự có ý nghĩa quan trọng trong bối cảnh hiện tại...',
                            authorId: 'user789',
                            status: 'PENDING',
                            createdAt: '2024-01-16T08:20:00Z'
                        },
                        {
                            id: 'mod2',
                            threadId: '1',
                            argumentType: 'OPPOSE',
                            content: 'Tuy nhiên, tôi cho rằng cần có những điều chỉnh phù hợp với thời đại. Một số quan điểm cần được cập nhật theo bối cảnh toàn cầu hóa...',
                            authorId: 'user012',
                            status: 'PENDING',
                            createdAt: '2024-01-16T07:45:00Z'
                        }
                    ],
                    totalItems: 2,
                    page: 1,
                    limit: 20
                },
                timestamp: new Date().toISOString()
            }
        }
    },

    // Update thread status (pause, close, etc.)
    updateThreadStatus: async (threadId: string, status: string, reason?: string) => {
        try {
            const response = await apiClient.patch(`/debate/threads/${threadId}/status`, {
                status,
                reason
            })
            return response.data
        } catch (error) {
            console.error('Failed to update thread status:', error)
            throw error
        }
    },

    // Approve thread request
    approveThreadRequest: async (threadId: string, moderators: { modForSideA: string, modForSideB: string }) => {
        try {
            const response = await apiClient.post(`/debate/threads/${threadId}/approve`, moderators)
            return response.data
        } catch (error) {
            console.error('Failed to approve thread request:', error)
            throw error
        }
    },

    // Reject thread request
    rejectThreadRequest: async (threadId: string, reason: string) => {
        try {
            const response = await apiClient.patch(`/debate/threads/${threadId}/reject`, { reason })
            return response.data
        } catch (error) {
            console.error('Failed to reject thread request:', error)
            throw error
        }
    },

    // Get thread status statistics
    getThreadStats: async () => {
        try {
            const response = await apiClient.get('/debate/admin/stats/threads')
            return response.data
        } catch (error) {
            console.error('Failed to get thread stats:', error)
            throw error
        }
    },

    // Get comprehensive admin dashboard statistics
    getAdminDashboard: async () => {
        try {
            const response = await apiClient.get('/debate/admin/dashboard')
            return response.data
        } catch (error) {
            console.error('Failed to get admin dashboard:', error)
            throw error
        }
    },

    // POST /api/v1/debate/moderate - Moderator performs moderation action on an argument
    moderateArgument: async (argumentId: string, action: 'APPROVE' | 'REJECT' | 'FLAG' | 'HIGHLIGHT' | 'UNHIGHLIGHT', reason?: string, notes?: string) => {
        try {
            const response = await apiClient.post('/debate/moderate', {
                argumentId,
                action,
                reason,
                notes
            })
            return response.data
        } catch (error) {
            console.error('Failed to moderate argument:', error)
            throw error
        }
    },

    // GET /api/v1/debate/moderator/moderation-stats - Get moderator's moderation statistics
    getModeratorStats: async () => {
        try {
            const response = await apiClient.get('/debate/moderator/moderation-stats')
            return response.data
        } catch (error) {
            console.error('Failed to get moderator stats:', error)
            throw error
        }
    },

    // GET /api/v1/debate/moderator/assigned-threads - Get threads assigned to current moderator
    getAssignedThreads: async (page: number = 1, limit: number = 20) => {
        try {
            const response = await apiClient.get('/debate/moderator/assigned-threads', {
                params: { page, limit }
            })
            return response.data
        } catch (error) {
            console.error('Failed to get assigned threads:', error)
            throw error
        }
    },

    // GET /api/v1/debate/moderator/dashboard - Get moderator dashboard data
    getModeratorDashboard: async () => {
        try {
            const response = await apiClient.get('/debate/moderator/dashboard')
            return response.data
        } catch (error) {
            console.error('Failed to get moderator dashboard:', error)
            throw error
        }
    },

    // GET /api/v1/debate/arguments/{id} - Get argument details
    getArgumentById: async (argumentId: string) => {
        try {
            const response = await apiClient.get(`/debate/arguments/${argumentId}`)
            return response.data
        } catch (error) {
            console.error('Failed to get argument details:', error)
            throw error
        }
    }
}
