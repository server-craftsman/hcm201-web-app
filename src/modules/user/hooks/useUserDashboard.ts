'use client'

import { useState, useCallback } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { User } from '@/shared/types'

// Frontend-only types
interface DashboardStats {
    totalDebates: number
    totalArguments: number
    totalComments: number
    studyProgress: number
}

interface UserActivity {
    id: string
    type: 'debate' | 'argument' | 'comment' | 'study'
    title: string
    date: string
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