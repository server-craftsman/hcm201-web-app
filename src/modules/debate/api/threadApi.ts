import { apiClient } from '@/core/utils/api'

// Thread Types
export interface ThreadRequest {
    _id: string
    title: string
    description?: string
    requestedBy: string
    requester: {
        _id: string
        email: string
        username: string
        firstName: string
        lastName: string
    }
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    adminNotes?: string
    createdAt: string
    updatedAt: string
}

export interface CreateThreadRequestData {
    title: string
    description?: string
}

export interface ApproveThreadData {
    modForSideA: string
    modForSideB: string
    adminNotes?: string
}

export interface ThreadRequestsResponse {
    statusCode: number
    message: string
    data: {
        items: ThreadRequest[]
        totalItems: number
        page: number
        limit: number
        totalPages: number
    }
    timestamp: string
}

// Mock data for development
const mockThreadRequests: ThreadRequest[] = [
    {
        _id: 'req1',
        title: 'Ảnh hưởng của tư tưởng Hồ Chí Minh đến giáo dục hiện đại',
        description: 'Thảo luận về việc ứng dụng tư tưởng giáo dục của Bác Hồ trong bối cảnh giáo dục đại học hiện nay',
        requestedBy: 'user1',
        requester: {
            _id: 'user1',
            email: 'nguyen.van.a@email.com',
            username: 'nguyenvana',
            firstName: 'Nguyễn',
            lastName: 'Văn A'
        },
        status: 'PENDING',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: 'req2',
        title: 'Triết lý độc lập dân tộc trong thời đại toàn cầu hóa',
        description: 'Phân tích mối quan hệ giữa độc lập dân tộc và hội nhập quốc tế theo tư tưởng Hồ Chí Minh',
        requestedBy: 'user2',
        requester: {
            _id: 'user2',
            email: 'tran.thi.b@email.com',
            username: 'tranthib',
            firstName: 'Trần',
            lastName: 'Thị B'
        },
        status: 'APPROVED',
        adminNotes: 'Chủ đề hay, phù hợp với chương trình học',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
]

export const threadApi = {
    // User tạo yêu cầu thread mới
    async createThreadRequest(data: CreateThreadRequestData): Promise<ThreadRequest> {
        try {
            const response = await apiClient.post<{ data: ThreadRequest }>('/debate/threads/request', data)
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for createThreadRequest')

            // Create mock thread request
            const mockRequest: ThreadRequest = {
                _id: `req_${Date.now()}`,
                title: data.title,
                description: data.description,
                requestedBy: 'current_user',
                requester: {
                    _id: 'current_user',
                    email: 'user@example.com',
                    username: 'user',
                    firstName: 'Người',
                    lastName: 'Dùng'
                },
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            return mockRequest
        }
    },

    // Admin lấy danh sách yêu cầu thread
    async getThreadRequests(page: number = 1, limit: number = 20, status?: string): Promise<ThreadRequestsResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            })

            if (status) {
                queryParams.append('status', status)
            }

            const response = await apiClient.get<ThreadRequestsResponse>(
                `/debate/threads/requests?${queryParams.toString()}`
            )
            return response.data
        } catch (error) {
            console.warn('Backend not available, using mock data for getThreadRequests')

            // Filter by status if provided
            let filteredRequests = mockThreadRequests
            if (status) {
                filteredRequests = mockThreadRequests.filter(req => req.status === status)
            }

            return {
                statusCode: 200,
                message: 'Success',
                data: {
                    items: filteredRequests,
                    totalItems: filteredRequests.length,
                    page,
                    limit,
                    totalPages: Math.ceil(filteredRequests.length / limit)
                },
                timestamp: new Date().toISOString()
            }
        }
    },

    // Admin approve thread request và gán moderators
    async approveThreadRequest(requestId: string, data: ApproveThreadData): Promise<any> {
        try {
            const response = await apiClient.post<{ data: any }>(
                `/debate/threads/${requestId}/approve`,
                data
            )
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for approveThreadRequest')

            // Mock approved thread
            const mockApprovedThread = {
                _id: `thread_${Date.now()}`,
                title: 'Thread được duyệt',
                description: 'Thread này đã được admin duyệt',
                status: 'ACTIVE',
                modForSideA: data.modForSideA,
                modForSideB: data.modForSideB,
                adminNotes: data.adminNotes,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            return mockApprovedThread
        }
    },

    // Admin reject thread request
    async rejectThreadRequest(requestId: string, reason: string): Promise<ThreadRequest> {
        try {
            const response = await apiClient.post<{ data: ThreadRequest }>(
                `/debate/threads/${requestId}/reject`,
                { reason }
            )
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for rejectThreadRequest')

            const request = mockThreadRequests.find(req => req._id === requestId)
            if (!request) {
                throw new Error('Thread request not found')
            }

            return {
                ...request,
                status: 'REJECTED',
                adminNotes: reason,
                updatedAt: new Date().toISOString()
            }
        }
    },

    // Lấy chi tiết thread request
    async getThreadRequestById(requestId: string): Promise<ThreadRequest> {
        try {
            const response = await apiClient.get<{ data: ThreadRequest }>(`/debate/threads/requests/${requestId}`)
            return response.data.data
        } catch (error) {
            console.warn('Backend not available, using mock data for getThreadRequestById')

            const request = mockThreadRequests.find(req => req._id === requestId)
            if (!request) {
                throw new Error('Thread request not found')
            }

            return request
        }
    }
}
