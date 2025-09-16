'use client'

import { useState, useEffect, useCallback } from 'react'
import { DebateTopic, SearchParams } from '@/shared/types'

// Frontend-only types
interface CreateDebateData {
    title: string
    description: string
    content: string
    category: string
    tags: string[]
    difficulty: string
}

interface UpdateDebateData extends CreateDebateData {
    id?: string
}

interface DebatesState {
    debates: DebateTopic[]
    totalCount: number
    isLoading: boolean
    error: string | null
    currentPage: number
    totalPages: number
}

interface UseDebatesParams {
    limit?: number
    autoLoad?: boolean
    filters?: {
        category?: string
        difficulty?: string
        search?: string
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
    }
}

interface UseDebatesReturn extends DebatesState {
    // Actions
    loadDebates: (page?: number) => Promise<void>
    createDebate: (data: CreateDebateData) => Promise<DebateTopic>
    updateDebate: (id: string, data: UpdateDebateData) => Promise<DebateTopic>
    deleteDebate: (id: string) => Promise<void>
    searchDebates: (params: SearchParams) => Promise<void>
    refreshDebates: () => Promise<void>

    // Filters
    setFilters: (filters: UseDebatesParams['filters']) => void
    resetFilters: () => void

    // Utils
    getDebateById: (id: string) => DebateTopic | undefined
    clearError: () => void
}

export function useDebates(params: UseDebatesParams = {}): UseDebatesReturn {
    const {
        limit = 20,
        autoLoad = true,
        filters: initialFilters = {}
    } = params

    const [state, setState] = useState<DebatesState>({
        debates: [],
        totalCount: 0,
        isLoading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
    })

    const [filters, setFilters] = useState(initialFilters)

    // Mock debates data
    const mockDebates: DebateTopic[] = [
        {
            id: '1',
            title: 'Tư tưởng Hồ Chí Minh về độc lập dân tộc có còn phù hợp trong thời đại toàn cầu hóa?',
            description: 'Thảo luận về sự phù hợp của tư tưởng độc lập dân tộc của Chủ tịch Hồ Chí Minh trong bối cảnh toàn cầu hóa hiện nay.',
            content: 'Nội dung chi tiết về chủ đề tranh luận...',
            category: 'national_independence',
            difficulty: 'advanced',
            tags: ['độc lập', 'toàn cầu hóa', 'dân tộc'],
            authorId: '1',
            status: 'published' as const,
            createdAt: new Date(),
            updatedAt: new Date().toISOString(),
        },
        // Add more mock debates as needed
    ]

    const loadDebates = useCallback(async (page: number = 1) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))

            setState(prev => ({
                ...prev,
                debates: mockDebates,
                totalCount: mockDebates.length,
                currentPage: page,
                totalPages: Math.ceil(mockDebates.length / limit),
                isLoading: false,
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'Có lỗi xảy ra khi tải danh sách tranh luận',
                isLoading: false,
            }))
        }
    }, [limit])

    const createDebate = useCallback(async (data: CreateDebateData): Promise<DebateTopic> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        const newDebate: DebateTopic = {
            id: Date.now().toString(),
            ...data,
            authorId: '1',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        setState(prev => ({
            ...prev,
            debates: [newDebate, ...prev.debates],
            totalCount: prev.totalCount + 1,
        }))

        return newDebate
    }, [])

    const updateDebate = useCallback(async (id: string, data: UpdateDebateData): Promise<DebateTopic> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        const updatedDebate = state.debates.find(d => d.id === id)
        if (!updatedDebate) {
            throw new Error('Debate not found')
        }

        const updated = { ...updatedDebate, ...data, updatedAt: new Date().toISOString() }

        setState(prev => ({
            ...prev,
            debates: prev.debates.map(debate => debate.id === id ? updated : debate),
        }))

        return updated
    }, [state.debates])

    const deleteDebate = useCallback(async (id: string): Promise<void> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        setState(prev => ({
            ...prev,
            debates: prev.debates.filter(debate => debate.id !== id),
            totalCount: prev.totalCount - 1,
        }))
    }, [])

    const searchDebates = useCallback(async (searchParams: SearchParams): Promise<void> => {
        // Simple frontend search simulation
        setState(prev => ({ ...prev, isLoading: true }))
        await new Promise(resolve => setTimeout(resolve, 500))

        const filtered = mockDebates.filter(debate =>
            searchParams.query ? debate.title.toLowerCase().includes(searchParams.query.toLowerCase()) : true
        )

        setState(prev => ({
            ...prev,
            debates: filtered,
            totalCount: filtered.length,
            isLoading: false,
        }))
    }, [])

    const refreshDebates = useCallback(async (): Promise<void> => {
        await loadDebates(state.currentPage)
    }, [loadDebates, state.currentPage])

    const handleSetFilters = useCallback((newFilters: UseDebatesParams['filters']) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }, [])

    const resetFilters = useCallback(() => {
        setFilters({})
    }, [])

    const getDebateById = useCallback((id: string): DebateTopic | undefined => {
        return state.debates.find(debate => debate.id === id)
    }, [state.debates])

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }))
    }, [])

    // Auto-load debates on mount
    useEffect(() => {
        if (autoLoad) {
            loadDebates(1)
        }
    }, [autoLoad, loadDebates])

    return {
        ...state,
        loadDebates,
        createDebate,
        updateDebate,
        deleteDebate,
        searchDebates,
        refreshDebates,
        setFilters: handleSetFilters,
        resetFilters,
        getDebateById,
        clearError,
    }
}

// Hook for single debate
export function useDebate(id: string) {
    const [debate, setDebate] = useState<DebateTopic | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadDebate = useCallback(async () => {
        if (!id) return

        try {
            setIsLoading(true)
            setError(null)

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Mock debate data (in real app, this would come from the API)
            const mockDebate: DebateTopic = {
                id,
                title: 'Mock Debate Title',
                description: 'Mock description',
                content: 'Mock content',
                category: 'independence',
                difficulty: 'basic',
                tags: ['mock', 'demo'],
                authorId: '1',
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            setDebate(mockDebate)
        } catch (error) {
            setError('Lấy thông tin tranh luận thất bại')
        } finally {
            setIsLoading(false)
        }
    }, [id])

    useEffect(() => {
        loadDebate()
    }, [loadDebate])

    const refreshDebate = useCallback(() => {
        return loadDebate()
    }, [loadDebate])

    return {
        debate,
        isLoading,
        error,
        refreshDebate,
        clearError: () => setError(null),
    }
}