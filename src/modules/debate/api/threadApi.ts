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
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT'
    adminNotes?: string
    createdAt: string
    updatedAt: string
}

export interface CreateThreadRequestData {
    title: string
    description?: string
    category?: string
    summary?: string
    priority?: 'LOW' | 'MEDIUM' | 'HIGH'
    expectedParticipants?: number | string
    images?: string[]
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

export const threadApi = {
    // User tạo yêu cầu thread mới
    async createThreadRequest(data: CreateThreadRequestData): Promise<ThreadRequest> {
        const response = await apiClient.post<{ data: ThreadRequest }>('/debate/threads/request', data)
        return response.data.data
    },

    // User xem danh sách yêu cầu của chính mình
    async getMyThreadRequests(page: number = 1, limit: number = 20): Promise<ThreadRequestsResponse> {
        const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
        const response = await apiClient.get<ThreadRequestsResponse>(
            `/debate/threads/requests/mine?${queryParams.toString()}`
        )
        return response.data
    },

    // Admin lấy danh sách yêu cầu thread
    async getThreadRequests(page: number = 1, limit: number = 20, status?: string): Promise<ThreadRequestsResponse> {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        })

        if (status) {
            queryParams.append('status', status)
        }

        const response = await apiClient.get<ThreadRequestsResponse>(
            `/debate/threads?${queryParams.toString()}`
        )
        return response.data
    },

    // Admin approve thread request và gán moderators
    async approveThreadRequest(requestId: string, data: ApproveThreadData): Promise<any> {
        const response = await apiClient.post<{ data: any }>(
            `/debate/threads/${requestId}/approve`,
            data
        )
        return response.data.data
    },

    // Admin reject thread request
    async rejectThreadRequest(requestId: string, reason: string): Promise<ThreadRequest> {
        const response = await apiClient.post<{ data: ThreadRequest }>(
            `/debate/threads/${requestId}/reject`,
            { reason }
        )
        return response.data.data
    },

    // Lấy chi tiết thread request
    async getThreadRequestById(requestId: string): Promise<ThreadRequest> {
        const response = await apiClient.get<{ data: ThreadRequest }>(`/debate/threads/requests/${requestId}`)
        return response.data.data
    }
}
