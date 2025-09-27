import { useState, useEffect } from 'react'
import { debateApi, type GetDebateThreadsParams, type GetModerationQueueParams, type DebateThread, type DebateModerationItem } from '../api'

export interface UseDebateThreadsResult {
    threads: DebateThread[]
    loading: boolean
    error: string | null
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
    refetch: () => void
}

export interface UseModerationQueueResult {
    items: DebateModerationItem[]
    loading: boolean
    error: string | null
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
    refetch: () => void
}

export const useDebateThreads = (params: GetDebateThreadsParams = {}): UseDebateThreadsResult => {
    const [threads, setThreads] = useState<DebateThread[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [meta, setMeta] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    })

    const fetchThreads = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await debateApi.getDebateThreads(params)

            if (response.statusCode === 200) {
                setThreads(response.data.items)
                setMeta({
                    page: response.data.page,
                    limit: response.data.limit,
                    total: response.data.totalItems,
                    totalPages: Math.ceil(response.data.totalItems / response.data.limit)
                })
            } else {
                setError(response.message || 'Failed to fetch debate threads')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchThreads()
    }, [JSON.stringify(params)]) // Re-fetch when params change

    return {
        threads,
        loading,
        error,
        meta,
        refetch: fetchThreads
    }
}

export const useModerationQueue = (params: GetModerationQueueParams = {}): UseModerationQueueResult => {
    const [items, setItems] = useState<DebateModerationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [meta, setMeta] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    })

    const fetchModerationQueue = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await debateApi.getModerationQueue(params)

            if (response.statusCode === 200) {
                setItems(response.data.items)
                setMeta({
                    page: response.data.page,
                    limit: response.data.limit,
                    total: response.data.totalItems,
                    totalPages: Math.ceil(response.data.totalItems / response.data.limit)
                })
            } else {
                setError(response.message || 'Failed to fetch moderation queue')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchModerationQueue()
    }, [JSON.stringify(params)]) // Re-fetch when params change

    return {
        items,
        loading,
        error,
        meta,
        refetch: fetchModerationQueue
    }
}
