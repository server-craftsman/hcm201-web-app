import { useState, useEffect } from 'react'
import { threadApi, ThreadRequest, CreateThreadRequestData, ApproveThreadData } from '@/modules/debate/api/threadApi'

interface UseThreadRequestsOptions {
    autoRefresh?: boolean
    refreshInterval?: number
    status?: 'PENDING' | 'APPROVED' | 'REJECTED'
}

interface UseThreadRequestsReturn {
    requests: ThreadRequest[]
    isLoading: boolean
    error: string | null
    createRequest: (data: CreateThreadRequestData) => Promise<ThreadRequest>
    approveRequest: (id: string, data: ApproveThreadData) => Promise<any>
    rejectRequest: (id: string, reason: string) => Promise<ThreadRequest>
    refreshRequests: () => Promise<void>
    isCreating: boolean
    isProcessing: boolean
}

export const useThreadRequests = ({
    autoRefresh = false,
    refreshInterval = 30000,
    status
}: UseThreadRequestsOptions = {}): UseThreadRequestsReturn => {
    const [requests, setRequests] = useState<ThreadRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch thread requests
    const fetchRequests = async () => {
        try {
            const response = await threadApi.getThreadRequests(1, 50, status)
            setRequests(response.data.items)
        } catch (err) {
            console.error('Error fetching thread requests:', err)
            setError('Không thể tải danh sách đề xuất chủ đề')
        }
    }

    // Initial data fetch
    const loadData = async () => {
        setIsLoading(true)
        setError(null)

        try {
            await fetchRequests()
        } catch (err) {
            console.error('Error loading thread requests:', err)
        } finally {
            setIsLoading(false)
        }
    }

    // Create new thread request
    const createRequest = async (data: CreateThreadRequestData): Promise<ThreadRequest> => {
        setIsCreating(true)
        setError(null)

        try {
            const newRequest = await threadApi.createThreadRequest(data)
            setRequests(prev => [newRequest, ...prev])
            return newRequest
        } catch (err) {
            console.error('Error creating thread request:', err)
            setError('Không thể tạo đề xuất chủ đề. Vui lòng thử lại.')
            throw err
        } finally {
            setIsCreating(false)
        }
    }

    // Approve thread request
    const approveRequest = async (id: string, data: ApproveThreadData): Promise<any> => {
        setIsProcessing(true)
        setError(null)

        try {
            const result = await threadApi.approveThreadRequest(id, data)

            // Update local state
            setRequests(prev => prev.map(req =>
                req._id === id
                    ? { ...req, status: 'APPROVED', adminNotes: data.adminNotes }
                    : req
            ))

            return result
        } catch (err) {
            console.error('Error approving thread request:', err)
            setError('Không thể phê duyệt đề xuất chủ đề. Vui lòng thử lại.')
            throw err
        } finally {
            setIsProcessing(false)
        }
    }

    // Reject thread request
    const rejectRequest = async (id: string, reason: string): Promise<ThreadRequest> => {
        setIsProcessing(true)
        setError(null)

        try {
            const rejectedRequest = await threadApi.rejectThreadRequest(id, reason)

            // Update local state
            setRequests(prev => prev.map(req =>
                req._id === id ? rejectedRequest : req
            ))

            return rejectedRequest
        } catch (err) {
            console.error('Error rejecting thread request:', err)
            setError('Không thể từ chối đề xuất chủ đề. Vui lòng thử lại.')
            throw err
        } finally {
            setIsProcessing(false)
        }
    }

    // Refresh function
    const refreshRequests = async () => {
        await fetchRequests()
    }

    // Auto refresh effect
    useEffect(() => {
        if (!autoRefresh) return

        const interval = setInterval(() => {
            fetchRequests()
        }, refreshInterval)

        return () => clearInterval(interval)
    }, [autoRefresh, refreshInterval, status])

    // Initial load effect
    useEffect(() => {
        loadData()
    }, [status])

    return {
        requests,
        isLoading,
        error,
        createRequest,
        approveRequest,
        rejectRequest,
        refreshRequests,
        isCreating,
        isProcessing
    }
}
