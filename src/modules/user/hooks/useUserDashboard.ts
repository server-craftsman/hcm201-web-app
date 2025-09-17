'use client'

import { useState, useEffect, useCallback } from 'react'
import { User } from '@/shared/types'

// Frontend-only types
interface DashboardStats {
    totalDebates: number
    totalArguments: number
    totalComments: number
    studyProgress: number
    upcomingReviews?: number
    achievements?: Array<{ name: string; description: string; icon?: string }>
    strongAreas?: string[]
    weakAreas?: string[]
}

interface UserActivity {
    id: string
    type: 'debate_created' | 'argument_submitted' | 'comment_posted' | 'study_session_completed' | 'achievement_unlocked' | string
    title: string
    date: string
    points?: number
}

interface UserDashboardState {
    stats: DashboardStats | null
    activity: UserActivity[]
    isLoading: boolean
    error: string | null
}

interface UseUserDashboardReturn extends UserDashboardState {
    loadDashboard: () => Promise<void>
    loadActivity: (params?: any) => Promise<void>
    refreshDashboard: () => Promise<void>
    clearError: () => void
}

// Temporary frontend-only mock service. Replace with real HTTP calls.
const UserApiService = {
    async getDashboardStats(): Promise<DashboardStats> {
        // Mocked data for UI; integrate your real API client here
        return Promise.resolve({
            totalDebates: 5,
            totalArguments: 23,
            totalComments: 41,
            studyProgress: 72,
            upcomingReviews: 8,
            achievements: [
                { name: 'Bắt đầu', description: 'Hoàn thành phiên học đầu tiên', icon: '🎯' },
                { name: 'Thảo luận sôi nổi', description: 'Tạo 3 tranh luận', icon: '🗣️' },
                { name: 'Chăm chỉ', description: 'Học 3 ngày liên tiếp', icon: '🔥' }
            ],
            strongAreas: ['Đạo đức', 'Tư tưởng', 'Lịch sử'],
            weakAreas: ['Kinh tế'],
        })
    },
    async getUserActivity(params?: any): Promise<{ data: UserActivity[] }> {
        const now = new Date()
        return Promise.resolve({
            data: [
                { id: '1', type: 'debate_created', title: 'Tạo tranh luận mới', date: now.toISOString(), points: 10 },
                { id: '2', type: 'argument_submitted', title: 'Gửi luận điểm', date: now.toISOString(), points: 5 },
                { id: '3', type: 'study_session_completed', title: 'Hoàn thành phiên học', date: now.toISOString(), points: 8 },
            ]
        })
    }
}

export function useUserDashboard(): UseUserDashboardReturn {
    const [state, setState] = useState<UserDashboardState>({
        stats: null,
        activity: [],
        isLoading: false,
        error: null,
    })

    const loadDashboard = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            // Load dashboard stats and recent activity in parallel
            const [stats, activityResponse] = await Promise.all([
                UserApiService.getDashboardStats(),
                UserApiService.getUserActivity({ limit: 10 })
            ])

            setState(prev => ({
                ...prev,
                stats,
                activity: activityResponse.data,
                isLoading: false,
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải dashboard',
                isLoading: false,
            }))
        }
    }, [])

    const loadActivity = useCallback(async (params?: any) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            const response = await UserApiService.getUserActivity(params)

            setState(prev => ({
                ...prev,
                activity: response.data,
                isLoading: false,
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải hoạt động',
                isLoading: false,
            }))
        }
    }, [])

    const refreshDashboard = useCallback(async () => {
        await loadDashboard()
    }, [loadDashboard])

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }))
    }, [])

    return {
        ...state,
        loadDashboard,
        loadActivity,
        refreshDashboard,
        clearError,
    }
}