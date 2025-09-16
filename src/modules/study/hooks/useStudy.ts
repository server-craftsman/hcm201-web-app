'use client'

import { useState, useEffect, useCallback } from 'react'
import { StudyCard, StudySession, StudyProgress } from '@/shared/types'
import { useState, useEffect, useCallback } from 'react'
import { StudyCard, StudySession, StudyProgress } from '@/shared/types'

// Frontend-only types
interface CreateStudyCardData {
    question: string
    answer: string
    category: string
    difficulty: string
}

interface CreateStudySessionData {
    cardIds: string[]
    sessionType: 'practice' | 'review' | 'test'
}

interface StudyAnswerData {
    cardId: string
    userAnswer: string
    isCorrect: boolean
    timeSpent: number
}

interface StudyState {
    cards: StudyCard[]
    sessions: StudySession[]
    currentSession: StudySession | null
    userStats: any | null
    isLoading: boolean
    error: string | null
}

interface UseStudyParams {
    autoLoadCards?: boolean
    autoLoadSessions?: boolean
}

interface UseStudyReturn extends StudyState {
    // Cards
    loadCards: (filters?: any) => Promise<void>
    createCard: (data: CreateStudyCardData) => Promise<StudyCard>
    updateCard: (id: string, data: Partial<CreateStudyCardData>) => Promise<StudyCard>
    deleteCard: (id: string) => Promise<void>

    // Sessions
    loadSessions: () => Promise<void>
    createSession: (data: CreateStudySessionData) => Promise<StudySession>
    loadSession: (id: string) => Promise<void>
    submitAnswer: (sessionId: string, data: StudyAnswerData) => Promise<StudyProgress>
    completeSession: (sessionId: string) => Promise<StudySession>

    // Stats and progress
    loadUserStats: () => Promise<void>
    getReviewCards: () => Promise<StudyCard[]>

    // Utils
    clearError: () => void
    refreshData: () => Promise<void>
}

export function useStudy(params: UseStudyParams = {}): UseStudyReturn {
    const { autoLoadCards = true, autoLoadSessions = true } = params

    const [state, setState] = useState<StudyState>({
        cards: [],
        sessions: [],
        currentSession: null,
        userStats: null,
        isLoading: false,
        error: null,
    })

    // Auto-load data on mount
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setState(prev => ({ ...prev, isLoading: true }))

                const promises = []
                if (autoLoadCards) promises.push(loadCards())
                if (autoLoadSessions) promises.push(loadSessions())

                await Promise.all(promises)
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải dữ liệu',
                }))
            } finally {
                setState(prev => ({ ...prev, isLoading: false }))
            }
        }

        loadInitialData()
    }, [autoLoadCards, autoLoadSessions])

    const loadCards = useCallback(async (filters?: any) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            const response = await StudyApiService.getStudyCards(filters)

            setState(prev => ({
                ...prev,
                cards: response.data,
                isLoading: false,
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Lấy danh sách thẻ học thất bại',
                isLoading: false,
            }))
        }
    }, [])

    const createCard = useCallback(async (data: CreateStudyCardData): Promise<StudyCard> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            const newCard = await StudyApiService.createStudyCard(data)

            setState(prev => ({
                ...prev,
                cards: [newCard, ...prev.cards],
                isLoading: false,
            }))

            return newCard
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Tạo thẻ học thất bại',
                isLoading: false,
            }))
            throw error
        }
    }, [])

    const updateCard = useCallback(async (id: string, data: Partial<CreateStudyCardData>): Promise<StudyCard> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            const updatedCard = await StudyApiService.updateStudyCard(id, data)

            setState(prev => ({
                ...prev,
                cards: prev.cards.map(card => card.id === id ? updatedCard : card),
                isLoading: false,
            }))

            return updatedCard
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Cập nhật thẻ học thất bại',
                isLoading: false,
            }))
            throw error
        }
    }, [])

    const deleteCard = useCallback(async (id: string): Promise<void> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            await StudyApiService.deleteStudyCard(id)

            setState(prev => ({
                ...prev,
                cards: prev.cards.filter(card => card.id !== id),
                isLoading: false,
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Xóa thẻ học thất bại',
                isLoading: false,
            }))
            throw error
        }
    }, [])

    const loadSessions = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            const response = await StudyApiService.getStudySessions()

            setState(prev => ({
                ...prev,
                sessions: response.data,
                isLoading: false,
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Lấy danh sách phiên học thất bại',
                isLoading: false,
            }))
        }
    }, [])

    const createSession = useCallback(async (data: CreateStudySessionData): Promise<StudySession> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            const newSession = await StudyApiService.createStudySession(data)

            setState(prev => ({
                ...prev,
                sessions: [newSession, ...prev.sessions],
                currentSession: newSession,
                isLoading: false,
            }))

            return newSession
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Tạo phiên học thất bại',
                isLoading: false,
            }))
            throw error
        }
    }, [])

    const loadSession = useCallback(async (id: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            const session = await StudyApiService.getStudySessionById(id)

            setState(prev => ({
                ...prev,
                currentSession: session,
                isLoading: false,
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Lấy thông tin phiên học thất bại',
                isLoading: false,
            }))
        }
    }, [])

    const submitAnswer = useCallback(async (sessionId: string, data: StudyAnswerData): Promise<StudyProgress> => {
        try {
            const progress = await StudyApiService.submitAnswer(sessionId, data)

            // Update current session if it matches
            setState(prev => ({
                ...prev,
                currentSession: prev.currentSession?.id === sessionId
                    ? {
                        ...prev.currentSession,
                        progress: [...(prev.currentSession.progress || []), progress],
                    }
                    : prev.currentSession,
            }))

            return progress
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Gửi câu trả lời thất bại',
            }))
            throw error
        }
    }, [])

    const completeSession = useCallback(async (sessionId: string): Promise<StudySession> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            const completedSession = await StudyApiService.completeStudySession(sessionId)

            setState(prev => ({
                ...prev,
                currentSession: prev.currentSession?.id === sessionId ? completedSession : prev.currentSession,
                sessions: prev.sessions.map(session =>
                    session.id === sessionId ? completedSession : session
                ),
                isLoading: false,
            }))

            return completedSession
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Hoàn thành phiên học thất bại',
                isLoading: false,
            }))
            throw error
        }
    }, [])

    const loadUserStats = useCallback(async () => {
        try {
            const stats = await StudyApiService.getUserStudyStats()

            setState(prev => ({
                ...prev,
                userStats: stats,
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Lấy thống kê học tập thất bại',
            }))
        }
    }, [])

    const getReviewCards = useCallback(async (): Promise<StudyCard[]> => {
        try {
            const reviewCards = await StudyApiService.getReviewCards()
            return reviewCards
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Lấy thẻ ôn tập thất bại',
            }))
            throw error
        }
    }, [])

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }))
    }, [])

    const refreshData = useCallback(async () => {
        const promises = []
        if (autoLoadCards) promises.push(loadCards())
        if (autoLoadSessions) promises.push(loadSessions())

        await Promise.all(promises)
        await loadUserStats()
    }, [autoLoadCards, autoLoadSessions, loadCards, loadSessions, loadUserStats])

    return {
        ...state,
        loadCards,
        createCard,
        updateCard,
        deleteCard,
        loadSessions,
        createSession,
        loadSession,
        submitAnswer,
        completeSession,
        loadUserStats,
        getReviewCards,
        clearError,
        refreshData,
    }
}